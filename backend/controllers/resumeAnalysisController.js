const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Company = require('../models/Company');
const Roadmap = require('../models/Roadmap');

// Internship model is optional — it may not exist yet
let Internship;
try {
  Internship = require('../models/Internship');
} catch (e) {
  console.warn('⚠️ Internship model not found — internship DB operations will be skipped');
}

// Services will be initialized later to avoid circular dependencies
let resumeParser, matchScoreEngine, aiAnalysisService, internshipService;

function initServices() {
  if (!resumeParser) {
    const ResumeParser = require('../services/resumeParser');
    const MatchScoreEngine = require('../services/matchScoreEngine');
    const AIAnalysisService = require('../services/aiAnalysisService');
    const InternshipService = require('../services/internshipService');
    
    resumeParser = new ResumeParser();
    matchScoreEngine = new MatchScoreEngine();
    aiAnalysisService = new AIAnalysisService();
    internshipService = new InternshipService();
  }
}

function getUserId(req) {
  return req.user?.uid || req.user?.id || req.headers['x-uid'] || null;
}

function normalizeResources(resources) {
  const list = Array.isArray(resources)
    ? resources
    : typeof resources === 'string'
      ? (() => { try { return JSON.parse(resources); } catch { return []; } })()
      : [];

  return list.map((resource) => {
    const item = typeof resource === 'string'
      ? (() => { try { return JSON.parse(resource); } catch { return null; } })()
      : resource;

    if (!item || typeof item !== 'object') {
      return {
        type: 'course',
        title: 'Learning resource',
        link: '#',
        platform: 'Online'
      };
    }

    return {
      type: item.type || 'course',
      title: item.title || 'Learning resource',
      link: item.link || '#',
      platform: item.platform || 'Online',
      duration: item.duration,
      difficulty: item.difficulty
    };
  });
}

function normalizeRoadmapData(roadmapData) {
  const milestones = (roadmapData.milestones || []).map((milestone) => ({
    month: milestone.month || 1,
    title: milestone.title || 'Milestone',
    description: milestone.description || '',
    expectedOutcome: milestone.expectedOutcome || '',
    matchScoreImpact: milestone.matchScoreImpact || 0,
    tasks: (milestone.tasks || []).map((task) => ({
      task: task.task || 'Complete assigned learning',
      priority: task.priority || 'medium',
      category: task.category || 'skill',
      estimatedTime: task.estimatedTime || '1 week',
      resources: normalizeResources(task.resources),
      completed: Boolean(task.completed)
    }))
  }));

  const skillPlan = (roadmapData.skillPlan || []).map((skill) => ({
    skill: skill.skill || 'Skill',
    currentLevel: skill.currentLevel || 'beginner',
    targetLevel: skill.targetLevel || 'intermediate',
    resources: normalizeResources(skill.resources),
    practiceProjects: skill.practiceProjects || [],
    estimatedCompletionTime: skill.estimatedCompletionTime || '3-4 weeks'
  }));

  return {
    currentStatus: {
      readiness: roadmapData.currentStatus?.readiness ?? 0,
      estimatedTimeline: roadmapData.currentStatus?.estimatedTimeline || '4 months',
      confidenceLevel: roadmapData.currentStatus?.confidenceLevel || 'medium'
    },
    milestones,
    skillPlan,
    projectRecommendations: roadmapData.projectRecommendations || [],
    certificationRecommendations: roadmapData.certificationRecommendations || [],
    aiInsights: {
      summary: roadmapData.aiInsights?.summary || 'Your personalized career roadmap is ready.',
      keyChallenges: roadmapData.aiInsights?.keyChallenges || [],
      successFactors: roadmapData.aiInsights?.successFactors || [],
      alternativePaths: roadmapData.aiInsights?.alternativePaths || []
    }
  };
}

/**
 * Upload resume
 */
exports.uploadResume = async (req, res) => {
  initServices();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Get user ID from token or use a default for testing
    const userId = getUserId(req) || 'test_user';
    
    // Parse the resume
    const parsedData = await resumeParser.parseResume(req.file.path, req.file.mimetype);
    
    // Save to database
    const resume = new Resume({
      userId,
      fileInfo: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      },
      parsedData,
      analysisStatus: 'pending'
    });
    
    await resume.save();
    
    res.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        resumeId: resume._id,
        parsedData: resume.parsedData
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
};

/**
 * Analyze resume against company requirements
 */
exports.analyzeResume = async (req, res) => {
  initServices();
  
  try {
    const { companyId, resumeId } = req.body;
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication required' });
    }
    
    // Validate inputs
    if (!companyId || !resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID and Resume ID are required'
      });
    }
    
    // Fetch resume
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Fetch company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Update analysis status
    resume.analysisStatus = 'processing';
    await resume.save();
    
    const startTime = Date.now();
    
    // Calculate match scores
    const matchResult = await matchScoreEngine.calculateMatch(
      resume.parsedData,
      company.requirements
    );
    
    // Generate improvement suggestions
    const improvementSuggestions = matchScoreEngine.generateSuggestions(
      matchResult.analysis,
      company.requirements
    );
    
    // AI-powered analysis
    let aiAnalysis = {};
    try {
      aiAnalysis = await aiAnalysisService.analyzeResume(
        resume.parsedData,
        company
      );
    } catch (aiError) {
      console.error('AI Analysis failed, using rule-based analysis:', aiError);
      // Fallback to rule-based analysis
      aiAnalysis = {
        aiInsights: {
          summary: 'Resume analysis completed using rule-based matching',
          keyHighlights: matchResult.analysis.strengths.map(s => s.items.join(', ')),
          redFlags: matchResult.analysis.weaknesses.filter(w => w.severity === 'high').map(w => w.items.join(', ')),
          recommendations: improvementSuggestions.map(s => s.suggestion)
        }
      };
    }
    
    // Calculate readiness
    const currentReadiness = matchResult.scores.overall;
    const targetReadiness = 85; // Target score
    const readinessGap = targetReadiness - currentReadiness;
    
    // Save analysis
    const analysis = new ResumeAnalysis({
      userId,
      resumeId,
      companyId,
      matchScores: matchResult.scores,
      analysis: {
        strengths: matchResult.analysis.strengths,
        weaknesses: matchResult.analysis.weaknesses,
        missingSkills: matchResult.analysis.missingSkills,
        missingProjects: matchResult.analysis.missingProjects,
        missingCertifications: matchResult.analysis.missingCertifications,
        improvementSuggestions
      },
      aiInsights: aiAnalysis.aiInsights,
      skillGap: matchResult.analysis.skillGap,
      projectGap: {
        hasProjects: resume.parsedData.projects.length > 0,
        projectCount: resume.parsedData.projects.length,
        recommendedProjects: aiAnalysis.missingProjects || []
      },
      readiness: {
        current: currentReadiness,
        target: targetReadiness,
        gap: readinessGap
      },
      analysisMetadata: {
        analyzedAt: new Date(),
        aiModel: 'gpt-4-turbo-preview',
        analysisVersion: '1.0',
        processingTime: Date.now() - startTime
      }
    });
    
    await analysis.save();
    
    // Update resume
    resume.analysisStatus = 'completed';
    resume.lastAnalyzedAt = new Date();
    resume.analyzedFor.push({
      companyId: company._id,
      analyzedAt: new Date()
    });
    await resume.save();
    
    // Fetch recommended internships
    let internships = [];
    try {
      internships = await internshipService.fetchRecommendedInternships(
        matchResult.analysis.missingSkills,
        company,
        req.user.location || ''
      );
      
      // Update internships with target company
      if (Internship) {
        await Internship.updateMany(
          { _id: { $in: internships.map(i => i._id) } },
          { 'matchAnalysis.targetCompanyId': company._id }
        );
      }
    } catch (internshipError) {
      console.error('Failed to fetch internships:', internshipError);
    }
    
    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        analysisId: analysis._id,
        matchScores: analysis.matchScores,
        analysis: analysis.analysis,
        aiInsights: analysis.aiInsights,
        skillGap: analysis.skillGap,
        projectGap: analysis.projectGap,
        readiness: analysis.readiness,
        internships: internships.slice(0, 10), // Return top 10
        company: {
          id: company._id,
          name: company.name,
          logo: company.logo
        }
      }
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

/**
 * Get analysis results
 */
exports.getAnalysis = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.user.id || req.user.uid;
    
    // Verify user has access
    if (requestUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const analyses = await ResumeAnalysis.find({ userId })
      .populate('companyId', 'name logo brandColor')
      .populate('resumeId', 'fileInfo.originalName')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error.message
    });
  }
};

/**
 * Get single analysis by ID
 */
exports.getAnalysisById = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const requestUserId = req.user.id || req.user.uid;
    
    const analysis = await ResumeAnalysis.findById(analysisId)
      .populate('companyId', 'name logo brandColor requirements interviewProcess culture')
      .populate('resumeId', 'fileInfo.originalName');
      
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    // Verify user has access
    if (analysis.userId !== requestUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get analysis by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error.message
    });
  }
};

/**
 * Get all companies
 */
exports.getCompanies = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Get specific company
      const company = await Company.findById(id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      return res.json({
        success: true,
        data: company
      });
    }
    
    // Get all companies
    const companies = await Company.find({ isActive: true })
      .select('name logo industry requirements.interviewProcess.oaPattern');
    
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

/**
 * Get recommended internships
 */
exports.getRecommendedInternships = async (req, res) => {
  try {
    const { companyId, userId } = req.query;
    
    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID and User ID are required'
      });
    }
    
    const internships = await internshipService.getRecommendedInternships(userId, companyId);
    
    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships',
      error: error.message
    });
  }
};

/**
 * Generate career roadmap
 */
exports.generateRoadmap = async (req, res) => {
  initServices();
  try {
    const { resumeAnalysisId } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    if (!resumeAnalysisId) {
      return res.status(400).json({
        success: false,
        message: 'Resume Analysis ID is required'
      });
    }
    
    const analysis = await ResumeAnalysis.findOne({ _id: resumeAnalysisId, userId });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found. Please analyze your resume again.'
      });
    }
    
    const company = await Company.findById(analysis.companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found for this analysis'
      });
    }
    
    const rawRoadmapData = await aiAnalysisService.generateRoadmap(
      analysis,
      company,
      analysis.readiness.current,
      analysis.readiness.target
    );
    const roadmapData = normalizeRoadmapData(rawRoadmapData);

    const totalTasks = roadmapData.milestones.reduce(
      (sum, milestone) => sum + (milestone.tasks?.length || 0),
      0
    );

    await Roadmap.updateMany(
      { userId, companyId: analysis.companyId, status: 'active' },
      { $set: { status: 'archived', updatedAt: new Date() } }
    );

    const roadmap = new Roadmap({
      userId,
      resumeAnalysisId,
      companyId: analysis.companyId,
      target: {
        company: company.name,
        role: 'Software Engineer',
        targetMatchScore: analysis.readiness.target
      },
      currentStatus: roadmapData.currentStatus,
      milestones: roadmapData.milestones,
      skillPlan: roadmapData.skillPlan,
      projectRecommendations: roadmapData.projectRecommendations,
      certificationRecommendations: roadmapData.certificationRecommendations,
      aiInsights: roadmapData.aiInsights,
      progress: {
        totalMilestones: roadmapData.milestones.length,
        completedMilestones: 0,
        totalTasks,
        completedTasks: 0,
        overallProgress: 0
      },
      metadata: {
        generatedAt: new Date(),
        aiModel: aiAnalysisService.isEnabled ? 'gpt-4-turbo-preview' : 'rule-based-v1',
        version: '1.0'
      },
      status: 'active'
    });
    
    await roadmap.save();
    
    res.json({
      success: true,
      message: 'Roadmap generated successfully',
      data: roadmap.toObject()
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
};

/**
 * Get user's roadmap
 */
exports.getRoadmap = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestUserId = getUserId(req);
    
    // Verify user has access
    if (requestUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const roadmap = await Roadmap.findOne({ userId, status: 'active' })
      .populate('companyId', 'name logo')
      .sort({ createdAt: -1 });
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'No active roadmap found'
      });
    }
    
    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap',
      error: error.message
    });
  }
};
