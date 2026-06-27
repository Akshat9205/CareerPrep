const Company = require('../models/Company');

const companyData = [
  {
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    brandColor: '#4285F4',
    website: 'https://careers.google.com',
    industry: 'Technology',
    requirements: {
      mustHaveSkills: ['DSA', 'Algorithms', 'Data Structures', 'System Design', 'Java', 'Python', 'Git'],
      preferredSkills: ['Cloud', 'Open Source', 'Machine Learning', 'Distributed Systems', 'Big Data'],
      technologies: ['Java', 'Python', 'C++', 'Go', 'Kubernetes', 'Docker', 'TensorFlow', 'BigQuery'],
      certifications: ['Google Cloud Professional', 'AWS Solutions Architect'],
      projectTypes: ['Full Stack', 'System Design', 'Machine Learning', 'Open Source'],
      experienceLevel: 'mid',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '45 mins', focus: ['DSA', 'Coding'] },
        { type: 'Technical', duration: '45 mins', focus: ['System Design'] },
        { type: 'Behavioral', duration: '30 mins', focus: ['Googleyness', 'Leadership'] },
        { type: 'HR', duration: '30 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: '2-3 coding rounds + 1 system design'
    },
    culture: {
      values: ['Innovation', 'Collaboration', 'User Focus', 'Excellence'],
      workStyle: 'Fast-paced, collaborative',
      teamSize: 'Large'
    }
  },
  {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    brandColor: '#FF9900',
    website: 'https://www.amazon.jobs',
    industry: 'E-commerce',
    requirements: {
      mustHaveSkills: ['DSA', 'Java', 'Backend Development', 'REST APIs', 'Problem Solving'],
      preferredSkills: ['AWS', 'Microservices', 'Distributed Systems', 'Leadership Principles'],
      technologies: ['Java', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Lambda', 'DynamoDB'],
      certifications: ['AWS Solutions Architect', 'AWS Developer'],
      projectTypes: ['Backend', 'Full Stack', 'Cloud', 'Distributed Systems'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering', 'Mathematics']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '60 mins', focus: ['DSA', 'Coding'] },
        { type: 'Technical', duration: '60 mins', focus: ['System Design'] },
        { type: 'Behavioral', duration: '45 mins', focus: ['Leadership Principles', 'STAR Method'] },
        { type: 'HR', duration: '30 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: '2 coding rounds + 1 system design + leadership principles'
    },
    culture: {
      values: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Deliver Results'],
      workStyle: 'Data-driven, fast-paced',
      teamSize: 'Large'
    }
  },
  {
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    brandColor: '#00A4EF',
    website: 'https://careers.microsoft.com',
    industry: 'Technology',
    requirements: {
      mustHaveSkills: ['DSA', 'OOP', 'C#', 'Problem Solving', 'Cloud'],
      preferredSkills: ['Azure', 'Microservices', 'Team Collaboration', 'Growth Mindset'],
      technologies: ['C#', '.NET', 'Azure', 'TypeScript', 'React', 'SQL Server'],
      certifications: ['Azure Developer', 'Azure Solutions Architect'],
      projectTypes: ['Full Stack', 'Cloud', 'Enterprise Applications'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '45 mins', focus: ['DSA', 'Coding'] },
        { type: 'Technical', duration: '45 mins', focus: ['OOP', 'Design Patterns'] },
        { type: 'Behavioral', duration: '30 mins', focus: ['Culture', 'Teamwork'] },
        { type: 'HR', duration: '30 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: '2 coding rounds + 1 design round'
    },
    culture: {
      values: ['Growth Mindset', 'Innovation', 'Collaboration', 'Diversity'],
      workStyle: 'Collaborative, innovative',
      teamSize: 'Large'
    }
  },
  {
    name: 'Adobe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Adobe_Systems_logo_and_wordmark.svg',
    brandColor: '#FF0000',
    website: 'https://www.adobe.com/careers',
    industry: 'Software',
    requirements: {
      mustHaveSkills: ['DSA', 'JavaScript', 'React', 'Product Thinking', 'Design'],
      preferredSkills: ['Creative Tools', 'UX/UI', 'Mobile Development', 'Cloud'],
      technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Creative Cloud APIs'],
      certifications: ['AWS Developer', 'Adobe Certified Expert'],
      projectTypes: ['Frontend', 'Full Stack', 'Creative Tools', 'Mobile'],
      experienceLevel: 'mid',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Design', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '45 mins', focus: ['DSA', 'Coding'] },
        { type: 'Technical', duration: '45 mins', focus: ['Frontend', 'React'] },
        { type: 'Product', duration: '30 mins', focus: ['Product Sense', 'Design'] },
        { type: 'HR', duration: '30 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: '2 coding rounds + 1 product/design round'
    },
    culture: {
      values: ['Creativity', 'Innovation', 'Customer Focus', 'Excellence'],
      workStyle: 'Creative, collaborative',
      teamSize: 'Medium'
    }
  },
  {
    name: 'TCS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    brandColor: '#2F2F2F',
    website: 'https://www.tcs.com/careers',
    industry: 'IT Services',
    requirements: {
      mustHaveSkills: ['Java', 'SQL', 'Problem Solving', 'Communication', 'Teamwork'],
      preferredSkills: ['Cloud', 'Microservices', 'DevOps', 'Agile'],
      technologies: ['Java', 'Spring Boot', 'Angular', 'Oracle', 'AWS', 'Jenkins'],
      certifications: ['Java Certification', 'AWS Cloud Practitioner'],
      projectTypes: ['Enterprise Applications', 'Full Stack', 'Cloud Migration'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'IT', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '30 mins', focus: ['Java', 'SQL'] },
        { type: 'Technical', duration: '30 mins', focus: ['Problem Solving'] },
        { type: 'HR', duration: '20 mins', focus: ['Communication', 'Culture'] }
      ],
      oaPattern: '1 technical + 1 HR round'
    },
    culture: {
      values: ['Integrity', 'Excellence', 'Teamwork', 'Customer First'],
      workStyle: 'Structured, process-oriented',
      teamSize: 'Large'
    }
  },
  {
    name: 'Infosys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Infosys_logo.svg',
    brandColor: '#007CC3',
    website: 'https://www.infosys.com/careers',
    industry: 'IT Services',
    requirements: {
      mustHaveSkills: ['Java', 'SQL', 'Communication', 'Problem Solving', 'OOP'],
      preferredSkills: ['Cloud', 'DevOps', 'Microservices', 'Digital Technologies'],
      technologies: ['Java', 'Spring', 'React', 'Oracle', 'Azure', 'Docker'],
      certifications: ['Java Certification', 'Cloud Certification'],
      projectTypes: ['Enterprise Applications', 'Digital Transformation', 'Full Stack'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'IT', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '30 mins', focus: ['Java', 'SQL'] },
        { type: 'Technical', duration: '30 mins', focus: ['Problem Solving'] },
        { type: 'HR', duration: '20 mins', focus: ['Communication', 'Culture'] }
      ],
      oaPattern: '1 technical + 1 HR round'
    },
    culture: {
      values: ['Innovation', 'Excellence', 'Integrity', 'Teamwork'],
      workStyle: 'Learning-oriented, collaborative',
      teamSize: 'Large'
    }
  },
  {
    name: 'Wipro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    brandColor: '#3A1D71',
    website: 'https://careers.wipro.com',
    industry: 'IT Services',
    requirements: {
      mustHaveSkills: ['Java', 'SQL', 'Communication', 'Problem Solving', 'Aptitude'],
      preferredSkills: ['Cloud', 'DevOps', 'Digital Technologies', 'Automation'],
      technologies: ['Java', '.NET', 'Angular', 'SQL Server', 'AWS', 'Azure'],
      certifications: ['Java Certification', 'Cloud Certification'],
      projectTypes: ['Enterprise Applications', 'Digital Solutions', 'Full Stack'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'IT', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Aptitude', duration: '30 mins', focus: ['Quantitative', 'Logical'] },
        { type: 'Technical', duration: '30 mins', focus: ['Java', 'SQL'] },
        { type: 'HR', duration: '20 mins', focus: ['Communication', 'Culture'] }
      ],
      oaPattern: 'Aptitude + Technical + HR'
    },
    culture: {
      values: ['Integrity', 'Innovation', 'Teamwork', 'Customer Focus'],
      workStyle: 'Process-driven, collaborative',
      teamSize: 'Large'
    }
  },
  {
    name: 'Atlassian',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Atlassian-logo_%282017%29.svg',
    brandColor: '#0052CC',
    website: 'https://www.atlassian.com/company/careers',
    industry: 'Software',
    requirements: {
      mustHaveSkills: ['JavaScript', 'React', 'TypeScript', 'Problem Solving', 'Team Collaboration'],
      preferredSkills: ['Cloud', 'Microservices', 'DevOps', 'Agile'],
      technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Kubernetes'],
      certifications: ['AWS Developer', 'Kubernetes'],
      projectTypes: ['Full Stack', 'Cloud', 'Developer Tools', 'Collaboration Tools'],
      experienceLevel: 'mid',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '45 mins', focus: ['Coding', 'Problem Solving'] },
        { type: 'Technical', duration: '45 mins', focus: ['System Design', 'Architecture'] },
        { type: 'Behavioral', duration: '30 mins', focus: ['Team Values', 'Open Company'] },
        { type: 'HR', duration: '30 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: '2 coding rounds + 1 system design'
    },
    culture: {
      values: ['Open Company', 'No Bullshit', 'Play as a Team', 'Build with Heart'],
      workStyle: 'Open, collaborative, innovative',
      teamSize: 'Medium'
    }
  },
  {
    name: 'Accenture',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Accenture.svg',
    brandColor: '#A100FF',
    website: 'https://www.accenture.com/careers',
    industry: 'Consulting',
    requirements: {
      mustHaveSkills: ['Java', 'Problem Solving', 'Communication', 'Teamwork', 'Client Interaction'],
      preferredSkills: ['Cloud', 'Digital Technologies', 'Consulting', 'Agile'],
      technologies: ['Java', 'Spring', 'Angular', 'Cloud', 'DevOps', 'AI/ML'],
      certifications: ['Cloud Certification', 'Agile Certification'],
      projectTypes: ['Enterprise Solutions', 'Digital Transformation', 'Consulting Projects'],
      experienceLevel: 'entry',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering', 'Business']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '30 mins', focus: ['Java', 'Problem Solving'] },
        { type: 'Behavioral', duration: '30 mins', focus: ['Communication', 'Client Skills'] },
        { type: 'HR', duration: '20 mins', focus: ['Culture Fit'] }
      ],
      oaPattern: 'Technical + Behavioral + HR'
    },
    culture: {
      values: ['Client Value Creation', 'Respect', 'Integrity', 'Stewardship'],
      workStyle: 'Client-focused, collaborative',
      teamSize: 'Large'
    }
  },
  {
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    brandColor: '#0668E1',
    website: 'https://www.metacareers.com',
    industry: 'Technology',
    requirements: {
      mustHaveSkills: ['DSA', 'System Design', 'Python', 'C++', 'Problem Solving'],
      preferredSkills: ['Distributed Systems', 'Machine Learning', 'Mobile Development', 'React'],
      technologies: ['Python', 'C++', 'React', 'React Native', 'GraphQL', 'PyTorch'],
      certifications: ['Machine Learning', 'Cloud'],
      projectTypes: ['Full Stack', 'Mobile', 'Machine Learning', 'Distributed Systems'],
      experienceLevel: 'mid',
      education: {
        minimum: "Bachelor's",
        preferred: ['Computer Science', 'Engineering']
      }
    },
    interviewProcess: {
      rounds: [
        { type: 'Technical', duration: '45 mins', focus: ['DSA', 'Coding'] },
        { type: 'Technical', duration: '45 mins', focus: ['System Design'] },
        { type: 'Technical', duration: '45 mins', focus: ['Specialized Domain'] },
        { type: 'Behavioral', duration: '30 mins', focus: ['Culture', 'Impact'] }
      ],
      oaPattern: '2-3 coding rounds + 1 system design'
    },
    culture: {
      values: ['Move Fast', 'Be Open', 'Build Social Value', 'Meta First'],
      workStyle: 'Fast-paced, innovative',
      teamSize: 'Large'
    }
  }
];

/**
 * Seed company data
 */
async function seedCompanies() {
  try {
    console.log('Seeding company data...');
    
    for (const company of companyData) {
      const existingCompany = await Company.findOne({ name: company.name });
      
      // Transform interviewProcess rounds field if needed
      if (company.interviewProcess && Array.isArray(company.interviewProcess.rounds)) {
        company.interviewProcess.rounds = company.interviewProcess.rounds.map(r => {
          if (r.type && !r.roundType) {
            r.roundType = r.type;
            delete r.type;
          }
          return r;
        });
      }

      if (existingCompany) {
        console.log(`Company ${company.name} already exists, updating...`);
        await Company.findByIdAndUpdate(existingCompany._id, company);
      } else {
        console.log(`Creating company ${company.name}...`);
        await Company.create(company);
      }
    }
    
    console.log('Company data seeded successfully!');
  } catch (error) {
    console.error('Error seeding company data:', error);
  }
}

module.exports = { seedCompanies, companyData };

// Run if executed directly
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerprep')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedCompanies();
    })
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
