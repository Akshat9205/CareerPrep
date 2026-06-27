const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class ResumeParser {
  /**
   * Parse resume file and extract structured data
   * @param {string} filePath - Path to the resume file
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<Object>} Parsed resume data
   */
  async parseResume(filePath, mimeType) {
    let text = '';
    
    try {
      if (mimeType === 'application/pdf') {
        text = await this.parsePDF(filePath);
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        text = await this.parseDOCX(filePath);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.warn('Resume parsing warning (using empty fallback):', error.message);
      // Allow upload to succeed with empty text — analysis will yield low scores
      text = '';
    }
    
    // Extract structured data from text
    const parsedData = this.extractStructuredData(text);
    
    return {
      rawText: text,
      ...parsedData
    };
  }
  
  /**
   * Parse PDF file
   */
  async parsePDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  
  /**
   * Parse DOCX file
   */
  async parseDOCX(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  }
  
  /**
   * Extract structured data from resume text
   */
  extractStructuredData(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    return {
      personalInfo: this.extractPersonalInfo(lines, text),
      education: this.extractEducation(text),
      experience: this.extractExperience(text),
      projects: this.extractProjects(text),
      skills: this.extractSkills(text),
      certifications: this.extractCertifications(text),
      achievements: this.extractAchievements(text)
    };
  }
  
  /**
   * Extract personal information
   */
  extractPersonalInfo(lines, text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
    const linkedinRegex = /linkedin\.com\/in\/[\w-]+/;
    const githubRegex = /github\.com\/[\w-]+/;
    
    const email = text.match(emailRegex)?.[0] || '';
    const phone = text.match(phoneRegex)?.[0] || '';
    const linkedin = text.match(linkedinRegex)?.[0] || '';
    const github = text.match(githubRegex)?.[0] || '';
    
    // Name is typically on the first line
    const name = lines[0] || '';
    
    return {
      name,
      email,
      phone,
      linkedin,
      github,
      location: this.extractLocation(text)
    };
  }
  
  /**
   * Extract location
   */
  extractLocation(text) {
    const locationPatterns = [
      /(?:City|Location|Address):\s*([^\n]+)/i,
      /([A-Za-z\s]+,\s*[A-Za-z\s]+)/
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  }
  
  /**
   * Extract education
   */
  extractEducation(text) {
    const education = [];
    const educationSection = this.extractSection(text, ['education', 'academic', 'qualifications']);
    
    const educationPatterns = [
      /([A-Za-z\s]+(?:University|College|Institute|School))/gi,
      /(?:Bachelor|Master|PhD|B\.Tech|M\.Tech|B\.E\.|M\.E\.|B\.Sc\.|M\.Sc\.)/gi
    ];
    
    // Simple extraction - can be enhanced with NLP
    const lines = educationSection.split('\n');
    let currentEdu = null;
    
    for (const line of lines) {
      if (educationPatterns[0].test(line) || educationPatterns[1].test(line)) {
        if (currentEdu) {
          education.push(currentEdu);
        }
        currentEdu = {
          institution: line.trim(),
          degree: '',
          field: '',
          startDate: '',
          endDate: ''
        };
      } else if (currentEdu) {
        if (!currentEdu.degree && (line.includes('Bachelor') || line.includes('Master'))) {
          currentEdu.degree = line;
        }
        // Extract dates
        const dateMatch = line.match(/(\d{4})/);
        if (dateMatch) {
          if (!currentEdu.startDate) {
            currentEdu.startDate = dateMatch[1];
          } else {
            currentEdu.endDate = dateMatch[1];
          }
        }
      }
    }
    
    if (currentEdu) education.push(currentEdu);
    
    return education;
  }
  
  /**
   * Extract experience
   */
  extractExperience(text) {
    const experience = [];
    const experienceSection = this.extractSection(text, ['experience', 'work history', 'employment']);
    
    const lines = experienceSection.split('\n').filter(line => line.trim());
    let currentExp = null;
    
    for (const line of lines) {
      // Check if line looks like a company/position header
      if (this.looksLikeCompanyHeader(line)) {
        if (currentExp) {
          experience.push(currentExp);
        }
        currentExp = {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          location: '',
          description: '',
          technologies: [],
          achievements: []
        };
        
        // Parse company and position
        const parts = line.split(/at|@/i);
        if (parts.length > 1) {
          currentExp.position = parts[0].trim();
          currentExp.company = parts[1].trim();
        } else {
          currentExp.company = line.trim();
        }
      } else if (currentExp) {
        // Extract dates
        const dateMatch = line.match(/(\w+\s+\d{4})\s*[-–to]+\s*(\w+\s+\d{4}|present|current)/i);
        if (dateMatch) {
          currentExp.startDate = dateMatch[1];
          currentExp.endDate = dateMatch[2];
          currentExp.current = dateMatch[2].toLowerCase().includes('present');
        }
        
        // Extract technologies
        const techMatch = line.match(/(?:tech|stack|technologies?)[:\s]*([^\n]+)/i);
        if (techMatch) {
          currentExp.technologies = techMatch[1].split(/[,\/]/).map(t => t.trim());
        }
        
        // Add to description
        if (line.length > 20 && !dateMatch && !techMatch) {
          currentExp.description += line + ' ';
        }
      }
    }
    
    if (currentExp) experience.push(currentExp);
    
    return experience;
  }
  
  /**
   * Extract projects
   */
  extractProjects(text) {
    const projects = [];
    const projectSection = this.extractSection(text, ['projects', 'personal projects', 'portfolio']);
    
    const lines = projectSection.split('\n').filter(line => line.trim());
    let currentProject = null;
    
    for (const line of lines) {
      if (this.looksLikeProjectHeader(line)) {
        if (currentProject) {
          projects.push(currentProject);
        }
        currentProject = {
          name: line.trim(),
          description: '',
          technologies: [],
          startDate: '',
          endDate: '',
          link: '',
          github: '',
          role: ''
        };
      } else if (currentProject) {
        // Extract technologies
        const techMatch = line.match(/(?:tech|stack|technologies?)[:\s]*([^\n]+)/i);
        if (techMatch) {
          currentProject.technologies = techMatch[1].split(/[,\/]/).map(t => t.trim());
        }
        
        // Extract links
        const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (linkMatch) {
          if (linkMatch[1].includes('github')) {
            currentProject.github = linkMatch[1];
          } else {
            currentProject.link = linkMatch[1];
          }
        }
        
        // Add to description
        if (line.length > 20 && !techMatch && !linkMatch) {
          currentProject.description += line + ' ';
        }
      }
    }
    
    if (currentProject) projects.push(currentProject);
    
    return projects;
  }
  
  /**
   * Extract skills
   */
  extractSkills(text) {
    const skillSection = this.extractSection(text, ['skills', 'technical skills', 'technologies', 'core competencies']);
    
    // Common tech skills database (50+)
    const techSkills = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
      'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'nuxt.js', 'react', 'angular', 'vue',
      'node', 'express', 'django', 'flask', 'spring', 'spring boot', 'laravel', 'rails', 'fastapi',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'github actions',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'firebase', 'supabase',
      'git', 'github', 'gitlab', 'bitbucket', 'machine learning', 'data science', 'ai', 'deep learning',
      'dsa', 'algorithms', 'data structures', 'system design', 'oop', 'rest api', 'graphql', 'microservices', 'oauth', 'jwt'
    ];
    
    const skills = {
      technical: [],
      soft: [],
      tools: [],
      languages: []
    };
    
    const lowerText = text.toLowerCase();
    
    // Extract technical skills
    techSkills.forEach(skill => {
      if (lowerText.includes(skill)) {
        skills.technical.push(skill.toUpperCase() === 'DSA' || skill.toUpperCase() === 'AI' || skill.toUpperCase() === 'JWT' || skill.toUpperCase() === 'AWS' || skill.toUpperCase() === 'GCP' || skill.toUpperCase() === 'OOP'
          ? skill.toUpperCase() 
          : skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    
    // Extract soft skills
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 
      'critical thinking', 'creativity', 'time management', 'collaboration', 'adaptability'
    ];
    softSkills.forEach(skill => {
      if (lowerText.includes(skill)) {
        skills.soft.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    
    // Extract tools
    const tools = ['vs code', 'intellij', 'eclipse', 'figma', 'jira', 'slack', 'postman', 'docker desktop', 'trello', 'notion'];
    tools.forEach(tool => {
      if (lowerText.includes(tool)) {
        skills.tools.push(tool.toUpperCase() === 'VS CODE' ? 'VS Code' : tool.toUpperCase());
      }
    });
    
    return skills;
  }
  
  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certifications = [];
    const certSection = this.extractSection(text, ['certifications', 'certificates', 'credentials', 'courses']);
    
    const commonCerts = [
      'AWS Certified Solutions Architect',
      'AWS Certified Developer',
      'AWS Certified Cloud Practitioner',
      'Google Cloud Professional Cloud Architect',
      'Google Cloud Professional Data Engineer',
      'Microsoft Certified: Azure Fundamentals',
      'Microsoft Certified: Azure Administrator Associate',
      'Certified ScrumMaster',
      'Project Management Professional',
      'CompTIA Security+',
      'CompTIA Network+',
      'CompTIA A+',
      'Cisco Certified Network Associate',
      'Oracle Certified Associate',
      'Java SE 8 Programmer'
    ];
    
    const lowerCertSection = certSection.toLowerCase();
    commonCerts.forEach(cert => {
      if (lowerCertSection.includes(cert.toLowerCase())) {
        certifications.push({
          name: cert,
          issuer: cert.includes('AWS') ? 'Amazon Web Services' : cert.includes('Google') ? 'Google' : cert.includes('Azure') ? 'Microsoft' : 'Various',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          link: ''
        });
      }
    });

    const certPatterns = [
      /([A-Z][A-Za-z\s]+)\s*(?:by|from|@)\s*([A-Z][A-Za-z\s\.,]+)/
    ];
    
    const lines = certSection.split('\n');
    for (const line of lines) {
      const match = line.match(certPatterns[0]);
      if (match && match[1] && match[2]) {
        const name = match[1].trim();
        const issuer = match[2].trim();
        // Avoid duplicates
        if (!certifications.some(c => c.name.toLowerCase() === name.toLowerCase())) {
          certifications.push({
            name,
            issuer,
            issueDate: '',
            expiryDate: '',
            credentialId: '',
            link: ''
          });
        }
      }
    }
    
    return certifications;
  }
  
  /**
   * Extract achievements
   */
  extractAchievements(text) {
    const achievements = [];
    const achievementSection = this.extractSection(text, ['achievements', 'awards', 'honors']);
    
    const lines = achievementSection.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.length > 20) {
        achievements.push({
          title: line.substring(0, 50),
          description: line,
          date: ''
        });
      }
    }
    
    return achievements;
  }
  
  /**
   * Extract a specific section from resume text
   */
  extractSection(text, sectionNames) {
    const lowerText = text.toLowerCase();
    let startIndex = -1;
    let endIndex = text.length;
    
    for (const name of sectionNames) {
      const index = lowerText.indexOf(name.toLowerCase());
      if (index !== -1 && (startIndex === -1 || index < startIndex)) {
        startIndex = index;
      }
    }
    
    if (startIndex === -1) return '';
    
    // Find the end of this section (next major section)
    const nextSectionPatterns = ['experience', 'education', 'projects', 'skills', 'certifications'];
    for (const pattern of nextSectionPatterns) {
      const index = lowerText.indexOf(pattern.toLowerCase(), startIndex + pattern.length);
      if (index !== -1 && index < endIndex) {
        endIndex = index;
      }
    }
    
    return text.substring(startIndex, endIndex);
  }
  
  /**
   * Check if line looks like a company header
   */
  looksLikeCompanyHeader(line) {
    const companyIndicators = ['Inc', 'Corp', 'LLC', 'Ltd', 'Technologies', 'Solutions', 'Systems'];
    return companyIndicators.some(indicator => line.includes(indicator)) || 
           /^[A-Z][a-z]+ [A-Z]/.test(line);
  }
  
  /**
   * Check if line looks like a project header
   */
  looksLikeProjectHeader(line) {
    return line.length < 100 && 
           (line.includes('Project') || /^[A-Z][a-z\s]+$/.test(line)) &&
           !line.includes('experience') && !line.includes('education');
  }
}

module.exports = ResumeParser;
