const db = require('../src/config/db');

const seedJobs = async () => {
  try {
    console.log('Seeding development jobs...');
    
    const devJobs = [
      {
        external_id: 'seed-job-1',
        title: 'Frontend Engineer (Development Seed)',
        company: 'DevTech Innovations',
        location: 'Remote',
        remote_type: 'Remote',
        employment_type: 'Full-time',
        description: 'We are looking for a Frontend Engineer with React experience. (Development Seed)',
        apply_url: 'https://example.com/apply/1',
        source: 'DevSignal Seed',
        skills: JSON.stringify(['React', 'JavaScript', 'Tailwind CSS']),
        programming_languages: JSON.stringify(['JavaScript', 'TypeScript', 'HTML', 'CSS']),
        frameworks: JSON.stringify(['React']),
        databases: JSON.stringify([]),
        tools: JSON.stringify(['Git']),
        experience_min: 2,
        experience_max: 4
      },
      {
        external_id: 'seed-job-2',
        title: 'Backend Developer (Development Seed)',
        company: 'CloudData Systems',
        location: 'New York, NY',
        remote_type: 'Hybrid',
        employment_type: 'Full-time',
        description: 'Join our backend team to build scalable APIs using Node.js and PostgreSQL. (Development Seed)',
        apply_url: 'https://example.com/apply/2',
        source: 'DevSignal Seed',
        skills: JSON.stringify(['Node.js', 'PostgreSQL', 'Express', 'Redis']),
        programming_languages: JSON.stringify(['JavaScript', 'Python']),
        frameworks: JSON.stringify(['Express']),
        databases: JSON.stringify(['PostgreSQL', 'Redis']),
        tools: JSON.stringify(['Docker', 'AWS']),
        experience_min: 3,
        experience_max: 6
      },
      {
        external_id: 'seed-job-3',
        title: 'Full Stack Engineer (Development Seed)',
        company: 'Startup Inc',
        location: 'San Francisco, CA',
        remote_type: 'On-site',
        employment_type: 'Full-time',
        description: 'We need a Full Stack Engineer who can do it all. (Development Seed)',
        apply_url: 'https://example.com/apply/3',
        source: 'DevSignal Seed',
        skills: JSON.stringify(['React', 'Node.js', 'MongoDB']),
        programming_languages: JSON.stringify(['JavaScript', 'TypeScript']),
        frameworks: JSON.stringify(['React', 'Node.js']),
        databases: JSON.stringify(['MongoDB', 'PostgreSQL']),
        tools: JSON.stringify(['Git', 'Docker']),
        experience_min: 1,
        experience_max: 3
      }
    ];

    for (const job of devJobs) {
      await db.query(
        `INSERT INTO jobs (
          external_id, title, company, location, remote_type, employment_type, description, apply_url, source, 
          skills, programming_languages, frameworks, databases, tools, experience_min, experience_max
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (external_id) DO NOTHING`,
        [
          job.external_id, job.title, job.company, job.location, job.remote_type, job.employment_type, job.description, job.apply_url, job.source,
          job.skills, job.programming_languages, job.frameworks, job.databases, job.tools, job.experience_min, job.experience_max
        ]
      );
    }
    
    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedJobs();
