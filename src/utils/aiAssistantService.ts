
// NOVA AI Assistant Service - Pure AI mode

// Helper utility to get current time
const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString();
};

// Helper utility to get current date
const getCurrentDate = (): string => {
  return new Date().toLocaleDateString();
};

// Helper to greet based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 12) {
    return "Good Morning! I'm NOVA, your AI assistant. How can I help you today?";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon! I'm NOVA, your AI assistant. How can I help you today?";
  } else {
    return "Good Evening! I'm NOVA, your AI assistant. How can I help you today?";
  }
};

// Process commands from the user
export const processCommand = async (query: string): Promise<string> => {
  // Convert query to lowercase for easier comparison
  query = query.toLowerCase();

  // Handle different types of queries
  if (query.includes('the time')) {
    return `It's currently ${getCurrentTime()}. Anything else you'd like to know?`;
  } 
  else if (query.includes('the date')) {
    return `Today's date is ${getCurrentDate()}. Do you have any plans for today?`;
  } 
  else if (query.includes('how are you')) {
    return "I'm doing well, thank you for asking! As an AI assistant, I'm always ready to help. How are you feeling today?";
  } 
  else if (query.includes('fine') || query.includes('good') || query.includes('great')) {
    return "That's wonderful to hear! Is there anything I can help you with today?";
  } 
  else if (query.includes('bye') || query.includes('goodbye')) {
    return "It was a pleasure chatting with you! Feel free to come back anytime you need assistance. Have a great day!";
  } 
  else if (query.includes('your name') || query.includes('who are you')) {
    return "I'm NOVA, an AI assistant designed to have conversations and provide helpful responses. I'm here to assist you with information and engage in friendly dialogue.";
  }
  else if (query.includes('what can you do')) {
    return "As an AI assistant, I can engage in conversations, answer general knowledge questions, provide information on various topics, help with calculations, and offer assistance with many day-to-day queries. How can I help you today?";
  }
  else if (query.includes('thank') || query.includes('thanks')) {
    return "You're very welcome! I'm happy I could help. Is there anything else you'd like to discuss?";
  }
  else if (query.includes('joke') || query.includes('funny')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "How does a computer get drunk? It takes screenshots!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (query.includes('calculate') || /[0-9+\-*\/^]/.test(query)) {
    try {
      // Extract mathematical expression and evaluate it
      const expression = query.replace(/calculate/i, '').replace(/what is/i, '').trim();
      // CAUTION: eval is generally not recommended for production use due to security risks
      // This is a simplified example
      const result = eval(expression);
      return `I've calculated that ${expression} equals ${result}. Is there anything else you'd like me to calculate?`;
    } catch (e) {
      return "I'm having trouble understanding that calculation. Could you please phrase it differently or provide a clearer mathematical expression?";
    }
  }
  else {
    // For general knowledge questions, use pattern matching
    return await getGeneralKnowledgeResponse(query);
  }
};

// Generate responses based on pattern matching and knowledge base
const getGeneralKnowledgeResponse = async (query: string): Promise<string> => {
  try {
    // Use pattern matching service for responses
    const { generatePatternResponse } = await import('./patternMatchingService');
    return generatePatternResponse(query);
  } catch (error) {
    console.error('Knowledge response error:', error);
    return "I'm sorry, I'm having trouble processing that request. Could you try asking in a different way?";
  }
};
