const fs = require('fs');
const path = './frontend/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<main className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto">', 
  '<main id="product" className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto">'
);

content = content.replace(
  '<div className="mt-20 md:mt-32 max-w-4xl mx-auto">',
  '<div id="how-it-works" className="mt-20 md:mt-32 max-w-4xl mx-auto">'
);

content = content.replace(
  '{/* Features Sections */}\n        <div className="mt-32 space-y-8">',
  '{/* Features Sections */}\n        <div id="features" className="mt-32 space-y-8">'
);

fs.writeFileSync(path, content);
console.log("Patched Home");
