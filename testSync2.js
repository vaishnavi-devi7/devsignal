const { syncCodeforces } = require('./server/src/controllers/dsaSyncController');

const dbQueries = [];
const db = require('./server/src/config/db');
db.query = async (text, params) => {
  dbQueries.push({ text, params });
  if (text.includes('SELECT id FROM dsa_problems')) {
    // mock duplicate protection
    if (params[2].includes('Duplicate Problem')) {
      return { rows: [{ id: 10 }] };
    }
    return { rows: [] };
  }
  return { rows: [] };
};

const axios = require('axios');
axios.get = async (url) => {
  return {
    data: {
      status: 'OK',
      result: [
        {
          verdict: 'OK',
          problem: { name: 'Normal Problem', contestId: 100, index: 'A', rating: 1500, tags: ['dp'] },
          programmingLanguage: 'C++',
          creationTimeSeconds: 1600000000
        },
        {
          verdict: 'OK',
          problem: { name: 'Missing Rating', contestId: 101, index: 'B', tags: ['math'] }, // no rating
          programmingLanguage: 'Python',
          creationTimeSeconds: 1600000000
        },
        {
          verdict: 'OK',
          problem: { name: 'Missing Tags', contestId: 102, index: 'C', rating: 2000, tags: [] }, // no tags
          programmingLanguage: 'Java',
          creationTimeSeconds: 1600000000
        },
        {
          verdict: 'OK',
          problem: { name: 'Missing Lang', contestId: 103, index: 'D', rating: 800, tags: ['greedy'] }, // no lang
          creationTimeSeconds: 1600000000
        },
        {
          verdict: 'OK',
          problem: { name: 'Duplicate Problem', contestId: 999, index: 'A', rating: 1500, tags: ['dp'] }, // duplicate
          programmingLanguage: 'C++',
          creationTimeSeconds: 1600000000
        },
        {
          verdict: 'WRONG_ANSWER',
          problem: { name: 'Failed Problem', contestId: 104, index: 'E', rating: 1500, tags: ['dp'] }, // NOT OK
          programmingLanguage: 'C++',
          creationTimeSeconds: 1600000000
        }
      ]
    }
  };
};

async function run() {
  const req = { user: { id: 99 }, body: { username: 'test_user' } };
  let status, response;
  const res = {
    status: (s) => { status = s; return res; },
    json: (data) => { response = data; }
  };

  await syncCodeforces(req, res);
  console.log("Valid Handle Response:", response.message);
  
  // Filter for inserts
  const inserts = dbQueries.filter(q => q.text.includes('INSERT'));
  console.log("Total Inserts:", inserts.length); // should be 4 (duplicate and WRONG_ANSWER skipped)
  
  console.log("Problem 1 (Normal):", inserts[0].params[4], inserts[0].params[5], inserts[0].params[7]); // Medium, dp, C++
  console.log("Problem 2 (No Rating):", inserts[1].params[4]); // Medium (fallback)
  console.log("Problem 3 (No Tags):", inserts[2].params[5]); // General
  console.log("Problem 4 (No Lang):", inserts[3].params[7]); // Unknown
}

run().catch(console.error);
