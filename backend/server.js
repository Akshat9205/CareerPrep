const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/CareerPrep';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log('✅ Connected to MongoDB - CareerPrep database'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

const User = require('./models/userModel');
const Module = require('./models/moduleModel');
const Contact = require('./models/contactModel');
const Interview = require('./models/interviewModel');

// ─── Seed hardcoded modules into DB (called once from Admin) ─────────────────
app.post('/api/modules/init', async (req, res) => {
  try {
    const { modules } = req.body; // array of { title, duration, category, type }
    let created = 0;
    for (const mod of modules) {
      const moduleId = mod.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const exists = await Module.findOne({ moduleId });
      if (!exists) {
        await Module.create({ ...mod, moduleId, published: true });
        created++;
      }
    }
    res.status(200).json({ success: true, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Get all modules with publish status (Admin) ─────────────────────────────
app.get('/api/admin/modules', async (req, res) => {
  try {
    const modules = await Module.find({}).sort({ type: 1, createdAt: 1 });
    res.status(200).json({ success: true, modules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Toggle publish / unpublish a module ─────────────────────────────────────
app.patch('/api/admin/modules/:moduleId/publish', async (req, res) => {
  try {
    const mod = await Module.findOne({ moduleId: req.params.moduleId });
    if (!mod) return res.status(404).json({ error: 'Module not found' });
    mod.published = !mod.published;
    await mod.save();
    res.status(200).json({ success: true, module: mod });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Get published modules only (Students) ───────────────────────────────────
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await Module.find({ published: true }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, modules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const UserProgress = require('./models/progressModel');



// Sync user details to MongoDB (called automatically on every user login)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, bio, authProvider } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and Email are required' });
    }

    const existingUser = await User.findOne({ email });
    let newStreak = 1;
    const now = new Date();

    if (existingUser && existingUser.lastActivity) {
      const last = new Date(existingUser.lastActivity);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak = (existingUser.streak || 0) + 1;
      } else if (diffDays === 0) {
        newStreak = existingUser.streak || 1;
      }
    }

    const updateData = {
      email,
      lastLogin: now,
      lastActivity: now,
      streak: newStreak
    };

    if (displayName) updateData.displayName = displayName;
    
    // Smart photo update: Don't overwrite a long Base64 string with a shorter/empty URL
    // unless it's explicitly provided (not during auto-sync) or it's a new valid URL.
    if (photoURL) {
      const existingPhoto = existingUser?.photoURL || "";
      
      // If we have an existing long photo and the new one is significantly shorter,
      // it's likely a sync from Firebase's limited profile, so we ignore it.
      if (!(existingPhoto.length > 1000 && photoURL.length < 500)) {
        updateData.photoURL = photoURL;
      }
    }

    if (bio) updateData.bio = bio;
    if (authProvider) updateData.authProvider = authProvider;

    updateData.uid = uid; // Ensure UID is updated if it changed in Firebase for the same email

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users for admin dashboard
app.get('/api/users', async (req, res) => {
  try {
    // Wait for mongoose to be ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected yet, please retry.' });
    }

    const users = await User.find({})
      .sort({ lastLogin: -1 })
      .select('uid email displayName photoURL authProvider createdAt lastLogin');

    res.status(200).json({ success: true, users, total: users.length });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save module progress
app.post('/api/progress/update', async (req, res) => {
  try {
    const { userId, moduleId, lessonIndex, totalLessons } = req.body;

    if (!userId || !moduleId) {
      return res.status(400).json({ error: 'UserId and ModuleId are required' });
    }

    // Find existing progress or create new one
    let progress = await UserProgress.findOne({ userId, moduleId });

    if (!progress) {
      progress = new UserProgress({ userId, moduleId, completedLessons: [] });
    }

    // Add lesson to completedLessons if not already there
    if (lessonIndex !== undefined && !progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    // Update progress percentage
    if (totalLessons) {
      progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
      if (progress.progressPercentage >= 100) {
        progress.isCompleted = true;
      }
    }

    progress.lastAccessed = new Date();
    await progress.save();

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Error updating progress:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress for a specific module
app.get('/api/progress/:userId/:moduleId', async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const progress = await UserProgress.findOne({ userId, moduleId });
    
    if (!progress) {
      return res.status(200).json({ success: true, progress: { completedLessons: [], progressPercentage: 0 } });
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching progress:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all progress for a user (for dashboard)
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.find({ userId });
    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching all progress:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific user details
app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      subject,
      message
    });
    res.status(201).json({ success: true, contact: newContact });
  } catch (error) {
    console.error('Error saving contact:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save an interview result
app.post('/api/interviews', async (req, res) => {
  try {
    const { userId, role, difficulty, overallScore, answers } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    
    const newInterview = await Interview.create({
      userId,
      role,
      difficulty,
      overallScore,
      answers
    });
    
    res.status(201).json({ success: true, interview: newInterview });
  } catch (error) {
    console.error('Error saving interview:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get interviews for a user
app.get('/api/interviews/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const interviews = await Interview.find({ userId }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
