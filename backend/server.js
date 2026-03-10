const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/CareerPrep';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (CareerPrep database)'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/userModel');

// Sync user details to MongoDB
app.post('/api/users/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, authProvider } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and Email are required' });
    }

    // Upsert user in MongoDB based on Firebase UID
    const user = await User.findOneAndUpdate(
      { uid },
      { 
        $set: { 
          email, 
          displayName: displayName || "", 
          photoURL: photoURL || "", 
          authProvider: authProvider || "email",
          lastLogin: new Date()
        } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
