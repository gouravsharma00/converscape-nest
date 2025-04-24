
import { generateAIResponse } from './apiService';

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning! I'm BuddyAI. How can I help?";
  if (hour < 18) return "Good Afternoon! I'm BuddyAI. How can I help?";
  return "Good Evening! I'm BuddyAI. How can I help?";
};

export const processCommand = async (query: string): Promise<string> => {
  try {
    const response = await generateAIResponse([
      { role: 'user', content: query }
    ]);
    return response;
  } catch (error) {
    console.error('Error processing command:', error);
    return "I'm having trouble connecting to my AI service. Please check your API settings or try again later.";
  }
};
