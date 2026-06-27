class AIAnalysisService {
  constructor() {
    const configuredKey = process.env.OPENAI_API_KEY;
    this.isEnabled = Boolean(
      configuredKey &&
      configuredKey !== 'your_openai_api_key_here' &&
      !configuredKey.startsWith('sk-your')
    );
    
    if (this.isEnabled) {
      try {
        const OpenAI = require('openai');
        this.openai = new OpenAI({ apiKey: configuredKey });
        console.log('✅ OpenAI API enabled for resume analysis');
      } catch (err) {
        console.warn('⚠️ OpenAI package not installed. Using rule-based analysis.');
        this.isEnabled = false;
      }
    } else {
      console.log('ℹ️ OpenAI API key not configured. Using smart rule-based analysis.');
    }
  }
  
  async analyzeResume(resumeData, companyData) {
    if (this.isEnabled) {
      try {
        const prompt = this.buildAnalysisPrompt(resumeData, companyData);
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career coach and technical recruiter specializing in resume analysis and career guidance. Provide detailed, actionable insights in JSON format.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });
        
        const analysis = JSON.parse(response.choices[0].message.content);
        return this.formatAnalysis(analysis);
      } catch (error) {
        console.error('OpenAI API error, falling back to rule-based:', error.message);
        return this.getSmartAnalysis(resumeData, companyData);
      }
    }
    
    return this.getSmartAnalysis(resumeData, companyData);
  }
  
  buildAnalysisPrompt(resumeData, companyData) {
    const safeJoin = (arr) => (arr && arr.length > 0) ? arr.join(', ') : 'None listed';
    
    return `
Analyze the following resume for the target company and provide detailed insights in JSON format.

TARGET COMPANY:
- Name: ${companyData.name}
- Required Skills: ${safeJoin(companyData.requirements?.mustHaveSkills)}
- Preferred Skills: ${safeJoin(companyData.requirements?.preferredSkills)}
- Required Certifications: ${safeJoin(companyData.requirements?.certifications)}
- Project Types: ${safeJoin(companyData.requirements?.projectTypes)}
- Experience Level: ${companyData.requirements?.experienceLevel || 'entry'}

RESUME DATA:
- Skills (Technical): ${safeJoin(resumeData.skills?.technical)}
- Skills (Tools): ${safeJoin(resumeData.skills?.tools)}
- Skills (Soft): ${safeJoin(resumeData.skills?.soft)}

EDUCATION:
${(resumeData.education || []).map(edu => `- ${edu.degree || ''} in ${edu.field || ''} from ${edu.institution || ''}`).join('\n') || 'Not provided'}

EXPERIENCE:
${(resumeData.experience || []).map(exp => `- ${exp.position || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`).join('\n') || 'Not provided'}

PROJECTS:
${(resumeData.projects || []).map(proj => `- ${proj.name || ''}: ${(proj.description || '').substring(0, 100)}`).join('\n') || 'Not provided'}

CERTIFICATIONS:
${(resumeData.certifications || []).map(cert => `- ${cert.name || ''} from ${cert.issuer || ''}`).join('\n') || 'Not provided'}

RAW RESUME TEXT:
${(resumeData.rawText || '').substring(0, 3000)}

Provide a comprehensive analysis in the following JSON structure:
{
  "summary": "Brief overall assessment",
  "strengths": [{ "category": "Skills/Projects/Experience", "items": ["item1"], "description": "Why this is a strength" }],
  "weaknesses": [{ "category": "Skills/Projects", "items": ["item1"], "description": "Why this is a weakness", "severity": "low/medium/high" }],
  "missingSkills": ["skill1", "skill2"],
  "missingProjects": [{ "type": "project type", "description": "what to build", "priority": "high/medium/low" }],
  "missingCertifications": ["cert1"],
  "improvementSuggestions": [{ "area": "Skills", "suggestion": "specific action", "priority": "high/medium/low", "estimatedTime": "2 weeks" }],
  "keyHighlights": ["highlight1"],
  "redFlags": ["concern1"],
  "recommendations": ["recommendation1"]
}

Focus on specific, actionable insights for ${companyData.name}.`;
  }
  
  formatAnalysis(analysis) {
    return {
      aiInsights: {
        summary: analysis.summary || '',
        keyHighlights: analysis.keyHighlights || [],
        redFlags: analysis.redFlags || [],
        recommendations: analysis.recommendations || []
      },
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      missingSkills: analysis.missingSkills || [],
      missingProjects: analysis.missingProjects || [],
      missingCertifications: analysis.missingCertifications || [],
      improvementSuggestions: analysis.improvementSuggestions || []
    };
  }
  
  async generateRoadmap(analysis, companyData, currentScore, targetScore) {
    if (this.isEnabled) {
      try {
        const prompt = this.buildRoadmapPrompt(analysis, companyData, currentScore, targetScore);
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career coach specializing in creating personalized career development roadmaps. Provide detailed, actionable plans in JSON format.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });
        
        const roadmap = JSON.parse(response.choices[0].message.content);
        return this.formatRoadmap(roadmap);
      } catch (error) {
        console.error('OpenAI roadmap error, falling back:', error.message);
        return this.getSmartRoadmap(analysis, companyData, currentScore, targetScore);
      }
    }
    
    return this.getSmartRoadmap(analysis, companyData, currentScore, targetScore);
  }
  
  buildRoadmapPrompt(analysis, companyData, currentScore, targetScore) {
    const safeMap = (arr, fn) => (arr && arr.length > 0) ? arr.map(fn).join('\n') : 'N/A';
    
    return `
Create a personalized career roadmap to help a candidate get hired at ${companyData.name}.

Current Match Score: ${currentScore}%
Target Match Score: ${targetScore}%
Gap: ${targetScore - currentScore}%

Missing Skills: ${(analysis.analysis?.missingSkills || []).join(', ') || 'None'}
Missing Certifications: ${(analysis.analysis?.missingCertifications || []).join(', ') || 'None'}

Provide a 4-6 month roadmap in JSON with this structure:
{
  "currentStatus": { "readiness": ${currentScore}, "estimatedTimeline": "X months", "confidenceLevel": "medium" },
  "milestones": [{ "month": 1, "title": "Focus", "description": "...", "tasks": [{ "task": "...", "priority": "high", "category": "skill", "estimatedTime": "2 weeks", "resources": [{ "type": "course", "title": "...", "link": "...", "platform": "..." }] }], "expectedOutcome": "...", "matchScoreImpact": 10 }],
  "skillPlan": [{ "skill": "...", "currentLevel": "beginner", "targetLevel": "intermediate", "resources": [], "practiceProjects": [], "estimatedCompletionTime": "4 weeks" }],
  "projectRecommendations": [{ "title": "...", "description": "...", "technologies": [], "complexity": "intermediate", "estimatedTime": "3 weeks", "learningOutcomes": [], "priority": "high" }],
  "certificationRecommendations": [{ "name": "...", "issuer": "...", "description": "...", "link": "...", "cost": "$X", "duration": "X months", "difficulty": "intermediate", "priority": "high", "validity": "2 years" }],
  "aiInsights": { "summary": "...", "keyChallenges": [], "successFactors": [] }
}

Make it realistic and tailored to the specific gaps.`;
  }
  
  formatRoadmap(roadmap) {
    const milestones = (roadmap.milestones || []).map((milestone) => ({
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
        resources: task.resources || [],
        completed: false
      }))
    }));

    return {
      currentStatus: roadmap.currentStatus || { readiness: 50, estimatedTimeline: '4 months', confidenceLevel: 'medium' },
      milestones,
      skillPlan: roadmap.skillPlan || [],
      projectRecommendations: roadmap.projectRecommendations || [],
      certificationRecommendations: roadmap.certificationRecommendations || [],
      aiInsights: roadmap.aiInsights || {}
    };
  }

  // ========= SMART RULE-BASED FALLBACKS =========

  getSmartAnalysis(resumeData, companyData) {
    const userSkills = (resumeData.skills?.technical || []).map(s => s.toLowerCase());
    const userTools = (resumeData.skills?.tools || []).map(s => s.toLowerCase());
    const allUserSkills = [...userSkills, ...userTools];
    
    const mustHave = companyData.requirements?.mustHaveSkills || [];
    const preferred = companyData.requirements?.preferredSkills || [];
    const requiredCerts = companyData.requirements?.certifications || [];
    const requiredProjects = companyData.requirements?.projectTypes || [];
    
    // Skill matching
    const matchedSkills = mustHave.filter(s => 
      allUserSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );
    const missingSkills = mustHave.filter(s => 
      !allUserSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );
    const matchedPreferred = preferred.filter(s => 
      allUserSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );
    
    // Certification matching
    const userCerts = (resumeData.certifications || []).map(c => (c.name || '').toLowerCase());
    const matchedCerts = requiredCerts.filter(c => userCerts.some(uc => uc.includes(c.toLowerCase())));
    const missingCerts = requiredCerts.filter(c => !userCerts.some(uc => uc.includes(c.toLowerCase())));
    
    // Project matching
    const userProjects = resumeData.projects || [];
    const projectDescriptions = userProjects.map(p => ((p.description || '') + ' ' + (p.technologies || []).join(' ')).toLowerCase());
    const missingProjects = requiredProjects
      .filter(pt => !projectDescriptions.some(pd => pd.includes(pt.toLowerCase())))
      .map(pt => ({
        type: pt,
        description: `Build a ${pt} project demonstrating your skills in ${pt.toLowerCase()} to strengthen your ${companyData.name} application`,
        priority: 'high'
      }));
    
    // Build strengths
    const strengths = [];
    if (matchedSkills.length > 0) {
      strengths.push({
        category: 'Skills',
        items: matchedSkills,
        description: `You have ${matchedSkills.length} of ${mustHave.length} required skills for ${companyData.name}`
      });
    }
    if (matchedPreferred.length > 0) {
      strengths.push({
        category: 'Preferred Skills',
        items: matchedPreferred,
        description: `You also have ${matchedPreferred.length} preferred skills that give you an edge`
      });
    }
    if (userProjects.length >= 3) {
      strengths.push({
        category: 'Projects',
        items: userProjects.slice(0, 3).map(p => p.name || 'Project'),
        description: 'Good project portfolio demonstrating practical experience'
      });
    }
    if (matchedCerts.length > 0) {
      strengths.push({
        category: 'Certifications',
        items: matchedCerts,
        description: 'You have relevant certifications that strengthen your profile'
      });
    }
    if ((resumeData.experience || []).length > 0) {
      strengths.push({
        category: 'Experience',
        items: resumeData.experience.map(e => `${e.position || 'Role'} at ${e.company || 'Company'}`),
        description: 'Professional experience adds significant value to your application'
      });
    }
    
    // Build weaknesses
    const weaknesses = [];
    if (missingSkills.length > 0) {
      weaknesses.push({
        category: 'Skills',
        items: missingSkills,
        description: `Missing ${missingSkills.length} required skills needed by ${companyData.name}`,
        severity: missingSkills.length > 3 ? 'high' : 'medium'
      });
    }
    if (missingCerts.length > 0) {
      weaknesses.push({
        category: 'Certifications',
        items: missingCerts,
        description: `Missing ${missingCerts.length} recommended certifications`,
        severity: 'medium'
      });
    }
    if (missingProjects.length > 0) {
      weaknesses.push({
        category: 'Projects',
        items: missingProjects.map(p => p.type),
        description: `Missing project experience in ${missingProjects.map(p => p.type).join(', ')}`,
        severity: 'medium'
      });
    }
    if (userProjects.length < 2) {
      weaknesses.push({
        category: 'Projects',
        items: ['Limited Portfolio'],
        description: 'Having fewer than 2 projects weakens your application',
        severity: 'high'
      });
    }
    
    // Improvement suggestions
    const improvementSuggestions = missingSkills.map(skill => ({
      area: 'Skills',
      suggestion: `Learn ${skill} through online courses and practice projects`,
      priority: 'high',
      estimatedTime: '2-4 weeks'
    }));
    missingCerts.forEach(cert => {
      improvementSuggestions.push({
        area: 'Certifications',
        suggestion: `Obtain ${cert} certification to strengthen your profile`,
        priority: 'medium',
        estimatedTime: '1-3 months'
      });
    });
    missingProjects.forEach(proj => {
      improvementSuggestions.push({
        area: 'Projects',
        suggestion: `Build a ${proj.type} project: ${proj.description}`,
        priority: 'high',
        estimatedTime: '2-4 weeks'
      });
    });
    
    const totalRequired = mustHave.length;
    const matchPercent = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 50;
    
    return {
      aiInsights: {
        summary: `Based on a detailed analysis of your resume against ${companyData.name}'s requirements, you match ${matchPercent}% of required skills. ${matchedSkills.length > 0 ? `Your strengths in ${matchedSkills.slice(0, 3).join(', ')} are well-aligned.` : ''} ${missingSkills.length > 0 ? `Focus on acquiring ${missingSkills.slice(0, 3).join(', ')} to significantly improve your match score.` : 'Great coverage of required skills!'}`,
        keyHighlights: [
          matchedSkills.length > 0 ? `Strong in ${matchedSkills.length} core skills: ${matchedSkills.join(', ')}` : 'Building foundational skills',
          matchedPreferred.length > 0 ? `${matchedPreferred.length} bonus preferred skills matched` : null,
          userProjects.length > 0 ? `${userProjects.length} project(s) demonstrating practical ability` : null,
          (resumeData.experience || []).length > 0 ? 'Has professional work experience' : null,
          matchedCerts.length > 0 ? `${matchedCerts.length} relevant certification(s)` : null
        ].filter(Boolean),
        redFlags: [
          missingSkills.length > 3 ? `Missing ${missingSkills.length} critical required skills` : null,
          userProjects.length === 0 ? 'No projects listed on resume' : null,
          (resumeData.experience || []).length === 0 ? 'No professional experience listed' : null,
          missingCerts.length === requiredCerts.length && requiredCerts.length > 0 ? 'None of the recommended certifications obtained' : null
        ].filter(Boolean),
        recommendations: [
          missingSkills.length > 0 ? `Prioritize learning: ${missingSkills.slice(0, 3).join(', ')}` : null,
          missingProjects.length > 0 ? `Build projects in: ${missingProjects.map(p => p.type).slice(0, 3).join(', ')}` : null,
          missingCerts.length > 0 ? `Consider getting: ${missingCerts.slice(0, 2).join(', ')} certification` : null,
          `Practice ${companyData.name}-specific interview patterns`,
          'Tailor your resume to highlight relevant experience'
        ].filter(Boolean)
      },
      strengths,
      weaknesses,
      missingSkills,
      missingProjects,
      missingCertifications: missingCerts,
      improvementSuggestions
    };
  }

  getSmartRoadmap(analysisData, companyData, currentScore, targetScore) {
    const missingSkills = analysisData.analysis?.missingSkills || analysisData.missingSkills || [];
    const missingCerts = analysisData.analysis?.missingCertifications || analysisData.missingCertifications || [];
    const missingProjects = analysisData.analysis?.missingProjects || analysisData.missingProjects || [];
    const gap = targetScore - currentScore;
    const monthsNeeded = Math.max(3, Math.ceil(gap / 8));
    
    // Resource mappings for common skills
    const skillResources = {
      'dsa': { title: 'Master DSA - Striver SDE Sheet', link: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', platform: 'TakeUForward' },
      'algorithms': { title: 'Algorithms Specialization', link: 'https://www.coursera.org/specializations/algorithms', platform: 'Coursera' },
      'system design': { title: 'System Design Primer', link: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub' },
      'java': { title: 'Java Programming Masterclass', link: 'https://www.udemy.com/course/java-the-complete-java-developer-course/', platform: 'Udemy' },
      'python': { title: 'Python for Everybody', link: 'https://www.coursera.org/specializations/python', platform: 'Coursera' },
      'aws': { title: 'AWS Cloud Practitioner Essentials', link: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', platform: 'AWS' },
      'cloud': { title: 'Cloud Computing Concepts', link: 'https://www.coursera.org/learn/cloud-computing', platform: 'Coursera' },
      'react': { title: 'React - The Complete Guide', link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', platform: 'Udemy' },
      'docker': { title: 'Docker Mastery', link: 'https://www.udemy.com/course/docker-mastery/', platform: 'Udemy' },
      'kubernetes': { title: 'Kubernetes for Beginners', link: 'https://www.udemy.com/course/learn-kubernetes/', platform: 'Udemy' },
      'git': { title: 'Git Complete', link: 'https://www.udemy.com/course/git-complete/', platform: 'Udemy' },
      'open source': { title: 'How to Contribute to Open Source', link: 'https://opensource.guide/how-to-contribute/', platform: 'GitHub' },
      'oop': { title: 'Object-Oriented Design', link: 'https://www.coursera.org/learn/object-oriented-design', platform: 'Coursera' },
      'rest apis': { title: 'RESTful Web Services', link: 'https://www.udemy.com/course/restful-web-services-with-spring-framework/', platform: 'Udemy' },
      'machine learning': { title: 'Machine Learning by Andrew Ng', link: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera' },
      'sql': { title: 'SQL Complete Course', link: 'https://www.w3schools.com/sql/', platform: 'W3Schools' },
      'backend development': { title: 'Node.js Complete Course', link: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', platform: 'Udemy' },
      'c#': { title: 'C# Fundamentals', link: 'https://www.pluralsight.com/courses/csharp-fundamentals-dev', platform: 'Pluralsight' },
      'azure': { title: 'Azure Fundamentals', link: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/', platform: 'Microsoft Learn' },
      'typescript': { title: 'TypeScript Deep Dive', link: 'https://basarat.gitbook.io/typescript/', platform: 'GitBook' }
    };
    
    const getResourceForSkill = (skill) => {
      const key = skill.toLowerCase();
      const resource = skillResources[key];
      if (resource) {
        return [{ type: 'course', ...resource }];
      }
      return [{ type: 'course', title: `Learn ${skill}`, link: `https://www.google.com/search?q=${encodeURIComponent(skill + ' course')}`, platform: 'Google Search' }];
    };
    
    const impactPerMonth = Math.ceil(gap / monthsNeeded);
    
    const milestones = [];
    
    // Month 1: Core missing skills
    const month1Skills = missingSkills.slice(0, 3);
    milestones.push({
      month: 1,
      title: 'Foundation Building',
      description: `Focus on learning the most critical missing skills: ${month1Skills.join(', ') || 'core fundamentals'}`,
      tasks: [
        ...month1Skills.map(skill => ({
          task: `Learn ${skill} fundamentals through structured courses`,
          priority: 'high',
          category: 'skill',
          estimatedTime: '2 weeks',
          resources: getResourceForSkill(skill)
        })),
        {
          task: 'Practice coding problems daily (minimum 2 problems/day)',
          priority: 'high',
          category: 'practice',
          estimatedTime: '4 weeks (ongoing)',
          resources: [{ type: 'practice', title: 'LeetCode', link: 'https://leetcode.com', platform: 'LeetCode' }]
        }
      ],
      expectedOutcome: `Strong foundation in ${month1Skills.join(', ')} and consistent problem-solving habit`,
      matchScoreImpact: Math.min(impactPerMonth, 15)
    });
    
    // Month 2: Projects
    const month2Skills = missingSkills.slice(3, 5);
    milestones.push({
      month: 2,
      title: 'Project Development',
      description: 'Build real-world projects to demonstrate your skills and fill project gaps',
      tasks: [
        ...(missingProjects.length > 0 ? [{
          task: `Build a ${(missingProjects[0]?.type || 'Full Stack')} project`,
          priority: 'high',
          category: 'project',
          estimatedTime: '3 weeks',
          resources: [{ type: 'course', title: 'freeCodeCamp Projects', link: 'https://www.freecodecamp.org', platform: 'freeCodeCamp' }]
        }] : []),
        ...month2Skills.map(skill => ({
          task: `Learn ${skill} and integrate into projects`,
          priority: 'medium',
          category: 'skill',
          estimatedTime: '2 weeks',
          resources: getResourceForSkill(skill)
        })),
        {
          task: 'Contribute to an open source project on GitHub',
          priority: 'medium',
          category: 'project',
          estimatedTime: '1 week',
          resources: [{ type: 'article', title: 'First Contributions', link: 'https://github.com/firstcontributions/first-contributions', platform: 'GitHub' }]
        },
        {
          task: 'Continue daily DSA practice (increase to 3 problems/day)',
          priority: 'high',
          category: 'practice',
          estimatedTime: '4 weeks (ongoing)',
          resources: [{ type: 'practice', title: 'LeetCode Top Interview Questions', link: 'https://leetcode.com/problem-list/top-interview-questions/', platform: 'LeetCode' }]
        }
      ],
      expectedOutcome: 'Portfolio with 2+ relevant projects and open source contribution',
      matchScoreImpact: Math.min(impactPerMonth, 15)
    });
    
    // Month 3: Certifications & Advanced
    milestones.push({
      month: 3,
      title: 'Certifications & Advanced Skills',
      description: 'Obtain relevant certifications and deepen advanced topic knowledge',
      tasks: [
        ...(missingCerts.length > 0 ? [{
          task: `Prepare for and obtain ${missingCerts[0]} certification`,
          priority: 'high',
          category: 'certification',
          estimatedTime: '3 weeks',
          resources: [{ type: 'course', title: `${missingCerts[0]} Preparation`, link: `https://www.google.com/search?q=${encodeURIComponent(missingCerts[0] + ' certification preparation')}`, platform: 'Various' }]
        }] : []),
        {
          task: `Study ${companyData.name}-specific interview patterns and past questions`,
          priority: 'high',
          category: 'practice',
          estimatedTime: '2 weeks',
          resources: [{ type: 'article', title: `${companyData.name} Interview Prep`, link: `https://www.glassdoor.com/Interview/${companyData.name.toLowerCase()}-interview-questions-SRCH_KE0,${companyData.name.length}.htm`, platform: 'Glassdoor' }]
        },
        {
          task: 'Build a second portfolio project with more advanced technologies',
          priority: 'medium',
          category: 'project',
          estimatedTime: '2 weeks',
          resources: []
        }
      ],
      expectedOutcome: 'Certified with advanced skills and deepened knowledge',
      matchScoreImpact: Math.min(impactPerMonth, 10)
    });
    
    // Month 4: Interview Prep
    milestones.push({
      month: 4,
      title: 'Interview Preparation & Application',
      description: `Intensive preparation for ${companyData.name} interview process`,
      tasks: [
        {
          task: 'Complete 100+ LeetCode problems (focus on medium/hard)',
          priority: 'high',
          category: 'practice',
          estimatedTime: '4 weeks',
          resources: [{ type: 'practice', title: 'LeetCode Company Questions', link: 'https://leetcode.com/problemset/', platform: 'LeetCode' }]
        },
        {
          task: 'Practice mock interviews (technical + behavioral)',
          priority: 'high',
          category: 'practice',
          estimatedTime: '2 weeks',
          resources: [{ type: 'practice', title: 'Pramp - Free Mock Interviews', link: 'https://www.pramp.com', platform: 'Pramp' }]
        },
        {
          task: `Study ${companyData.name}'s culture and values for behavioral rounds`,
          priority: 'medium',
          category: 'practice',
          estimatedTime: '1 week',
          resources: [{ type: 'article', title: `${companyData.name} Culture`, link: companyData.website || '#', platform: `${companyData.name} Careers` }]
        },
        {
          task: 'Update and optimize resume with new skills and projects',
          priority: 'high',
          category: 'practice',
          estimatedTime: '3 days',
          resources: []
        }
      ],
      expectedOutcome: `Interview-ready for ${companyData.name} with high confidence`,
      matchScoreImpact: Math.min(impactPerMonth, 8)
    });
    
    // Skill plan
    const skillPlan = missingSkills.slice(0, 6).map(skill => ({
      skill,
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      resources: getResourceForSkill(skill).map(r => ({ ...r, duration: '2-4 weeks', difficulty: 'intermediate' })),
      practiceProjects: [`Build a mini-project using ${skill}`, `Integrate ${skill} into your portfolio`],
      estimatedCompletionTime: '3-4 weeks'
    }));
    
    // Project recommendations
    const projectRecommendations = (missingProjects.length > 0 ? missingProjects : [{ type: 'Full Stack' }]).slice(0, 3).map(proj => ({
      title: `${proj.type || 'Full Stack'} Application`,
      description: `Build a ${(proj.type || 'full stack').toLowerCase()} application demonstrating key skills needed for ${companyData.name}`,
      technologies: (companyData.requirements?.technologies || []).slice(0, 4),
      complexity: 'intermediate',
      estimatedTime: '3-4 weeks',
      learningOutcomes: [`${proj.type || 'Full Stack'} development`, 'Problem-solving', 'Code organization', 'Deployment'],
      priority: 'high'
    }));
    
    // Certification recommendations
    const certificationRecommendations = missingCerts.slice(0, 3).map(cert => ({
      name: cert,
      issuer: cert.includes('AWS') ? 'Amazon Web Services' : cert.includes('Azure') ? 'Microsoft' : cert.includes('Google') ? 'Google Cloud' : 'Various',
      description: `Industry-recognized certification that strengthens your ${companyData.name} application`,
      link: `https://www.google.com/search?q=${encodeURIComponent(cert + ' certification')}`,
      cost: '$100-300',
      duration: '1-2 months',
      difficulty: 'intermediate',
      priority: 'medium',
      validity: '2-3 years'
    }));
    
    return {
      currentStatus: {
        readiness: currentScore,
        estimatedTimeline: `${monthsNeeded} months`,
        confidenceLevel: currentScore > 60 ? 'high' : currentScore > 40 ? 'medium' : 'low'
      },
      milestones,
      skillPlan,
      projectRecommendations,
      certificationRecommendations,
      aiInsights: {
        summary: `To reach your target of ${targetScore}% match score for ${companyData.name}, follow this ${monthsNeeded}-month roadmap. Focus first on acquiring the ${missingSkills.length} missing skills, then build relevant projects and obtain certifications.`,
        keyChallenges: [
          missingSkills.length > 3 ? `Significant skill gap (${missingSkills.length} missing skills)` : 'Manageable skill gap',
          'Consistent daily practice is essential',
          'Building quality projects takes dedicated time'
        ],
        successFactors: [
          'Dedicate at least 2-3 hours daily to learning',
          'Focus on depth over breadth for each skill',
          'Build real projects, not just tutorials',
          'Practice coding problems consistently'
        ]
      }
    };
  }
}

module.exports = AIAnalysisService;
