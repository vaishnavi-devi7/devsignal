const axios = require('axios');
const crypto = require('crypto');

const generateInputHash = (inputObj) => {
  return crypto.createHash('sha256').update(JSON.stringify(inputObj)).digest('hex');
};

const callAI = async (prompt, systemInstruction) => {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'gemini';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    throw new Error('AI service is not configured.');
  }

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json"
        }
      };

      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      let text = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(text);
    } else if (provider === 'openai') {
      const url = `https://api.openai.com/v1/chat/completions`;
      const payload = {
        model: model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      };
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return JSON.parse(response.data.choices[0].message.content);
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error('AI Service Error:', error?.response?.data || error.message);
    throw new Error('Failed to generate AI insights.');
  }
};

module.exports = {
  callAI,
  generateInputHash
};
