
interface PatternResponse {
  pattern: RegExp;
  responses: string[];
}

// NOVA AI pattern matching chatbot patterns
const chatPatterns: PatternResponse[] = [
  {
    pattern: /hello|hi|hey|howdy/i,
    responses: [
      "Hello there! I'm NOVA, your AI assistant. How can I help you today?",
      "Hi! I'm NOVA. What would you like help with?",
      "Hey there! I'm NOVA, ready to assist you. What's on your mind?",
      "Greetings! I'm NOVA, your AI companion. How can I make your day better?"
    ]
  },
  {
    pattern: /how are you|how're you|how you doing/i,
    responses: [
      "I'm doing wonderfully, thank you for asking! How about you?",
      "As an AI assistant, I'm always ready to help! How can I assist you today?",
      "I'm functioning perfectly! I'm excited to help you with whatever you need."
    ]
  },
  {
    pattern: /your name|who are you/i,
    responses: [
      "I'm NOVA, your AI assistant designed to help with information and tasks!",
      "My name is NOVA. I'm an AI assistant here to make your life easier.",
      "I'm NOVA, a voice-enabled AI companion ready to assist you with various tasks and questions."
    ]
  },
  {
    pattern: /weather|temperature|forecast/i,
    responses: [
      "I'd love to tell you about the weather, but I don't have access to real-time weather data. Would you like me to open a weather website for you?",
      "I don't have access to current weather information. Would you like me to search the web for weather updates?",
      "Unfortunately, I can't check the weather directly. Would you like me to Google the weather forecast for you?"
    ]
  },
  {
    pattern: /thank|thanks/i,
    responses: [
      "You're very welcome! It's my pleasure to help.",
      "Happy to be of service! Is there anything else you need?",
      "Glad I could assist! Don't hesitate to ask if you need anything else.",
      "It's what I'm here for! Let me know if you need more help."
    ]
  },
  {
    pattern: /bye|goodbye|see you|later/i,
    responses: [
      "Goodbye! I'll be here whenever you need assistance again.",
      "Take care! It was a pleasure chatting with you.",
      "Until next time! Feel free to come back whenever you have questions."
    ]
  },
  {
    pattern: /joke|funny|make me laugh/i,
    responses: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "How does a computer get drunk? It takes screenshots!"
    ]
  },
  {
    pattern: /time|current time|what time/i,
    responses: [
      `It's currently ${new Date().toLocaleTimeString()}. Is there anything I can help you with?`,
      `The time right now is ${new Date().toLocaleTimeString()}. Do you have any appointments coming up?`,
      `It's ${new Date().toLocaleTimeString()} now. Time flies when you're having fun, doesn't it?`
    ]
  },
  {
    pattern: /what can you do|help|capabilities/i,
    responses: [
      "I can answer questions, search Wikipedia, open websites like YouTube and Google, and even perform voice commands! Just ask me anything.",
      "I'm designed to be your helpful assistant! I can search the web, answer questions, tell jokes, and help with various tasks through voice or text commands.",
      "As NOVA, I can help you find information, search Wikipedia, open websites, answer general knowledge questions, and much more. What would you like help with?"
    ]
  }
];

// Fallback responses when no pattern matches
const fallbackResponses = [
  "I'm not quite sure I understand. Could you rephrase that or ask me something else?",
  "That's an interesting question! I don't have a specific answer for that, but I'm happy to help with something else.",
  "I'm still learning and evolving. Could you try asking that in a different way?",
  "I don't have information about that specific topic yet. Is there something else you'd like to know?",
  "I appreciate your question, but I might need more context to provide a helpful answer. Could you elaborate?"
];

/**
 * Generate a response based on pattern matching
 * @param message The user's message
 * @returns A response based on pattern matching
 */
export const generatePatternResponse = (message: string): string => {
  // Find a matching pattern
  for (const item of chatPatterns) {
    if (item.pattern.test(message)) {
      // Return a random response from the matching pattern
      const randomIndex = Math.floor(Math.random() * item.responses.length);
      return item.responses[randomIndex];
    }
  }

  // If no pattern matches, return a fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};
