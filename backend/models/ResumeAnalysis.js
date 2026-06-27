const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Match scores
  matchScores: {
    overall: {
      type: Number,
      min: 0,
      max: 100
    },
    skills: {
      type: Number,
      min: 0,
      max: 100
    },
    projects: {
      type: Number,
      min: 0,
      max: 100
    },
    certifications: {
      type: Number,
      min: 0,
      max: 100
    },
    experience: {
      type: Number,
      min: 0,
      max: 100
    },
    education: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Detailed analysis
  analysis: {
    strengths: [{
      category: String,
      items: [String],
      description: String
    }],
    weaknesses: [{
      category: String,
      items: [String],
      description: String,
      severity: String  // 'low', 'medium', 'high'
    }],
    missingSkills: [String],
    missingProjects: [{
      projectType: String,
      description: String,
      priority: String
    }],
    missingCertifications: [String],
    improvementSuggestions: [{
      area: String,
      suggestion: String,
      priority: String,
      estimatedTime: String
    }]
  },
  
  // AI-generated insights
  aiInsights: {
    summary: String,
    keyHighlights: [String],
    redFlags: [String],
    recommendations: [String]
  },
  
  // Skill gap analysis
  skillGap: {
    matched: [String],
    partiallyMatched: [String],
    missing: [String],
    additional: [String]  // Skills user has but company doesn't require
  },
  
  // Project gap analysis
  projectGap: {
    hasProjects: Boolean,
    projectCount: Number,
    recommendedProjects: [{
      title: String,
      description: String,
      technologies: [String],
      complexity: String
    }]
  },
  
  // Readiness level
  readiness: {
    current: {
      type: Number,
      min: 0,
      max: 100
    },
    target: {
      type: Number,
      min: 0,
      max: 100
    },
    gap: Number
  },
  
  // Analysis metadata
  analysisMetadata: {
    analyzedAt: {
      type: Date,
      default: Date.now
    },
    aiModel: String,
    analysisVersion: String,
    processingTime: Number  // in milliseconds
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

resumeAnalysisSchema.index({ userId: 1, companyId: 1 });
resumeAnalysisSchema.index({ resumeId: 1 });
resumeAnalysisSchema.index({ 'matchScores.overall': -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
