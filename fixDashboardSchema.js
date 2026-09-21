const fs = require('fs');
const path = './server/src/controllers/dashboardController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "SELECT id, file_name, file_url, parsed_data, status, created_at, updated_at FROM resume_profiles",
  "SELECT id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at FROM resume_profiles"
);

fs.writeFileSync(path, content);
console.log('Fixed dashboard DB schema');
