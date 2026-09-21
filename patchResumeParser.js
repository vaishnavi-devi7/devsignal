const fs = require('fs');
const path = './server/src/services/resumeParser.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'rawText = data.text;',
  'rawText = data.text || "";'
);
content = content.replace(
  'rawText = result.value;',
  'rawText = result.value || "";'
);

content = content.replace(
  'const extractStructuredData = (text) => {',
  'const extractStructuredData = (text) => {\n  if (!text) text = "";'
);

fs.writeFileSync(path, content);
console.log('Patched resumeParser.js');
