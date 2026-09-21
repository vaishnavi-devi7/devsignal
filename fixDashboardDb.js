const fs = require('fs');
const path = './server/src/controllers/dashboardController.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "FROM resumes WHERE user_id",
  "FROM resume_profiles WHERE user_id"
);
// wait, resume_profiles schema: id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at
content = content.replace(
  "'SELECT id, file_name, file_url, parsed_data, status, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1'",
  "'SELECT id, file_name, file_type, full_name, email, phone, location, skills, programming_languages, frameworks, databases, tools, education, experience, projects, certifications, updated_at FROM resume_profiles WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1'"
);

fs.writeFileSync(path, content);
console.log('Fixed DB issue in Dashboard controller');
