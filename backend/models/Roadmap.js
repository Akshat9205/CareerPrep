const mongoose = require('mongoose');

const taskResourceSchema = new mongoose.Schema({
  type: { type: String },
  title: String,
  link: String,
  platform: String
}, { _id: false });

const skillResourceSchema = new mongoose.Schema({
  type: { type: String },
  title: String,
  link: String,
  duration: String,
  difficulty: String
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  resumeAnalysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeAnalysis',
    required: true
  },
  
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Target information
  target: {
    company: String,
    role: String,
    targetMatchScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Current status
  currentStatus: {
    readiness: {
      type: Number,
      min: 0,
      max: 100
    },
    estimatedTimeline: String,  // "3 months", "6 months"
    confidenceLevel: String    // "high", "medium", "low"
  },
  
  // Milestones
  milestones: [{
    month: Number,
    title: String,
    description: String,
    tasks: [{
      task: String,
      priority: String,          // "high", "medium", "low"
      category: String,          // "skill", "project", "certification", "practice"
      estimatedTime: String,
      resources: [taskResourceSchema],
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    expectedOutcome: String,
    matchScoreImpact: Number     // How much this milestone improves match score
  }],
  
  // Skill development plan
  skillPlan: [{
    skill: String,
    currentLevel: String,        // "beginner", "intermediate", "advanced"
    targetLevel: String,
    resources: [skillResourceSchema],
    practiceProjects: [String],
    estimatedCompletionTime: String
  }],
  
  // Project recommendations
  projectRecommendations: [{
    title: String,
    description: String,
    technologies: [String],
    complexity: String,
    estimatedTime: String,
    learningOutcomes: [String],
    githubTemplate: String,
    priority: String
  }],
  
  // Certification recommendations
  certificationRecommendations: [{
    name: String,
    issuer: String,
    description: String,
    link: String,
    cost: String,
    duration: String,
    difficulty: String,
    priority: String,
    validity: String
  }],
  
  // Progress tracking
  progress: {
    totalMilestones: Number,
    completedMilestones: Number,
    totalTasks: Number,
    completedTasks: Number,
    overallProgress: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // AI-generated insights
  aiInsights: {
    summary: String,
    keyChallenges: [String],
    successFactors: [String],
    alternativePaths: [{
      description: String,
      timeline: String,
      tradeoffs: [String]
    }]
  },
  
  // Metadata
  metadata: {
    generatedAt: {
      type: Date,
      default: Date.now
    },
    aiModel: String,
    version: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'archived'],
    default: 'active'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roadmapSchema.index({ userId: 1, companyId: 1 });
roadmapSchema.index({ status: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
