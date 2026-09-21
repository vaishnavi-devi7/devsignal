const fs = require('fs');
const path = './frontend/src/components/layout/Navbar.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Github URLs
content = content.replace(/<Link to="https:\/\/github\.com"/g, '<a href="https://github.com/vaishnavi-devi7/devsignal"');

// Wait, closing </Link> for the Github one
content = content.replace(
  '<a href="https://github.com/vaishnavi-devi7/devsignal" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary transition-colors">\n            <GithubBrandIcon size={18} />\n          </Link>',
  '<a href="https://github.com/vaishnavi-devi7/devsignal" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary transition-colors">\n            <GithubBrandIcon size={18} />\n          </a>'
);
content = content.replace(
  '<a href="https://github.com/vaishnavi-devi7/devsignal" target="_blank" rel="noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors flex items-center gap-2">\n            GitHub\n          </Link>',
  '<a href="https://github.com/vaishnavi-devi7/devsignal" target="_blank" rel="noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-accent transition-colors flex items-center gap-2">\n            GitHub\n          </a>'
);

fs.writeFileSync(path, content);
console.log("Patched Navbar 2");
