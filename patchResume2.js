const fs = require('fs');
const path = './frontend/src/pages/Resume.jsx';
let content = fs.readFileSync(path, 'utf8');

// I will re-insert the error block if they have a resume
content = content.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">/,
  `{error && (
          <div className="mb-6 p-4 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
            <div className="font-semibold mb-1">Resume upload failed</div>
            <div>Reason: {error}</div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`
);

fs.writeFileSync(path, content);
console.log("Patched Resume 2");
