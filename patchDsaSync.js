const fs = require('fs');
const path = './server/src/controllers/dsaSyncController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const title = sub.problem.name;",
  "const title = `[${sub.problem.contestId}${sub.problem.index}] ${sub.problem.name}`;"
);

// Add safety checks for edge cases
content = content.replace(
  "let difficulty = 'Medium';\n        if (sub.problem.rating <= 1200) difficulty = 'Easy';\n        else if (sub.problem.rating >= 1900) difficulty = 'Hard';",
  "let difficulty = 'Medium';\n        if (!sub.problem.rating) difficulty = 'Medium'; // fallback\n        else if (sub.problem.rating <= 1200) difficulty = 'Easy';\n        else if (sub.problem.rating >= 1900) difficulty = 'Hard';"
);

content = content.replace(
  "const topic = sub.problem.tags && sub.problem.tags.length > 0 ? sub.problem.tags[0] : 'General';",
  "const topic = (sub.problem.tags && sub.problem.tags.length > 0) ? sub.problem.tags[0] : 'General';\n        const lang = sub.programmingLanguage || 'Unknown';"
);

content = content.replace(
  "sub.programmingLanguage, solvedAt]",
  "lang, solvedAt]"
);

fs.writeFileSync(path, content);
console.log('Patched dsaSyncController.js');
