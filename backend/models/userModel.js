const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  bio: { type: String, default: "" },
  authProvider: { type: String, default: "email" },
  streak: { type: Number, default: 1 },
  hoursLearned: { type: Number, default: 0 },
  mockInterviews: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
}, {
  collection: 'user', // Enforce specific collection name shown in screenshot
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
