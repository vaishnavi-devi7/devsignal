const db = require('../config/db');

const normalizeList = (list) => {
  if (!list || !Array.isArray(list)) return [];
  return [...new Set(list.map(s => s.trim().toLowerCase()).filter(s => s.length > 0))];
};

const calculateOverlap = (userList, jobList) => {
  const normalizedUser = normalizeList(userList);
  const normalizedJob = normalizeList(jobList);
  
  if (normalizedJob.length === 0) {
    return { matched: [], missing: [], score: 100 }; // 100% if no requirements in this category
  }
  
  const matched = [];
  const missing = [];
  
  const userSet = new Set(normalizedUser);
  
  jobList.forEach(item => {
    if (!item) return;
    const lowerItem = item.trim().toLowerCase();
    if (userSet.has(lowerItem)) {
      matched.push(item.trim());
    } else {
      missing.push(item.trim());
    }
  });
  
  const score = (matched.length / normalizedJob.length) * 100;
  return { matched, missing, score };
};

const matchJob = async (userId, jobId) => {
  // 1. Load job
  const { rows: jobRows } = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
  if (jobRows.length === 0) throw new Error('Job not found');
  const job = jobRows[0];

  // 2. Load user's resume
  const { rows: resumeRows } = await db.query('SELECT * FROM resume_profiles WHERE user_id = $1', [userId]);
  const resume = resumeRows.length > 0 ? resumeRows[0] : null;

  // 3. Load user's GitHub
  const { rows: githubRows } = await db.query('SELECT * FROM github_repositories WHERE user_id = $1', [userId]);
  const github = githubRows.length > 0 ? githubRows : null;

  // 4. Load user's DSA
  const { rows: dsaRows } = await db.query('SELECT * FROM dsa_problems WHERE user_id = $1', [userId]);
  const dsa = dsaRows.length > 0 ? dsaRows : null;

  // 5. Build unified profile
  const userSkills = [];
  const userLangs = [];
  const userFrameworks = [];
  const userDatabases = [];
  const userTools = [];

  if (resume) {
    userSkills.push(...(resume.skills || []));
    userLangs.push(...(resume.programming_languages || []));
    userFrameworks.push(...(resume.frameworks || []));
    userDatabases.push(...(resume.databases || []));
    userTools.push(...(resume.tools || []));
  }

  if (github) {
    github.forEach(repo => {
      // Use only actual existing database schema data: language and topics. 
      // Do not invent framework/database extraction here.
      if (repo.language) {
        userLangs.push(repo.language);
        userSkills.push(repo.language);
      }
      if (repo.topics) {
        userSkills.push(...repo.topics);
      }
    });
  }

  if (dsa) {
    dsa.forEach(prob => {
      if (prob.language) {
        userLangs.push(prob.language);
        userSkills.push(prob.language);
      }
    });
  }

  // 6. Calculate overlaps
  const skillsMatch = calculateOverlap(userSkills, job.skills);
  const langMatch = calculateOverlap(userLangs, job.programming_languages);
  const fwMatch = calculateOverlap(userFrameworks, job.frameworks);
  const dbMatch = calculateOverlap(userDatabases, job.databases);
  const toolMatch = calculateOverlap(userTools, job.tools);

  // 7. DSA evidence
  let solvedDsa = 0;
  let relevantTopics = [];
  if (dsa) {
    const solvedProbs = dsa.filter(p => p.status === 'Solved');
    solvedDsa = solvedProbs.length;
    relevantTopics = [...new Set(solvedProbs.map(p => p.topic).filter(Boolean))];
  }

  let dsaScore = 0;
  if (solvedDsa === 0) dsaScore = 0;
  else if (solvedDsa >= 1 && solvedDsa <= 5) dsaScore = 40;
  else if (solvedDsa >= 6 && solvedDsa <= 15) dsaScore = 70;
  else if (solvedDsa >= 16 && solvedDsa <= 30) dsaScore = 85;
  else dsaScore = 100;

  // 8. Calculate total score
  let totalWeight = 0;
  let earnedWeight = 0;

  const addWeight = (matchObj, weight) => {
    // Only weight if the job actually had requirements in this category
    if (matchObj.matched.length > 0 || matchObj.missing.length > 0) {
      totalWeight += weight;
      earnedWeight += (matchObj.score / 100) * weight;
    }
  };

  addWeight(skillsMatch, 40);
  addWeight(langMatch, 20);
  addWeight(fwMatch, 15);
  addWeight(dbMatch, 10);
  addWeight(toolMatch, 5);
  
  // DSA is always factored in for this role type
  totalWeight += 10;
  earnedWeight += (dsaScore / 100) * 10;

  const finalScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 100;

  return {
    score: finalScore,
    matchedSkills: skillsMatch.matched,
    missingSkills: skillsMatch.missing,
    matchedLanguages: langMatch.matched,
    missingLanguages: langMatch.missing,
    matchedFrameworks: fwMatch.matched,
    missingFrameworks: fwMatch.missing,
    matchedDatabases: dbMatch.matched,
    missingDatabases: dbMatch.missing,
    matchedTools: toolMatch.matched,
    missingTools: toolMatch.missing,
    dsaEvidence: {
      solved: solvedDsa,
      relevantTopics: relevantTopics,
      score: dsaScore
    },
    profileCoverage: {
      resume: !!resume,
      github: !!github,
      dsa: !!dsa
    }
  };
};

module.exports = {
  matchJob
};
