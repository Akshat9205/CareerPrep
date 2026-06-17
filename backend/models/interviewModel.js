const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
  },
  answers: [{
    questionId: Number,
    questionText: String,
    answerText: String,
    score: Number,
    strengths: [String],
    improvements: [String],
  }],
  completedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
