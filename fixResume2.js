const fs = require('fs');
const path = './frontend/src/pages/Resume.jsx';
let content = fs.readFileSync(path, 'utf8');

// I will just find the very last </div>\n    </div>\n  );\n};
content = content.replace(
  /<\/div>\n    <\/div>\n  \);\n\};/,
  "        </>\n      )} \n    </div>\n  );\n};"
);

// Remove the `)}` that was closing the `) : (` before
content = content.replace(
  /<\/div>\n\s*\)\}\n\s*<\/div>\n\s*\);\n\};/g,
  "</div>\n        </>\n      )}\n    </div>\n  );\n};"
);

fs.writeFileSync(path, content);
