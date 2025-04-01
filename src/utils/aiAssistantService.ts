
// NOVA AI Assistant Service that mimics the functionality of the Python backend

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
  if (query.includes('wikipedia')) {
    const searchTerm = query.replace('wikipedia', '').trim();
    return await searchWikipedia(searchTerm);
  } 
  else if (query.includes('open youtube')) {
    window.open('https://youtube.com', '_blank');
    return "I've opened YouTube for you, babu. Is there something specific you'd like to watch?";
  } 
  else if (query.includes('open google')) {
    window.open('https://google.com', '_blank');
    return "I've opened Google. Let me know if you need help searching for something, babu!";
  } 
  else if (query.includes('youtube') && !query.includes('open')) {
    const searchTerm = query.replace('youtube', '').trim();
    const encodedSearch = encodeURIComponent(searchTerm);
    window.open(`https://www.youtube.com/results?search_query=${encodedSearch}`, '_blank');
    return `I've searched YouTube for "${searchTerm}". Hope you find what you're looking for, babu!`;
  } 
  else if (query.includes('google') && !query.includes('open')) {
    const searchTerm = query.replace('google', '').trim();
    const encodedSearch = encodeURIComponent(searchTerm);
    window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
    return `I've searched Google for "${searchTerm}". Let me know if you need more information, babu!`;
  } 
  else if (query.includes('play music')) {
    return "I'd love to play music for you babu, but I don't have access to your local files in this web interface. Would you like me to search for music on YouTube instead?";
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
  else {
    // For general knowledge questions, use multiple search engines
    return await getGeneralKnowledgeResponse(query);
  }
};

// Simulate a Wikipedia search
const searchWikipedia = async (query: string): Promise<string> => {
  try {
    console.log(`Searching Wikipedia for: ${query}`);
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Wikipedia search failed');
    }
    
    const data = await response.json();
    return `Here's what I found on Wikipedia about ${query}, babu: ${data.extract} Would you like to know more?`;
  } catch (error) {
    console.error('Wikipedia error:', error);
    return "I tried searching Wikipedia, but couldn't find information about that, babu. Would you like me to try a different search term or perhaps search Google instead?";
  }
};

// Enhanced general knowledge responses using web search
const getGeneralKnowledgeResponse = async (query: string): Promise<string> => {
  try {
    // First, check for specific patterns that we can handle directly
    if (query.includes('capital of')) {
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
    }
    
    if (query.includes('population of')) {
      const searchTerm = `population of ${query.replace('population of', '').trim()}`;
      const encodedSearch = encodeURIComponent(searchTerm);
      window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
      return `I've opened a Google search for "${searchTerm}", babu. You should find the latest population data there.`;
    }
    
    if (query.includes('weather') || query.includes('temperature')) {
      const searchTerm = `weather ${query.replace('weather', '').replace('temperature', '').trim()}`;
      const encodedSearch = encodeURIComponent(searchTerm);
      window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
      return `I've opened a Google search for "${searchTerm}", babu. You should find the current weather information there.`;
    }
    
    if (query.includes('calculate') || /[0-9+\-*\/^]/.test(query)) {
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
    
    // For other queries, perform a web search
    if (query.length > 0) {
      const encodedSearch = encodeURIComponent(query);
      window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
      return `I've searched Google for "${query}", babu. Check the opened browser tab for the results. Is there anything specific from those results you'd like me to explain?`;
    }
    
    // Use pattern matching service as fallback
    const { generatePatternResponse } = await import('./patternMatchingService');
    return generatePatternResponse(query).replace(/\.$/, ", babu.");
  } catch (error) {
    console.error('Knowledge response error:', error);
    return "I'm sorry babu, I'm having trouble processing that request. Could you try asking in a different way?";
  }
};
