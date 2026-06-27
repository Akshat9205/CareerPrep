const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // File info
  fileInfo: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Parsed content
  parsedData: {
    // Personal info
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String
    },
    
    // Education
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String,
      coursework: [String]
    }],
    
    // Experience
    experience: [{
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      location: String,
      description: String,
      technologies: [String],
      achievements: [String]
    }],
    
    // Projects
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      startDate: String,
      endDate: String,
      link: String,
      github: String,
      role: String
    }],
    
    // Skills
    skills: {
      technical: [String],
      soft: [String],
      tools: [String],
      languages: [String]
    },
    
    // Certifications
    certifications: [{
      name: String,
      issuer: String,
      issueDate: String,
      expiryDate: String,
      credentialId: String,
      link: String
    }],
    
    // Achievements
    achievements: [{
      title: String,
      description: String,
      date: String
    }],
    
    // Raw text for AI analysis
    rawText: String
  },
  
  // Analysis status
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Last analysis timestamp
  lastAnalyzedAt: Date,
  
  // Target companies for which this resume was analyzed
  analyzedFor: [{
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
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

resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
