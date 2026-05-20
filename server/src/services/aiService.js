import logger from '../utils/logger.js';

const callAI = async (messages) => {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
  if (!apiKey) {
    return null;
  }
  try {
    const res = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1024,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    logger.warn(`AI service error: ${err.message}`);
    return null;
  }
};

export const aiChat = async (message, context = '') => {
  const response = await callAI([
    { role: 'system', content: `You are InAcademy AI tutor. Help students learn. Context: ${context}` },
    { role: 'user', content: message },
  ]);
  return response || 'I can help you with your studies! Configure AI_API_KEY for full AI responses. Ask about courses, tests, or study plans.';
};

export const aiSummarize = async (text) => {
  const response = await callAI([
    { role: 'system', content: 'Summarize this lecture content concisely for students.' },
    { role: 'user', content: text },
  ]);
  return response || 'Summary: Key concepts covered in this lecture. Enable AI_API_KEY for auto-generated summaries.';
};

export const aiStudyPlan = async (goals, subjects) => {
  const response = await callAI([
    { role: 'system', content: 'Create a weekly study plan as JSON with days and tasks.' },
    { role: 'user', content: `Goals: ${goals}. Subjects: ${subjects}` },
  ]);
  return response || JSON.stringify({
    week: [
      { day: 'Monday', tasks: ['Revise notes', 'Practice 20 MCQs'] },
      { day: 'Tuesday', tasks: ['Watch 2 lectures', 'Mock test'] },
    ],
  });
};

export const aiPerformanceAnalysis = async (attemptData) => {
  const response = await callAI([
    { role: 'system', content: 'Analyze test performance and give improvement tips.' },
    { role: 'user', content: JSON.stringify(attemptData) },
  ]);
  return response || 'Focus on weak topics and practice timed mocks daily.';
};

export const aiRecommendations = async (userProfile) => {
  return {
    courses: [],
    message: 'Personalized recommendations based on your progress.',
    profile: userProfile,
  };
};
