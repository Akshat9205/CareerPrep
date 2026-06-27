const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: String,
  brandColor: String,
  website: String,
  industry: String,
  
  // Company-specific requirements
  requirements: {
    mustHaveSkills: [String],      // Required skills
    preferredSkills: [String],     // Nice-to-have skills
    technologies: [String],        // Tech stack
    certifications: [String],      // Preferred certifications
    projectTypes: [String],        // Types of projects they look for
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior']
    },
    education: {
      minimum: String,             // "Bachelor's", "Master's"
      preferred: [String]          // ["CS", "Engineering"]
    }
  },
  
  // Interview process info
  interviewProcess: {
    rounds: [{
      roundType: String,                // "Technical", "Behavioral", "System Design"
      duration: String,
      focus: [String]
    }],
    oaPattern: String
  },
  
  // Company culture fit
  culture: {
    values: [String],
    workStyle: String,
    teamSize: String
  },
  
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

companySchema.index({ name: 1 });
companySchema.index({ 'requirements.mustHaveSkills': 1 });

module.exports = mongoose.model('Company', companySchema);
