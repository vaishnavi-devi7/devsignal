const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseResume = async (filePath, mimetype) => {
  let rawText = '';

  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      rawText = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value;
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Unable to extract text from this file.');
  }

  return extractStructuredData(rawText);
};

const extractStructuredData = (text) => {
  // We do not have an LLM, so we use rudimentary deterministic heuristics.
  const profile = {
    raw_text: text,
    full_name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    programming_languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    education: [],
    experience: [],
    projects: [],
    certifications: []
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Identity heuristics
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) profile.email = emailMatch[0];

  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) profile.phone = phoneMatch[0];

  // Try to find full name (often the first non-empty line that doesn't look like contact info)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (!emailRegex.test(l) && !phoneRegex.test(l) && l.split(' ').length <= 4) {
      profile.full_name = l;
      break;
    }
  }

  // Very basic deterministic keyword extraction for common programming languages and tools
  const commonLangs = ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin', 'HTML', 'CSS'];
  const commonFrameworks = ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Ruby on Rails', '.NET', 'Laravel'];
  const commonDBs = ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server'];
  const commonTools = ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Jenkins', 'Jira'];

  const wordSet = new Set(text.split(/[\s,()|/]+/).map(w => w.toLowerCase()));

  commonLangs.forEach(lang => {
    if (wordSet.has(lang.toLowerCase())) profile.programming_languages.push(lang);
  });

  commonFrameworks.forEach(fw => {
    if (wordSet.has(fw.toLowerCase())) profile.frameworks.push(fw);
  });

  commonDBs.forEach(db => {
    if (wordSet.has(db.toLowerCase())) profile.databases.push(db);
  });

  commonTools.forEach(tool => {
    if (wordSet.has(tool.toLowerCase())) profile.tools.push(tool);
  });

  profile.skills = [...profile.programming_languages, ...profile.frameworks, ...profile.databases];

  return profile;
};

module.exports = {
  parseResume,
  extractStructuredData
};
