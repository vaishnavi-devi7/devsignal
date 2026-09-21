const fs = require('fs');
const path = './frontend/src/pages/Resume.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\{error && \(/,
  "<>\n        {error && ("
);

content = content.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">/,
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">'
); // Wait, I need to find the end of the `) : (` block and close the fragment

fs.writeFileSync(path, content);
