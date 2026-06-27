const ROLE_TEMPLATES = [
  {
    title: 'Software Engineering Intern',
    duration: '12 weeks',
    location: { city: 'Bangalore', country: 'India', remote: false },
    skillSource: 'technologies'
  },
  {
    title: 'Summer Internship Program',
    duration: '8 weeks',
    location: { city: 'Hyderabad', country: 'India', remote: false },
    skillSource: 'mustHaveSkills'
  },
  {
    title: 'Technology Intern',
    duration: '6 months',
    location: { city: '', country: 'India', remote: true },
    skillSource: 'preferredSkills'
  },
  {
    title: 'Engineering Intern',
    duration: '3 months',
    location: { city: 'Pune', country: 'India', remote: false },
    skillSource: 'projectTypes'
  }
];

function uniqueSkills(...lists) {
  return [...new Set(lists.flat().filter(Boolean))];
}

function buildInternship({
  companyName,
  website,
  role,
  skills,
  duration,
  location,
  isTargetCompany,
  missingSkills
}) {
  const normalizedMissing = (missingSkills || []).map(s => s.toLowerCase());
  const normalizedSkills = skills.map(s => s.toLowerCase());
  const matchedSkills = normalizedMissing.filter(s => normalizedSkills.some(sk => sk.includes(s) || s.includes(sk)));
  const matchScore = normalizedMissing.length > 0
    ? Math.round((matchedSkills.length / normalizedMissing.length) * 100)
    : isTargetCompany ? 85 : 65;

  const boostedScore = isTargetCompany ? Math.min(100, matchScore + 15) : matchScore;

  return {
    source: 'manual',
    sourceId: `manual-${companyName.toLowerCase().replace(/\s+/g, '-')}-${role.title.replace(/\s+/g, '-').toLowerCase()}`,
    title: role.title,
    company: companyName,
    companyLogo: '',
    location: role.location || location,
    description: `${role.title} at ${companyName}. Build real-world projects using ${skills.slice(0, 4).join(', ') || 'industry-standard technologies'}.`,
    requirements: skills.slice(0, 6),
    responsibilities: [
      'Work on production-grade code with mentor guidance',
      'Collaborate with cross-functional engineering teams',
      'Present project outcomes at end of internship'
    ],
    skills,
    employmentType: 'internship',
    duration: role.duration || duration || '3 months',
    salary: null,
    applicationUrl: website || '',
    applyLink: website || '',
    postedAt: new Date(),
    postedDaysAgo: Math.floor(Math.random() * 14) + 1,
    status: 'active',
    isTargetCompany,
    matchAnalysis: {
      matchScore: boostedScore,
      matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      missingSkills: normalizedMissing.filter(s => !matchedSkills.includes(s)),
      relevanceReason: isTargetCompany
        ? `Direct internship at ${companyName} — aligned with your target company`
        : `Similar role in ${companyName} — helps build skills for your target company`
    }
  };
}

function generateCompanySpecificInternships(companyData, missingSkills = []) {
  if (!companyData?.name) return [];

  const req = companyData.requirements || {};
  const techSkills = req.technologies || [];
  const mustHave = req.mustHaveSkills || [];
  const preferred = req.preferredSkills || [];
  const projectTypes = req.projectTypes || [];
  const website = companyData.website || '';

  const internships = [];

  ROLE_TEMPLATES.forEach((template, idx) => {
    let skills = [];
    switch (template.skillSource) {
      case 'technologies': skills = techSkills; break;
      case 'mustHaveSkills': skills = mustHave; break;
      case 'preferredSkills': skills = preferred; break;
      case 'projectTypes': skills = projectTypes; break;
      default: skills = techSkills;
    }

    internships.push(buildInternship({
      companyName: companyData.name,
      website,
      role: { title: template.title, duration: template.duration, location: template.location },
      skills: uniqueSkills(skills, mustHave.slice(0, 2)),
      isTargetCompany: true,
      missingSkills
    }));
  });

  return internships
    .sort((a, b) => (b.matchAnalysis?.matchScore || 0) - (a.matchAnalysis?.matchScore || 0));
}

module.exports = { generateCompanySpecificInternships };
