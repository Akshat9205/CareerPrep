const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  // Source API info
  source: {
    type: String,
    enum: ['jsearch', 'adzuna', 'jooble', 'manual'],
    required: true
  },
  sourceId: String,  // ID from the source API
  
  // Basic job info
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  companyLogo: String,
  
  // Location
  location: {
    country: String,
    city: String,
    state: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  
  // Job details
  description: String,
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  
  // Employment details
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'co-op']
  },
  duration: String,  // "3 months", "6 months"
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: String  // "hourly", "monthly", "yearly"
  },
  
  // Application
  applicationUrl: String,
  applyLink: String,
  
  // Posting details
  postedAt: Date,
  expiryDate: Date,
  postedDaysAgo: Number,
  
  // Match analysis
  matchAnalysis: {
    targetCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    matchedSkills: [String],
    missingSkills: [String],
    relevanceReason: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'closed', 'filled'],
    default: 'active'
  },
  
  // Metadata
  metadata: {
    fetchedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: Date,
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

internshipSchema.index({ 'location.city': 1, status: 1 });
internshipSchema.index({ skills: 1 });
internshipSchema.index({ 'matchAnalysis.matchScore': -1 });
internshipSchema.index({ postedAt: -1 });
internshipSchema.index({ source: 1, sourceId: 1 }, { unique: true });

module.exports = mongoose.model('Internship', internshipSchema);
