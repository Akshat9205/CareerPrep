const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // UID from Firebase/Auth
  moduleId: { type: String, required: true },
  completedLessons: { type: [Number], default: [] },
  isCompleted: { type: Boolean, default: false },
  progressPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index to ensure unique progress entry per user per module
userProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
