
// NOVA AI Assistant Service that mimics the functionality of a true AI assistant

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
    return "Good Morning, babu! I'm NOVA, your AI assistant. How can I help you today?";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon, babu! I'm NOVA, your AI assistant. How can I help you today?";
  } else {
    return "Good Evening, babu! I'm NOVA, your AI assistant. How can I help you today?";
  }
};

// Process commands from the user
export const processCommand = async (query: string): Promise<string> => {
  // Convert query to lowercase for easier comparison
  query = query.toLowerCase();

  // Handle different types of commands
  if (query.includes('wikipedia') || query.includes('search for')) {
    const searchTerm = query.replace(/wikipedia|search for/gi, '').trim();
    return `I would search for information about "${searchTerm}" for you, but I'm designed to answer directly instead of searching the web. What specific information would you like to know about ${searchTerm}?`;
  } 
  else if (query.includes('open youtube') || query.includes('youtube')) {
    return "I'm designed to chat with you directly rather than opening websites. Is there something specific you'd like to discuss or a video topic you're interested in?";
  } 
  else if (query.includes('open google') || query.includes('google')) {
    return "I'm your AI assistant, designed to answer your questions directly rather than opening a search engine. What would you like to know about?";
  } 
  else if (query.includes('play music')) {
    return "I'd love to play music for you, babu, but I'm currently designed to be a conversational AI. What kind of music do you enjoy listening to?";
  } 
  else if (query.includes('the time')) {
    return `It's currently ${getCurrentTime()}, babu. Anything else you'd like to know?`;
  } 
  else if (query.includes('the date')) {
    return `Today's date is ${getCurrentDate()}, babu. Do you have any plans for today?`;
  } 
  else if (query.includes('how are you')) {
    return "I'm doing well, thank you for asking babu! As an AI assistant, I'm always ready to help. How are you feeling today?";
  } 
  else if (query.includes('fine') || query.includes('good') || query.includes('great')) {
    return "That's wonderful to hear, babu! Is there anything I can help you with today?";
  } 
  else if (query.includes('bye') || query.includes('goodbye')) {
    return "It was a pleasure chatting with you babu! Feel free to come back anytime you need assistance. Have a great day!";
  }
  else if (query.includes('reset chat')) {
    return "Chat has been reset, babu. What would you like to talk about now?";
  }
  else if (query.includes('calculate') || /[0-9+\-*\/^]/.test(query)) {
    try {
      // Extract mathematical expression and evaluate it
      const expression = query.replace(/calculate/i, '').replace(/what is/i, '').trim();
      // CAUTION: eval is generally not recommended for production use due to security risks
      // This is a simplified example
      const result = eval(expression);
      return `I've calculated that ${expression} equals ${result}, babu. Is there anything else you'd like me to calculate?`;
    } catch (e) {
      return "I'm having trouble understanding that calculation, babu. Could you please phrase it differently or provide a clearer mathematical expression?";
    }
  }
  else if (query.includes('capital of')) {
    const country = query.replace('capital of', '').replace('what is the', '').replace('tell me the', '').trim();
    
    const capitals: Record<string, string> = {
      'usa': 'Washington D.C.',
      'united states': 'Washington D.C.',
      'uk': 'London',
      'united kingdom': 'London',
      'france': 'Paris',
      'germany': 'Berlin',
      'japan': 'Tokyo',
      'china': 'Beijing',
      'india': 'New Delhi',
      'australia': 'Canberra',
      'canada': 'Ottawa',
      'brazil': 'Brasília',
      'mexico': 'Mexico City',
      'russia': 'Moscow'
    };
    
    for (const key in capitals) {
      if (country.includes(key)) {
        return `The capital of ${country} is ${capitals[key]}, babu. It's a fascinating city with rich history and culture!`;
      }
    }
    return `I don't have information about the capital of ${country} in my knowledge base, babu. I'm designed to have limited but helpful responses without searching the internet.`;
  }
  else if (query.includes('population of')) {
    return "I don't have access to current population statistics, babu. I'm designed to be a conversational AI without internet search capabilities. Is there something else I can help you with?";
  }
  else if (query.includes('weather') || query.includes('temperature')) {
    return "I don't have access to current weather information, babu. I'm designed to be a conversational AI without internet access. Could I help you with something else today?";
  }
  else {
    // Use pattern matching service for general conversation
    const { generatePatternResponse } = await import('./patternMatchingService');
    return generatePatternResponse(query).replace(/\.$/, ", babu.");
  }
};

