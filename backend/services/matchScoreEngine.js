const Company = require('../models/Company');
const Resume = require('../models/Resume');

class MatchScoreEngine {
  // Fuzzy and synonym matching helper
  isSkillMatch(userSkillsSet, requiredSkill, rawText = '') {
    const req = requiredSkill.toLowerCase();
    
    // Synonym mapping
    const synonyms = {
      'react': ['reactjs', 'react.js', 'react js'],
      'node': ['nodejs', 'node.js', 'node js'],
      'aws': ['amazon web services', 'ec2', 's3', 'lambda'],
      'gcp': ['google cloud platform', 'google cloud', 'gcs'],
      'azure': ['microsoft azure'],
      'git': ['github', 'gitlab', 'bitbucket'],
      'ml': ['machine learning', 'deep learning', 'tensorflow', 'pytorch'],
      'dsa': ['algorithms', 'data structures', 'problem solving'],
      'mongodb': ['mongo', 'document database'],
      'postgresql': ['postgres', 'relational database'],
      'sql': ['mysql', 'sqlite', 'oracle', 'database'],
      'docker': ['containerization'],
      'ci/cd': ['jenkins', 'github actions', 'devops']
    };

    // Check direct matches first
    if (userSkillsSet.has(req)) return true;

    // Check synonyms
    const reqSynonyms = synonyms[req] || [];
    for (const syn of reqSynonyms) {
      if (userSkillsSet.has(syn)) return true;
    }

    // Check user skills mapping to required skill
    for (const uSkill of userSkillsSet) {
      if (uSkill.includes(req) || req.includes(uSkill)) return true;
      // If user has a synonym for the required skill
      for (const syn of reqSynonyms) {
        if (uSkill.includes(syn) || syn.includes(uSkill)) return true;
      }
    }

    // Check raw text as a fallback
    if (rawText) {
      const lowerRawText = rawText.toLowerCase();
      if (lowerRawText.includes(req)) return true;
      for (const syn of reqSynonyms) {
        if (lowerRawText.includes(syn)) return true;
      }
    }

    return false;
  }

  /**
   * Calculate match score between resume and company requirements
   * @param {Object} resumeData - Parsed resume data
   * @param {Object} companyRequirements - Company requirements
   * @returns {Promise<Object>} Match scores and detailed analysis
   */
  async calculateMatch(resumeData, companyRequirements) {
    const scores = {
      overall: 0,
      skills: 0,
      projects: 0,
      certifications: 0,
      experience: 0,
      education: 0
    };
    
    const analysis = {
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      missingProjects: [],
      missingCertifications: [],
      skillGap: {
        matched: [],
        partiallyMatched: [],
        missing: [],
        additional: []
      }
    };
    
    // Calculate skills match
    const skillsResult = this.calculateSkillsMatch(
      resumeData.skills,
      companyRequirements.mustHaveSkills,
      companyRequirements.preferredSkills,
      resumeData.rawText || ''
    );
    scores.skills = skillsResult.score;
    analysis.skillGap = skillsResult.gap;
    analysis.strengths.push(...skillsResult.strengths);
    analysis.weaknesses.push(...skillsResult.weaknesses);
    analysis.missingSkills = skillsResult.missing;
    
    // Calculate projects match
    const projectsResult = this.calculateProjectsMatch(
      resumeData.projects,
      companyRequirements.projectTypes
    );
    scores.projects = projectsResult.score;
    analysis.missingProjects = projectsResult.missing;
    
    // Add project weakness if score is low
    if (scores.projects < 50) {
      analysis.weaknesses.push({
        category: 'Projects',
        items: ['Project Portfolio'],
        description: 'Missing relevant project types requested by company',
        severity: 'medium'
      });
    } else {
      analysis.strengths.push({
        category: 'Projects',
        items: ['Project Portfolio'],
        description: 'Your projects align well with required project types'
      });
    }
    
    // Calculate certifications match
    const certificationsResult = this.calculateCertificationsMatch(
      resumeData.certifications,
      companyRequirements.certifications
    );
    scores.certifications = certificationsResult.score;
    analysis.missingCertifications = certificationsResult.missing;
    
    if (analysis.missingCertifications.length > 0) {
      analysis.weaknesses.push({
        category: 'Certifications',
        items: analysis.missingCertifications,
        description: `Missing certifications: ${analysis.missingCertifications.join(', ')}`,
        severity: 'medium'
      });
    } else if (companyRequirements.certifications && companyRequirements.certifications.length > 0) {
      analysis.strengths.push({
        category: 'Certifications',
        items: companyRequirements.certifications,
        description: 'You have all the requested certifications!'
      });
    }
    
    // Calculate experience match
    scores.experience = this.calculateExperienceMatch(
      resumeData.experience,
      companyRequirements.experienceLevel
    );
    
    if (scores.experience >= 80) {
      analysis.strengths.push({
        category: 'Experience',
        items: [`${companyRequirements.experienceLevel} level`],
        description: 'Your professional experience meets or exceeds the required level'
      });
    } else {
      analysis.weaknesses.push({
        category: 'Experience',
        items: [`${companyRequirements.experienceLevel} level`],
        description: 'Your experience is slightly below the target level for this company',
        severity: 'medium'
      });
    }
    
    // Calculate education match
    scores.education = this.calculateEducationMatch(
      resumeData.education,
      companyRequirements.education
    );
    
    if (scores.education >= 80) {
      analysis.strengths.push({
        category: 'Education',
        items: [companyRequirements.education?.minimum || "Bachelor's"],
        description: 'Your educational background matches the requirements'
      });
    } else {
      analysis.weaknesses.push({
        category: 'Education',
        items: [companyRequirements.education?.minimum || "Bachelor's"],
        description: 'Your education level does not match the company\'s preference',
        severity: 'low'
      });
    }
    
    // Calculate overall score (weighted average)
    scores.overall = this.calculateOverallScore(scores);
    
    return {
      scores,
      analysis
    };
  }
  
  /**
   * Calculate skills match
   */
  calculateSkillsMatch(userSkills, mustHaveSkills = [], preferredSkills = [], rawText = '') {
    const userTechnical = userSkills?.technical || [];
    const userTools = userSkills?.tools || [];
    const userSkillSet = new Set(
      userTechnical.concat(userTools).map(s => s.toLowerCase())
    );
    
    const mustHaveSet = new Set(mustHaveSkills.map(s => s.toLowerCase()));
    const preferredSet = new Set(preferredSkills.map(s => s.toLowerCase()));
    
    let matched = 0;
    let partiallyMatched = 0;
    const missing = [];
    const strengths = [];
    const weaknesses = [];
    const matchedList = [];
    const partiallyMatchedList = [];
    
    // Check must-have skills
    mustHaveSkills.forEach(skill => {
      if (this.isSkillMatch(userSkillSet, skill, rawText)) {
        matched++;
        matchedList.push(skill);
        strengths.push({
          category: 'Skills',
          items: [skill],
          description: `You have the required skill: ${skill}`
        });
      } else {
        missing.push(skill);
        weaknesses.push({
          category: 'Skills',
          items: [skill],
          description: `Missing required skill: ${skill}`,
          severity: 'high'
        });
      }
    });
    
    // Check preferred skills
    preferredSkills.forEach(skill => {
      if (this.isSkillMatch(userSkillSet, skill, rawText)) {
        partiallyMatched++;
        partiallyMatchedList.push(skill);
      }
    });
    
    // Find additional skills user has
    const additional = [];
    userSkillSet.forEach(skill => {
      if (!mustHaveSet.has(skill) && !preferredSet.has(skill)) {
        additional.push(skill);
      }
    });
    
    // Calculate score
    const totalRequired = mustHaveSkills.length;
    const score = totalRequired > 0 ? (matched / totalRequired) * 100 : 0;
    
    return {
      score: Math.round(score),
      gap: {
        matched: matchedList,
        partiallyMatched: partiallyMatchedList,
        missing,
        additional
      },
      strengths,
      weaknesses,
      missing
    };
  }
  
  /**
   * Calculate projects match
   */
  calculateProjectsMatch(userProjects = [], requiredProjectTypes = []) {
    if (!requiredProjectTypes || requiredProjectTypes.length === 0) {
      return {
        score: userProjects.length > 0 ? 100 : 50,
        missing: []
      };
    }
    
    let matchedTypes = 0;
    const missing = [];
    
    requiredProjectTypes.forEach(type => {
      const hasProjectType = userProjects.some(project => {
        const desc = (project.description || '').toLowerCase();
        const name = (project.name || '').toLowerCase();
        const tech = (project.technologies || []).map(t => t.toLowerCase());
        
        return desc.includes(type.toLowerCase()) || 
               name.includes(type.toLowerCase()) ||
               tech.some(t => t.includes(type.toLowerCase()) || type.toLowerCase().includes(t));
      });
      
      if (hasProjectType) {
        matchedTypes++;
      } else {
        missing.push({
          projectType: type,
          description: `Consider building a ${type} project demonstrating required technology stacks`,
          priority: 'medium'
        });
      }
    });
    
    const score = (matchedTypes / requiredProjectTypes.length) * 100;
    
    return {
      score: Math.round(score),
      missing
    };
  }
  
  /**
   * Calculate certifications match
   */
  calculateCertificationsMatch(userCertifications = [], requiredCertifications = []) {
    if (!requiredCertifications || requiredCertifications.length === 0) {
      return {
        score: 100,
        missing: []
      };
    }
    
    let matched = 0;
    const missing = [];
    
    requiredCertifications.forEach(cert => {
      const reqCert = cert.toLowerCase();
      const hasCert = userCertifications.some(c => {
        const userCertName = (c.name || '').toLowerCase();
        return userCertName.includes(reqCert) || reqCert.includes(userCertName);
      });
      
      if (hasCert) {
        matched++;
      } else {
        missing.push(cert);
      }
    });
    
    const score = (matched / requiredCertifications.length) * 100;
    
    return {
      score: Math.round(score),
      missing
    };
  }
  
  /**
   * Calculate experience match
   */
  calculateExperienceMatch(userExperience = [], requiredLevel = 'entry') {
    if (!userExperience || userExperience.length === 0) {
      return requiredLevel === 'entry' ? 50 : 20;
    }
    
    // Calculate total experience in years
    let totalYears = 0;
    userExperience.forEach(exp => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      let years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      if (isNaN(years)) years = 0.5; // Fallback for invalid formats
      totalYears += years;
    });
    
    // Score based on experience level
    const levelRequirements = {
      entry: 0,
      mid: 2,
      senior: 5
    };
    
    const requiredYears = levelRequirements[requiredLevel] || 0;
    
    if (requiredYears === 0) return 100;
    if (totalYears >= requiredYears) {
      return 100;
    } else {
      return Math.round((totalYears / requiredYears) * 100);
    }
  }
  
  /**
   * Calculate education match
   */
  calculateEducationMatch(userEducation = [], requiredEducation) {
    if (!requiredEducation || !requiredEducation.minimum) {
      return 100;
    }
    
    const hasEducation = userEducation && userEducation.length > 0;
    
    if (!hasEducation) {
      return 30;
    }
    
    // Check minimum education
    const educationLevels = {
      "bachelor's": 1,
      "master's": 2,
      "phd": 3
    };
    
    let maxLevel = 0;
    userEducation.forEach(edu => {
      const degree = (edu.degree || '').toLowerCase();
      for (const [level, value] of Object.entries(educationLevels)) {
        if (degree.includes(level)) {
          maxLevel = Math.max(maxLevel, value);
        }
      }
    });
    
    const requiredLevel = educationLevels[requiredEducation.minimum.toLowerCase()] || 1;
    
    if (maxLevel >= requiredLevel) {
      return 100;
    } else {
      return Math.round((maxLevel / requiredLevel) * 100);
    }
  }
  
  /**
   * Calculate overall weighted score
   */
  calculateOverallScore(scores) {
    const weights = {
      skills: 0.35,
      projects: 0.25,
      experience: 0.20,
      education: 0.10,
      certifications: 0.10
    };
    
    const overall = 
      scores.skills * weights.skills +
      scores.projects * weights.projects +
      scores.experience * weights.experience +
      scores.education * weights.education +
      scores.certifications * weights.certifications;
    
    return Math.round(overall);
  }
  
  /**
   * Generate improvement suggestions based on analysis
   */
  generateSuggestions(analysis, companyRequirements) {
    const suggestions = [];
    
    // Skill improvement suggestions
    analysis.missingSkills.forEach(skill => {
      suggestions.push({
        area: 'Skills',
        suggestion: `Learn ${skill} through online courses or practice projects`,
        priority: 'high',
        estimatedTime: '2-4 weeks'
      });
    });
    
    // Project suggestions
    analysis.missingProjects.forEach(project => {
      suggestions.push({
        area: 'Projects',
        suggestion: project.description,
        priority: 'medium',
        estimatedTime: '4-6 weeks'
      });
    });
    
    // Certification suggestions
    analysis.missingCertifications.forEach(cert => {
      suggestions.push({
        area: 'Certifications',
        suggestion: `Obtain ${cert} certification`,
        priority: 'medium',
        estimatedTime: '2-3 months'
      });
    });
    
    return suggestions;
  }
}

module.exports = MatchScoreEngine;
