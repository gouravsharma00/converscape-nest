
// Simplified AI Assistant Service

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning! I'm NOVA. How can I help?";
  if (hour < 18) return "Good Afternoon! I'm NOVA. How can I help?";
  return "Good Evening! I'm NOVA. How can I help?";
};

// Process commands from the user
export const processCommand = async (query: string): Promise<string> => {
  query = query.toLowerCase();

  if (query.includes('time')) {
    return `It's currently ${new Date().toLocaleTimeString()}.`;
  } 
  else if (query.includes('date')) {
    return `Today is ${new Date().toLocaleDateString()}.`;
  } 
  else if (query.includes('how are you')) {
    return "I'm doing well! How are you feeling today?";
  } 
  else if (query.includes('bye')) {
    return "Goodbye! Come back anytime you need help.";
  } 
  else if (query.includes('your name') || query.includes('who are you')) {
    return "I'm NOVA, your AI assistant.";
  }
  else if (query.includes('what can you do')) {
    return "I can answer questions, tell jokes, and help with basic information.";
  }
  else if (query.includes('thank')) {
    return "You're welcome! Anything else I can help with?";
  }
  else if (query.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  else {
    // Get response from pattern matching
    return await getPatternResponse(query);
  }
};

// Simplified pattern matching
const getPatternResponse = async (query: string): Promise<string> => {
  // Basic patterns
  if (query.includes('hello') || query.includes('hi')) {
    return "Hello there! How can I help you today?";
  }
  if (query.includes('help')) {
    return "I can answer questions, provide information, or just chat. What's on your mind?";
  }
  
  // Fallback response
  return "I'm not sure I understand. Could you rephrase that?";
};
