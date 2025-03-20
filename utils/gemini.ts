import { GoogleGenerativeAI } from '@google/generative-ai';

const HEALTH_CONTEXT = `You are an AI nurse assistant. Your role is to:
1. Only discuss health-related topics
2. Provide general health information and guidance
3. Suggest when to seek professional medical help
4. Never provide specific medical diagnoses
5. Never prescribe medications
6. Always encourage consulting healthcare professionals for serious concerns

also never include * in your answer and never answer in bold text, If users ask about non-health topics, politely redirect them to health-related discussions.`;

export async function chatWithGemini(apiKey: string, message: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [HEALTH_CONTEXT],
        },
        {
          role: 'model',
          parts: ["I understand my role as an AI nurse assistant. I'll focus solely on health-related topics while maintaining appropriate boundaries."],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key and try again.');
      } else if (error.message.includes('404')) {
        throw new Error('Unable to connect to Gemini. Please check your internet connection and try again.');
      }
    }
    throw new Error('An error occurred while chatting with the AI nurse. Please try again later.');
  }
}