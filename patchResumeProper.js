const fs = require('fs');
const path = './frontend/src/pages/Resume.jsx';
let content = fs.readFileSync(path, 'utf8');

// Format the error message
content = content.replace(
  /\{error && \(\n\s*<div className="p-4 rounded-md bg-danger\/10 border border-danger\/20 text-danger text-sm">\n\s*\{error\}\n\s*<\/div>\n\s*\)\}/,
  `{error && (
        <div className="p-4 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}`
);

content = content.replace(
  /setError\('Failed to fetch resume information\.'\);/,
  "console.error(err); setError('Failed to fetch resume information.');"
);

fs.writeFileSync(path, content);
console.log('Patched Resume.jsx carefully');
