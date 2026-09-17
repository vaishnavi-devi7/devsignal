-- DevSignal PostgreSQL Database Schema

-- Drop tables if they exist to allow clean recreations (useful for dev)
DROP TABLE IF EXISTS roadmap_tasks CASCADE;
DROP TABLE IF EXISTS job_skills CASCADE;
DROP TABLE IF EXISTS job_analyses CASCADE;
DROP TABLE IF EXISTS resume_skills CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS dsa_topics CASCADE;
DROP TABLE IF EXISTS dsa_progress CASCADE;
DROP TABLE IF EXISTS github_repositories CASCADE;
DROP TABLE IF EXISTS github_profiles CASCADE;
DROP TABLE IF EXISTS developer_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- 1. USERS
-- Core authentication and identity table.
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. DEVELOPER PROFILES
-- 1:1 Relationship with users.
-- Stores the overarching metrics and summary for a developer.
-- ==========================================
CREATE TABLE developer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100) DEFAULT 0,
    title VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dev_profiles_user_id ON developer_profiles(user_id);

-- ==========================================
-- 3. GITHUB PROFILES
-- 1:1 Relationship with users.
-- Stores aggregate GitHub intelligence metrics.
-- ==========================================
CREATE TABLE github_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    github_username VARCHAR(255) UNIQUE NOT NULL,
    total_repositories INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_github_profiles_user_id ON github_profiles(user_id);

-- ==========================================
-- 4. GITHUB REPOSITORIES
-- 1:N Relationship with github_profiles.
-- Stores specific repositories analyzed for quality.
-- ==========================================
CREATE TABLE github_repositories (
    id SERIAL PRIMARY KEY,
    github_profile_id INTEGER NOT NULL REFERENCES github_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    primary_language VARCHAR(100),
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    activity_level VARCHAR(50), -- e.g., 'Very High', 'High', 'Medium', 'Low'
    last_updated TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_github_repos_profile_id ON github_repositories(github_profile_id);

-- ==========================================
-- 5. DSA PROGRESS
-- 1:1 Relationship with users.
-- Stores aggregate LeetCode/DSA problem-solving metrics.
-- ==========================================
CREATE TABLE dsa_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_solved INTEGER DEFAULT 0,
    easy_solved INTEGER DEFAULT 0,
    medium_solved INTEGER DEFAULT 0,
    hard_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dsa_progress_user_id ON dsa_progress(user_id);

-- ==========================================
-- 6. DSA TOPICS
-- 1:N Relationship with dsa_progress.
-- Tracks proficiency across specific topics (Arrays, DP, etc.)
-- ==========================================
CREATE TABLE dsa_topics (
    id SERIAL PRIMARY KEY,
    dsa_progress_id INTEGER NOT NULL REFERENCES dsa_progress(id) ON DELETE CASCADE,
    topic_name VARCHAR(255) NOT NULL,
    proficiency_score INTEGER CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
    problems_solved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dsa_topics_progress_id ON dsa_topics(dsa_progress_id);
-- Ensure a user doesn't have duplicate topics recorded multiple times
ALTER TABLE dsa_topics ADD CONSTRAINT unique_topic_per_progress UNIQUE (dsa_progress_id, topic_name);

-- ==========================================
-- 7. RESUMES
-- 1:N Relationship with users.
-- A user can upload multiple versions of their resume for analysis.
-- ==========================================
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    ats_compatibility INTEGER CHECK (ats_compatibility >= 0 AND ats_compatibility <= 100),
    technical_skills_score INTEGER CHECK (technical_skills_score >= 0 AND technical_skills_score <= 100),
    impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
    projects_score INTEGER CHECK (projects_score >= 0 AND projects_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- ==========================================
-- 8. RESUME SKILLS
-- 1:N Relationship with resumes.
-- Extracted skills from the resume parser.
-- ==========================================
CREATE TABLE resume_skills (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(100), -- e.g., 'Detected', 'Missing', 'Recommended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_resume_skills_resume_id ON resume_skills(resume_id);

-- ==========================================
-- 9. JOB ANALYSES
-- 1:N Relationship with users.
-- Tracks when a user pastes a JD to match against their profile.
-- ==========================================
CREATE TABLE job_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    job_description TEXT NOT NULL,
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_job_analyses_user_id ON job_analyses(user_id);

-- ==========================================
-- 10. JOB SKILLS
-- 1:N Relationship with job_analyses.
-- Maps skills from the JD to the user's proficiency (Matched, Missing, Partial).
-- ==========================================
CREATE TABLE job_skills (
    id SERIAL PRIMARY KEY,
    job_analysis_id INTEGER NOT NULL REFERENCES job_analyses(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    match_status VARCHAR(50) NOT NULL CHECK (match_status IN ('Matched', 'Partial', 'Missing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_job_skills_analysis_id ON job_skills(job_analysis_id);

-- ==========================================
-- 11. ROADMAP TASKS
-- 1:N Relationship with users.
-- Stores tasks assigned to a user by the AI to improve their profile.
-- ==========================================
CREATE TABLE roadmap_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    phase_title VARCHAR(255) NOT NULL,
    task_label VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_roadmap_tasks_user_id ON roadmap_tasks(user_id);
