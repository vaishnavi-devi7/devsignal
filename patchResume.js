const fs = require('fs');
const path = './frontend/src/pages/Resume.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\{error && \(\n\s*<div className="p-4 rounded-md bg-danger\/10 border border-danger\/20 text-danger text-sm">\n\s*\{error\}\n\s*<\/div>\n\s*\)\}/,
  ""
);

content = content.replace(
  /<h3 className="text-lg font-medium text-primary mb-1">No resume uploaded yet\.<\/h3>/,
  `{error && (
                <div className="mb-4 p-4 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm w-full text-left">
                  <div className="font-semibold mb-1">Resume upload failed</div>
                  <div>Reason: {error}</div>
                </div>
              )}
              <h3 className="text-lg font-medium text-primary mb-1">No resume uploaded yet.</h3>`
);

content = content.replace(
  /setError\('Failed to fetch resume information\.'\);/,
  "// Handle safely, do not show an aggressive error if it's just empty\n      console.error(err);\n      setError('Failed to fetch resume information.');"
);

fs.writeFileSync(path, content);
console.log("Patched Resume.jsx");
