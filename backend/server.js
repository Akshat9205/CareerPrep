require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(
  cors({
    origin: [
      "https://career-prep-sigma-eight.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
const avatarsDir = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads/resumes directory');
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log('📁 Created uploads/avatars directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Company model must be imported before seeding
const Company = require('./models/Company');

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/CareerPrep';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB - CareerPrep database');
    // Auto-seed companies if none exist
    const { seedCompanies } = require('./seed/companyData');
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log('🌱 No companies found, seeding...');
      await seedCompanies();
    } else {
      console.log(`📊 ${companyCount} companies already in database`);
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

const User = require('./models/userModel');
const Module = require('./models/moduleModel');
const Contact = require('./models/contactModel');
const Interview = require('./models/interviewModel');

// Resume Analysis Routes
const resumeAnalysisRoutes = require('./routes/resumeAnalysis');
app.use('/api/resume', resumeAnalysisRoutes);

// Company Routes (accessible at /api/companies)
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select('name logo industry website requirements interviewProcess culture brandColor');
    res.json({ success: true, data: companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch companies' });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch company' });
  }
});

// Top-level Roadmap Routes (frontend calls /api/roadmap directly)
const { generateRoadmap, getRoadmap } = require('./controllers/resumeAnalysisController');
const { authenticate } = require('./middleware/auth');
app.post('/api/roadmap', authenticate, generateRoadmap);
app.get('/api/roadmap/:userId', authenticate, getRoadmap);

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
      const isHostedAvatar = photoURL.startsWith('http') && photoURL.includes('/uploads/avatars/');
      const isExplicitProfilePhoto = photoURL.startsWith('data:') || isHostedAvatar;

      if (isExplicitProfilePhoto || !(existingPhoto.length > 1000 && photoURL.length < 500)) {
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

// Upload profile avatar
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarsDir),
  filename: (req, file, cb) => {
    const uid = req.body.uid || 'user';
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${uid}-${Date.now()}${ext}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed'));
  }
});

app.post('/api/users/avatar', (req, res) => {
  avatarUpload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }

    try {
      const { uid, email } = req.body;
      if (!uid || !req.file) {
        return res.status(400).json({ success: false, message: 'UID and avatar file are required' });
      }

      const photoURL = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

      let user = await User.findOneAndUpdate(
        { uid },
        { $set: { photoURL } },
        { returnDocument: 'after' }
      );

      if (!user && email) {
        user = await User.findOneAndUpdate(
          { email },
          { $set: { uid, photoURL } },
          { returnDocument: 'after' }
        );
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, photoURL, user });
    } catch (error) {
      console.error('Avatar upload error:', error.message);
      res.status(500).json({ success: false, message: 'Failed to upload avatar' });
    }
  });
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
