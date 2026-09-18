module.exports = {
  resumeAnalysis: {
    systemPrompt: `You are an expert technical recruiter and ATS parsing engine. Analyze the provided resume text and extract intelligence as structured JSON. You must evaluate the resume on a scale of 0-100 across multiple criteria.`,
    schema: {
      type: "object",
      properties: {
        overall_score: { type: "number" },
        ats_compatibility: { type: "number" },
        technical_skills_score: { type: "number" },
        impact_score: { type: "number" },
        projects_score: { type: "number" },
        detected_skills: { type: "array", items: { type: "string" } },
        missing_skills: { type: "array", items: { type: "string" } },
        improvements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              priority: { type: "string", enum: ["High Priority", "Medium Priority", "Low Priority"] }
            }
          }
        }
      },
      required: ["overall_score", "ats_compatibility", "technical_skills_score", "impact_score", "projects_score", "detected_skills", "missing_skills", "improvements"]
    }
  },

  jobMatchAnalysis: {
    systemPrompt: `You are an expert technical hiring manager. Compare the provided job description against the developer's resume/skills. Provide a match score and detailed skill gaps as structured JSON.`,
    schema: {
      type: "object",
      properties: {
        match_score: { type: "number" },
        matched_skills: { type: "array", items: { type: "string" } },
        partial_skills: { type: "array", items: { type: "string" } },
        missing_skills: { type: "array", items: { type: "string" } },
        why_good_match: { type: "string" },
        whats_missing: { type: "string" },
        recommended_actions: { type: "array", items: { type: "string" } }
      },
      required: ["match_score", "matched_skills", "partial_skills", "missing_skills", "why_good_match", "whats_missing", "recommended_actions"]
    }
  },

  roadmapGeneration: {
    systemPrompt: `You are a Principal Software Engineer mentoring a junior/mid-level developer. Based on their skill gaps and target job role, generate a 3-week actionable learning roadmap in structured JSON.`,
    schema: {
      type: "object",
      properties: {
        weeks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week_number: { type: "number" },
              phase_title: { type: "string" },
              tasks: { type: "array", items: { type: "string" } }
            }
          }
        }
      },
      required: ["weeks"]
    }
  },

  dsaRecommendation: {
    systemPrompt: `You are an expert competitive programmer and interview coach. Analyze the user's topic performance and provide a single recommended focus area with a brief explanation in structured JSON.`,
    schema: {
      type: "object",
      properties: {
        focus_topic: { type: "string" },
        explanation: { type: "string" },
        strong_topics: { type: "array", items: { type: "string" } },
        weak_topics: { type: "array", items: { type: "string" } }
      },
      required: ["focus_topic", "explanation", "strong_topics", "weak_topics"]
    }
  }
};
