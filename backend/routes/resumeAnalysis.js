const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const {
  uploadResume,
  analyzeResume,
  getAnalysis,
  getAnalysisById,
  getCompanies,
  getRecommendedInternships,
  generateRoadmap,
  getRoadmap
} = require('../controllers/resumeAnalysisController');

// Ensure uploads directory exists (absolute path)
const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Helper: wrap multer to return JSON errors instead of HTML
const uploadMiddleware = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload error.' });
    }
    next();
  });
};

// Routes

/**
 * @route   POST /api/resume/upload
 * @desc    Upload resume file
 * @access  Private
 */
router.post('/upload', authenticate, uploadMiddleware, uploadResume);

/**
 * @route   POST /api/resume/analyze
 * @desc    Analyze resume against company requirements
 * @access  Private
 * @body    { companyId: string, resumeId: string }
 */
router.post('/analyze', authenticate, analyzeResume);

/**
 * @route   GET /api/resume/analysis/:userId
 * @desc    Get resume analysis results for a user
 * @access  Private
 */
router.get('/analysis/:userId', authenticate, getAnalysis);

/**
 * @route   GET /api/resume/analysis/id/:analysisId
 * @desc    Get a single resume analysis result by ID
 * @access  Private
 */
router.get('/analysis/id/:analysisId', authenticate, getAnalysisById);

/**
 * @route   GET /api/companies
 * @desc    Get all available companies
 * @access  Public
 */
router.get('/companies', getCompanies);

/**
 * @route   GET /api/companies/:id
 * @desc    Get company details by ID
 * @access  Public
 */
router.get('/companies/:id', getCompanies);

/**
 * @route   GET /api/internships/recommended
 * @desc    Get recommended internships based on analysis
 * @access  Private
 * @query   companyId, userId
 */
router.get('/internships/recommended', authenticate, getRecommendedInternships);

/**
 * @route   POST /api/roadmap
 * @desc    Generate career roadmap
 * @access  Private
 * @body    { resumeAnalysisId: string }
 */
router.post('/roadmap', authenticate, generateRoadmap);

/**
 * @route   GET /api/roadmap/:userId
 * @desc    Get user's career roadmap
 * @access  Private
 */
router.get('/roadmap/:userId', authenticate, getRoadmap);

module.exports = router;
