const fs = require('fs');
const path = './frontend/src/components/layout/Navbar.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Github URLs
content = content.replace(/<Link to="https:\/\/github\.com"(.*?)>(.*?)<\/Link>/g, '<a href="https://github.com/vaishnavi-devi7/devsignal"$1>$2</a>');

// Replace hash Links with a tags
content = content.replace(/<Link to="#product"(.*?)>Product<\/Link>/g, '<a href="#product"$1>Product</a>');
content = content.replace(/<Link to="#features"(.*?)>Features<\/Link>/g, '<a href="#features"$1>Features</a>');
content = content.replace(/<Link to="#how-it-works"(.*?)>How it works<\/Link>/g, '<a href="#how-it-works"$1>How it works</a>');

fs.writeFileSync(path, content);
console.log("Patched Navbar");
