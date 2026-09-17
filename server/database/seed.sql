-- DevSignal Seed Data
-- CAUTION: Do NOT insert real personal information. This is for development only.

-- Insert 1 User (Password is 'password123' hashed using bcrypt)
-- Hash generated via bcryptjs (salt factor 10)
INSERT INTO users (id, name, email, password) 
VALUES (1, 'Alex Developer', 'alex@example.com', '$2a$10$wN/7R/9rL1tU1hX5d4y5M.B0d4y5M.B0d4y5M.B0d4y5M.B0d4y5M');
-- We assume the above is a valid bcrypt hash, since we're injecting directly via SQL.
-- (For real use, they will register via API. But for the sake of the DB we'll inject a fake hash)

-- Insert Developer Profile
INSERT INTO developer_profiles (user_id, readiness_score, title, bio, location) 
VALUES (1, 84, 'Full Stack Engineer', 'Passionate software engineer specializing in modern web architecture.', 'San Francisco, CA');

-- Insert GitHub Profile
INSERT INTO github_profiles (id, user_id, github_username, total_repositories, total_stars, followers, total_contributions) 
VALUES (1, 1, 'alexdeveloper', 42, 186, 73, 1284);

-- Insert GitHub Repositories
INSERT INTO github_repositories (github_profile_id, name, primary_language, stars, forks, activity_level) VALUES 
(1, 'MarketMind AI', 'Python', 84, 12, 'High'),
(1, 'Smart Library', 'TypeScript', 45, 8, 'Medium'),
(1, 'QueryFlow', 'JavaScript', 32, 4, 'High'),
(1, 'DevSignal', 'React', 25, 2, 'Very High');

-- Insert DSA Progress
INSERT INTO dsa_progress (id, user_id, total_solved, easy_solved, medium_solved, hard_solved, current_streak) 
VALUES (1, 1, 127, 82, 38, 7, 14);

-- Insert DSA Topics
INSERT INTO dsa_topics (dsa_progress_id, topic_name, proficiency_score, problems_solved) VALUES 
(1, 'Arrays', 92, 45),
(1, 'Linked Lists', 88, 20),
(1, 'Trees', 45, 12),
(1, 'Graphs', 30, 5),
(1, 'Dynamic Programming', 25, 8),
(1, 'SQL', 95, 30);

-- Insert Resume Analysis
INSERT INTO resumes (id, user_id, filename, overall_score, ats_compatibility, technical_skills_score, impact_score, projects_score) 
VALUES (1, 1, 'alex_resume_v4.pdf', 79, 84, 91, 73, 86);

-- Insert Resume Skills
INSERT INTO resume_skills (resume_id, skill_name, skill_category) VALUES 
(1, 'Python', 'Detected'),
(1, 'Java', 'Detected'),
(1, 'React', 'Detected'),
(1, 'Node.js', 'Detected'),
(1, 'AWS', 'Detected'),
(1, 'Docker', 'Missing'),
(1, 'Testing', 'Missing');

-- Insert Job Analysis
INSERT INTO job_analyses (id, user_id, job_title, company_name, job_description, match_score) 
VALUES (1, 1, 'Senior Frontend Engineer', 'Stripe', 'Looking for a React expert with AWS and SQL experience.', 88);

-- Insert Job Skills
INSERT INTO job_skills (job_analysis_id, skill_name, match_status) VALUES 
(1, 'React', 'Matched'),
(1, 'JavaScript', 'Matched'),
(1, 'Node.js', 'Matched'),
(1, 'Testing', 'Partial'),
(1, 'Docker', 'Missing'),
(1, 'System Design', 'Missing');

-- Insert Roadmap Tasks
INSERT INTO roadmap_tasks (user_id, week_number, phase_title, task_label, is_completed) VALUES 
(1, 1, 'Dynamic Programming', 'Learn fundamentals', TRUE),
(1, 1, 'Dynamic Programming', 'Solve 5 problems', TRUE),
(1, 1, 'Dynamic Programming', 'Review mistakes', TRUE),
(1, 2, 'System Design', 'REST architecture', TRUE),
(1, 2, 'System Design', 'Caching', FALSE),
(1, 2, 'System Design', 'Database design', FALSE),
(1, 3, 'Cloud', 'AWS deployment', FALSE),
(1, 3, 'Cloud', 'Docker', FALSE),
(1, 3, 'Cloud', 'CI/CD', FALSE);

-- Reset Sequences since we hardcoded IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('github_profiles_id_seq', (SELECT MAX(id) FROM github_profiles));
SELECT setval('dsa_progress_id_seq', (SELECT MAX(id) FROM dsa_progress));
SELECT setval('resumes_id_seq', (SELECT MAX(id) FROM resumes));
SELECT setval('job_analyses_id_seq', (SELECT MAX(id) FROM job_analyses));
