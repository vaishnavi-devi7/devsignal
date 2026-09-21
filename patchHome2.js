const fs = require('fs');
const path = './frontend/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '{/* Dashboard Preview */}\n        <div className="relative max-w-5xl mx-auto ">',
  '{/* Dashboard Preview */}\n        <div id="how-it-works" className="relative max-w-5xl mx-auto ">'
);

fs.writeFileSync(path, content);
console.log("Patched Home2");
