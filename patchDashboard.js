const fs = require('fs');
const path = './frontend/src/pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Promise.all block
content = content.replace(
  /const \[dashboardRes, githubRes, dsaRes, resumeRes\] = await Promise\.all\(\[[\s\S]*?setResumeData\(resumeRes\.data\.resume\);/m,
  `const dashboardRes = await api.get('/dashboard');
        setData(dashboardRes.data);
        setGithubOverview(dashboardRes.data.githubStats);
        setDsaStats(dashboardRes.data.dsaStats);
        setResumeData(dashboardRes.data.resumeData);`
);

fs.writeFileSync(path, content);
console.log('Patched Dashboard.jsx');
