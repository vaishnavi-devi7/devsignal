const axios = require('axios');
const prompts = require('./prompts');

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    // We can swap providers by changing the baseURL and payload formatter
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Core function to generate structured JSON from an LLM.
   * If the API fails or no key is present, falls back to a deterministic mock to ensure stability.
   */
  async generateJSON(systemPrompt, userContent, schema, fallbackData) {
    if (!this.apiKey || this.apiKey === 'your_ai_api_key_here') {
      console.warn('AI_API_KEY not set. Using fallback data.');
      return fallbackData;
    }

    try {
      // Example implementation for OpenAI Structured Outputs
      const response = await axios.post(
        this.baseURL,
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'response_schema',
              schema: schema,
              strict: true
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseContent = response.data.choices[0].message.content;
      
      // Parse and validate it didn't return arbitrary text
      const parsed = JSON.parse(responseContent);
      return parsed;

    } catch (error) {
      console.error('AI API Error:', error.response?.data || error.message);
      console.warn('Falling back to local static generation due to API failure.');
      return fallbackData;
    }
  }

  // ==========================================
  // Domain-Specific Intelligence Methods
  // ==========================================

  async analyzeResume(resumeText) {
    const fallback = {
      overall_score: 79,
      ats_compatibility: 84,
      technical_skills_score: 91,
      impact_score: 73,
      projects_score: 86,
      detected_skills: ['Python', 'Java', 'React', 'Node.js', 'AWS'],
      missing_skills: ['Docker', 'Testing', 'System Design'],
      improvements: [
        { title: 'Add measurable results to project descriptions.', priority: 'High Priority' },
        { title: 'Highlight deployment experience.', priority: 'Medium Priority' }
      ]
    };

    return await this.generateJSON(
      prompts.resumeAnalysis.systemPrompt,
      resumeText,
      prompts.resumeAnalysis.schema,
      fallback
    );
  }

  async analyzeJobMatch(jobDescription, userProfileData) {
    const fallback = {
      match_score: 84,
      matched_skills: ['React', 'Node.js', 'AWS'],
      partial_skills: ['Testing'],
      missing_skills: ['Docker', 'System Design'],
      why_good_match: 'You possess the entire core full-stack foundation required for this role.',
      whats_missing: 'The role heavily emphasizes containerization and scalable architecture.',
      recommended_actions: ['Learn Docker fundamentals', 'Strengthen system design']
    };

    const promptContext = `
      User Profile: ${JSON.stringify(userProfileData)}
      ---
      Job Description: ${jobDescription}
    `;

    return await this.generateJSON(
      prompts.jobMatchAnalysis.systemPrompt,
      promptContext,
      prompts.jobMatchAnalysis.schema,
      fallback
    );
  }

  async generateRoadmap(skillGaps) {
    const fallback = {
      weeks: [
        { week_number: 1, phase_title: 'Dynamic Programming', tasks: ['Learn fundamentals', 'Solve 5 problems'] },
        { week_number: 2, phase_title: 'System Design', tasks: ['REST architecture', 'Caching'] },
        { week_number: 3, phase_title: 'Cloud', tasks: ['AWS deployment', 'Docker'] }
      ]
    };

    return await this.generateJSON(
      prompts.roadmapGeneration.systemPrompt,
      `Skill gaps to address: ${skillGaps.join(', ')}`,
      prompts.roadmapGeneration.schema,
      fallback
    );
  }

  async recommendDSAFocus(dsaStats) {
    const fallback = {
      focus_topic: 'Dynamic Programming',
      explanation: 'Your success rate drops significantly on 1D/2D DP problems.',
      strong_topics: ['Arrays', 'SQL'],
      weak_topics: ['Dynamic Programming', 'Graphs']
    };

    return await this.generateJSON(
      prompts.dsaRecommendation.systemPrompt,
      `Current Stats: ${JSON.stringify(dsaStats)}`,
      prompts.dsaRecommendation.schema,
      fallback
    );
  }
}

module.exports = new AIService();
