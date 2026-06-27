const axios = require('axios');
const Internship = require('../models/Internship');
const { generateCompanySpecificInternships } = require('../data/companyInternshipTemplates');

class InternshipService {
  constructor() {
    this.jsearchApiKey = process.env.JSEARCH_API_KEY;
    this.adzunaAppId = process.env.ADZUNA_APP_ID;
    this.adzunaApiKey = process.env.ADZUNA_API_KEY;
    this.joobleApiKey = process.env.JOOBLE_API_KEY;
    
    this.hasJSearch = !!this.jsearchApiKey;
    this.hasAdzuna = !!(this.adzunaAppId && this.adzunaApiKey);
    this.hasJooble = !!this.joobleApiKey;
    
    const sources = [this.hasJSearch && 'JSearch', this.hasAdzuna && 'Adzuna', this.hasJooble && 'Jooble'].filter(Boolean);
    if (sources.length > 0) {
      console.log(`✅ Internship APIs configured: ${sources.join(', ')}`);
    } else {
      console.log('ℹ️ No internship API keys configured. Internship recommendations will be unavailable.');
    }
  }
  
  async fetchRecommendedInternships(missingSkills, companyData, location = '') {
    const internships = [];
    const hasExternalApi = this.hasJSearch || this.hasAdzuna || this.hasJooble;

    if (hasExternalApi) {
      const topSkills = (missingSkills || []).slice(0, 5);
      const searchQueries = this.generateSearchQueries(topSkills, companyData);
      const limitedQueries = searchQueries.slice(0, 8);

      for (const query of limitedQueries) {
        try {
          if (this.hasJSearch) {
            const results = await this.searchJSearch(query, location);
            internships.push(...results);
          } else if (this.hasAdzuna) {
            const results = await this.searchAdzuna(query, location);
            internships.push(...results);
          } else if (this.hasJooble) {
            const results = await this.searchJooble(query, location);
            internships.push(...results);
          }
        } catch (error) {
          console.error(`Error fetching internships for query "${query}":`, error.message);
        }
      }
    }

    const curatedInternships = generateCompanySpecificInternships(companyData, missingSkills);
    const allInternships = [...internships, ...curatedInternships];

    const uniqueInternships = this.removeDuplicates(allInternships);
    const scoredInternships = uniqueInternships.map(internship => {
      if (internship.matchAnalysis?.matchScore != null) {
        return internship;
      }
      return this.calculateMatchScores([internship], missingSkills)[0];
    });

    if (companyData?._id) {
      scoredInternships.forEach(internship => {
        if (internship.matchAnalysis) {
          internship.matchAnalysis.targetCompanyId = companyData._id;
        }
        if (internship.company?.toLowerCase() === companyData.name?.toLowerCase()) {
          internship.isTargetCompany = true;
        }
      });
    }

    await this.saveInternships(scoredInternships);

    const targetName = companyData?.name?.toLowerCase() || '';
    const companyInternships = scoredInternships.filter((internship) => {
      const employer = internship.company?.toLowerCase() || '';
      return internship.isTargetCompany ||
        employer === targetName ||
        employer.includes(targetName) ||
        targetName.includes(employer);
    });

    return companyInternships
      .sort((a, b) => (b.matchAnalysis?.matchScore || 0) - (a.matchAnalysis?.matchScore || 0))
      .slice(0, 10);
  }
  
  generateSearchQueries(missingSkills, companyData) {
    const queries = new Set();

    if (companyData?.name) {
      queries.add(`${companyData.name} internship`);
      queries.add(`${companyData.name} intern`);
      queries.add(`${companyData.name} software engineer intern`);

      (missingSkills || []).slice(0, 3).forEach(skill => {
        queries.add(`${companyData.name} ${skill} internship`);
      });
    }

    return [...queries];
  }
  
  // ========= JSearch API =========
  async searchJSearch(query, location) {
    try {
      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
          query: query,
          page: '1',
          num_pages: '1',
          date_posted: 'month',
          remote_jobs_only: 'false'
        },
        headers: {
          'X-RapidAPI-Key': this.jsearchApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        timeout: 10000
      };
      
      if (location) options.params.location = location;
      
      const response = await axios.request(options);
      
      if (response.data?.data) {
        return response.data.data.map(job => this.formatJSearchJob(job));
      }
      return [];
    } catch (error) {
      console.error('JSearch API error:', error.message);
      return [];
    }
  }
  
  formatJSearchJob(job) {
    return {
      source: 'jsearch',
      sourceId: job.job_id || `jsearch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: job.job_title || 'Untitled',
      company: job.employer_name || 'Unknown',
      companyLogo: job.employer_logo || '',
      location: {
        country: job.job_country || '',
        city: job.job_city || '',
        state: job.job_state || '',
        remote: job.job_is_remote || false
      },
      description: job.job_description || '',
      requirements: job.job_highlights?.Qualifications || [],
      responsibilities: job.job_highlights?.Responsibilities || [],
      skills: this.extractSkillsFromText(job.job_description || ''),
      employmentType: job.job_employment_type || 'internship',
      duration: this.extractDuration(job.job_description || ''),
      salary: job.job_min_salary ? {
        min: job.job_min_salary,
        max: job.job_max_salary,
        currency: job.job_salary_currency || 'USD',
        period: job.job_salary_period || 'yearly'
      } : null,
      applicationUrl: job.job_apply_link || '',
      applyLink: job.job_apply_link || '',
      postedAt: job.job_posted_at_datetime_utc || new Date(),
      postedDaysAgo: job.job_posted_at_datetime_utc ?
        Math.floor((new Date() - new Date(job.job_posted_at_datetime_utc)) / (1000 * 60 * 60 * 24)) : null,
      status: 'active'
    };
  }
  
  // ========= Adzuna API =========
  async searchAdzuna(query, location) {
    try {
      const country = 'in'; // Default to India
      const response = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/${country}/search/1`,
        {
          params: {
            app_id: this.adzunaAppId,
            app_key: this.adzunaApiKey,
            results_per_page: 5,
            what: query,
            content_type: 'application/json'
          },
          timeout: 10000
        }
      );
      
      if (response.data?.results) {
        return response.data.results.map(job => this.formatAdzunaJob(job));
      }
      return [];
    } catch (error) {
      console.error('Adzuna API error:', error.message);
      return [];
    }
  }
  
  formatAdzunaJob(job) {
    return {
      source: 'adzuna',
      sourceId: job.id?.toString() || `adzuna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Untitled',
      company: job.company?.display_name || 'Unknown',
      companyLogo: '',
      location: {
        country: job.location?.area?.[0] || '',
        city: job.location?.area?.[job.location?.area?.length - 1] || '',
        state: job.location?.area?.[1] || '',
        remote: (job.title || '').toLowerCase().includes('remote')
      },
      description: job.description || '',
      requirements: [],
      responsibilities: [],
      skills: this.extractSkillsFromText(job.description || ''),
      employmentType: 'internship',
      duration: this.extractDuration(job.description || ''),
      salary: job.salary_min ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'INR',
        period: 'yearly'
      } : null,
      applicationUrl: job.redirect_url || '',
      applyLink: job.redirect_url || '',
      postedAt: job.created || new Date(),
      postedDaysAgo: job.created ?
        Math.floor((new Date() - new Date(job.created)) / (1000 * 60 * 60 * 24)) : null,
      status: 'active'
    };
  }
  
  // ========= Jooble API =========
  async searchJooble(query, location) {
    try {
      const response = await axios.post(
        `https://jooble.org/api/${this.joobleApiKey}`,
        {
          keywords: query,
          location: location || 'India',
          page: 1
        },
        { timeout: 10000 }
      );
      
      if (response.data?.jobs) {
        return response.data.jobs.slice(0, 5).map(job => this.formatJoobleJob(job));
      }
      return [];
    } catch (error) {
      console.error('Jooble API error:', error.message);
      return [];
    }
  }
  
  formatJoobleJob(job) {
    return {
      source: 'jooble',
      sourceId: job.id?.toString() || `jooble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Untitled',
      company: job.company || 'Unknown',
      companyLogo: '',
      location: {
        country: '',
        city: job.location || '',
        state: '',
        remote: (job.title || '').toLowerCase().includes('remote')
      },
      description: job.snippet || '',
      requirements: [],
      responsibilities: [],
      skills: this.extractSkillsFromText(job.snippet || ''),
      employmentType: job.type || 'internship',
      duration: this.extractDuration(job.snippet || ''),
      salary: job.salary ? { min: 0, max: 0, currency: 'INR', period: 'monthly' } : null,
      applicationUrl: job.link || '',
      applyLink: job.link || '',
      postedAt: job.updated || new Date(),
      postedDaysAgo: job.updated ?
        Math.floor((new Date() - new Date(job.updated)) / (1000 * 60 * 60 * 24)) : null,
      status: 'active'
    };
  }
  
  // ========= Shared Utilities =========
  extractSkillsFromText(text) {
    const skillKeywords = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
      'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'next.js', 'svelte',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'firebase',
      'git', 'github', 'gitlab', 'machine learning', 'data science', 'ai', 'dsa', 'algorithms', 'data structures',
      'system design', 'rest api', 'graphql', 'microservices', 'oauth', 'jwt'
    ];
    
    const skills = [];
    const lowerText = text.toLowerCase();
    
    skillKeywords.forEach(skill => {
      if (lowerText.includes(skill)) {
        skills.push(skill.toUpperCase() === 'DSA' || skill.toUpperCase() === 'AI' || skill.toUpperCase() === 'JWT' || skill.toUpperCase() === 'AWS' || skill.toUpperCase() === 'GCP' || skill.toUpperCase() === 'OOP'
          ? skill.toUpperCase() 
          : skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    
    return [...new Set(skills)];
  }
  
  extractDuration(text) {
    const durationPatterns = [
      /(\d+)\s*months?/i,
      /(\d+)\s*weeks?/i,
      /summer/i,
      /winter/i,
      /fall/i,
      /spring/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return 'Not specified';
  }
  
  removeDuplicates(internships) {
    const seen = new Set();
    return internships.filter(internship => {
      const key = internship.sourceId
        ? `${internship.source}-${internship.sourceId}`
        : `${internship.company}-${internship.title}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  
  calculateMatchScores(internships, missingSkills) {
    const missingSkillsSet = new Set(missingSkills.map(s => s.toLowerCase()));
    
    return internships.map(internship => {
      const internshipSkills = new Set(internship.skills.map(s => s.toLowerCase()));
      
      let matchedSkills = [];
      let missing = [];
      
      missingSkillsSet.forEach(skill => {
        if (internshipSkills.has(skill)) {
          matchedSkills.push(skill);
        } else {
          missing.push(skill);
        }
      });
      
      const matchScore = missingSkills.length > 0 
        ? (matchedSkills.length / missingSkills.length) * 100 
        : 50;
      
      return {
        ...internship,
        matchAnalysis: {
          matchScore: Math.round(matchScore),
          matchedSkills,
          missingSkills: missing,
          relevanceReason: matchedSkills.length > 0 
            ? `Matches ${matchedSkills.length} of your missing skills: ${matchedSkills.join(', ')}`
            : 'Related position in your field of interest'
        }
      };
    });
  }
  
  async saveInternships(internships) {
    const operations = internships.map(internship => ({
      updateOne: {
        filter: { source: internship.source, sourceId: internship.sourceId },
        update: { $set: internship },
        upsert: true
      }
    }));
    
    if (operations.length > 0) {
      await Internship.bulkWrite(operations).catch(err => {
        console.error('Error saving internships in bulk:', err);
      });
    }
  }
  
  async getRecommendedInternships(userId, companyId) {
    try {
      const internships = await Internship.find({
        'matchAnalysis.targetCompanyId': companyId,
        status: 'active'
      })
      .sort({ 'matchAnalysis.matchScore': -1 })
      .limit(20);
      
      return internships;
    } catch (error) {
      console.error('Error fetching recommended internships:', error);
      return [];
    }
  }
  
  async refreshInternships(missingSkills, companyData, location) {
    return await this.fetchRecommendedInternships(missingSkills, companyData, location);
  }
}

module.exports = InternshipService;
