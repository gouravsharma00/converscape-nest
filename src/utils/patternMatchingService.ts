
interface PatternResponse {
  pattern: RegExp;
  responses: string[];
}

// Simple pattern matching chatbot patterns
const chatPatterns: PatternResponse[] = [
  {
    pattern: /hello|hi|hey|howdy/i,
    responses: [
      "Hello there! How can I help you today?",
      "Hi! What would you like to talk about?",
      "Hello! How are you doing today?",
      "Hey there! What can I assist you with?"
    ]
  },
  {
    pattern: /how are you|how're you|how you doing/i,
    responses: [
      "I'm doing well, thank you for asking! How about you?",
      "I'm just a program, but I'm functioning properly! How can I help you today?",
      "All systems operational! What's on your mind?"
    ]
  },
  {
    pattern: /your name|who are you/i,
    responses: [
      "I'm a simple pattern-matching chatbot. You can call me ChatBot!",
      "I'm ChatBot, a simple AI assistant built without external APIs.",
      "I'm your friendly neighborhood chatbot, ready to help!"
    ]
  },
  {
    pattern: /weather|temperature|forecast/i,
    responses: [
      "I'm afraid I can't check the weather for you. I don't have access to real-time weather data.",
      "As a simple chatbot, I don't have the ability to check weather information.",
      "I wish I could tell you about the weather, but I don't have access to that information."
    ]
  },
  {
    pattern: /thank|thanks/i,
    responses: [
      "You're welcome!",
      "Happy to help!",
      "Anytime!",
      "My pleasure!"
    ]
  },
  {
    pattern: /bye|goodbye|see you|later/i,
    responses: [
      "Goodbye! Feel free to chat again anytime.",
      "See you later! Have a great day!",
      "Bye for now! Come back if you have more questions."
    ]
  },
  {
    pattern: /joke|funny|make me laugh/i,
    responses: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I asked the IT guy, 'Can you help me fix my laptop?' He said, 'Have you tried turning it off and on again?'"
    ]
  },
  {
    pattern: /time|current time|what time/i,
    responses: [
      "I don't have access to your local time. You might want to check your device's clock!",
      "As a simple chatbot, I can't determine your current time.",
      "I don't have the ability to know what time it is where you are."
    ]
  }
];

// Fallback responses when no pattern matches
const fallbackResponses = [
  "I'm not sure I understand. Could you rephrase that?",
  "I don't have information about that. Is there something else I can help with?",
  "I'm still learning and I don't know how to respond to that yet.",
  "Interesting question! Unfortunately, I don't have an answer for that.",
  "I'm a simple pattern-matching chatbot with limited capabilities. I might not be able to help with complex queries."
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
