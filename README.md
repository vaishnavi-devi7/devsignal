# DevSignal

**DevSignal** is a Developer Intelligence Platform designed to analyze a software engineer's GitHub activity, DSA (Data Structures and Algorithms) progress, resume, and skills against real job descriptions. It provides a centralized, data-driven readiness score and a personalized improvement roadmap.

This project was built to demonstrate full-stack engineering, clean architecture, AI integration, and production-grade database design.

---

## Features

- **Developer Readiness Scoring:** Aggregates metrics across GitHub, LeetCode, and resumes into a unified performance score.
- **GitHub Intelligence:** Analyzes repositories, contribution frequency, and language proficiency to extract actionable engineering insights.
- **DSA Analytics:** Tracks problem-solving velocity, identifies weak topics (e.g., Dynamic Programming vs. Arrays), and recommends targeted focus areas.
- **Resume Parsing & Scoring:** Evaluates resumes for ATS compatibility, technical depth, and project impact, highlighting missing required skills.
- **Job Match Intelligence:** Compares developer profiles against specific Job Descriptions to identify exact skill gaps (Matched, Partial, Missing).
- **AI-Powered Roadmaps:** Generates a personalized, phased weekly learning roadmap to bridge identified skill gaps.

---

## Architecture & Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Charts:** Chart.js + react-chartjs-2
- **Icons:** Lucide React
- **Design System:** Custom minimal, dark-themed UI components (inspired by Vercel/Linear).

### Backend
- **Framework:** Node.js + Express.js
- **Database:** PostgreSQL (using `pg` driver)
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs
- **External APIs:** GitHub API (Isolated Service)
- **AI Integration:** Agnostic LLM Service (Structured JSON enforced)

---

## Screenshots

<img width="1468" height="801" alt="Screenshot 2026-09-21 at 1 54 00 PM" src="https://github.com/user-attachments/assets/3a266264-05bd-4ec6-8ba4-84231214c44a" />


- **Dashboard:** `![Dashboard](./docs/dashboard.png)`
- **GitHub Intelligence:** `![GitHub](./docs/github.png)`
- **Job Match:** `![Job Match](./docs/jobs.png)`
- **AI Roadmap:** `![Roadmap](./docs/roadmap.png)`

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Ensure PostgreSQL is running, then create a new database named `devsignal`.

### 2. Backend Setup
```bash
cd server
npm install

# Copy the example environment file
cp .env.example .env
```
Update `.env` with your database credentials, JWT secret, and API keys.

Initialize and seed the database with mock data:
```bash
npm run db:init
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5001`.

---

## Environment Variables

### Server (`server/.env`)
See `server/.env.example` for the required keys:
- `DB_*`: PostgreSQL connection details.
- `JWT_SECRET`: Used for signing authentication tokens.
- `GITHUB_TOKEN`: (Optional) Increases GitHub API rate limits from 60/hr to 5000/hr.
- `AI_API_KEY`: API key for the chosen LLM provider (OpenAI, Gemini, etc.).

---

## API Documentation

### Authentication (`/api/auth`)
- `POST /register` - Register a new user (Requires: name, email, password)
- `POST /login` - Authenticate and receive JWT (Requires: email, password)
- `GET /me` - Retrieve current authenticated user profile (Requires: Bearer Token)

### GitHub Intelligence (`/api/github`)
- `POST /sync` - Triggers a background sync of a user's GitHub footprint.
- `GET /` - Retrieves the normalized profile and repository statistics.

*(Additional endpoints for `/profile`, `/dsa`, `/resume`, `/jobs`, and `/roadmap` are structurally mounted and ready for controller implementation).*

---

## Database Structure

The PostgreSQL schema is fully normalized and heavily indexed for performance:

- `users`: Core identity and authentication.
- `developer_profiles`: 1:1 mapping for overarching scores.
- `github_profiles` & `github_repositories`: 1:N relational mapping of a developer's open-source footprint.
- `dsa_progress` & `dsa_topics`: Tracks aggregate metrics and unique topic proficiencies.
- `resumes` & `resume_skills`: Supports multiple parsed resume iterations.
- `job_analyses` & `job_skills`: Tracks JD matching history.
- `roadmap_tasks`: AI-generated phased learning objectives.

*Refer to `server/database/schema.sql` for exact constraints and index definitions.*

---

## AI Architecture

The AI layer is completely isolated within `server/services/aiService.js`.
- **Strict Structured Outputs:** The service strictly enforces JSON schema adherence via the API layer, parsing and validating before returning data to the controllers.
- **Provider Agnostic:** Uses `axios` to construct standard completion payloads, making it trivial to swap between OpenAI, Anthropic, or Gemini.
- **Graceful Fallbacks:** If the API fails or rate-limits, the service catches the error and returns a structurally perfect static mock object, ensuring the frontend never crashes.
- **Prompt Engineering:** Prompts are decoupled into `server/services/prompts.js` to separate instructions and JSON schema definitions from business logic.

---

## Future Improvements

- **OAuth Integration:** Add "Sign in with GitHub" to streamline onboarding.
- **Real-time Webhooks:** Listen for GitHub push events to update the dashboard in real-time.
- **Frontend State Management:** Migrate to Redux Toolkit or Zustand as the application scales.
- **Dockerization:** Add a `docker-compose.yml` for single-command orchestration of the frontend, backend, and PostgreSQL database.

