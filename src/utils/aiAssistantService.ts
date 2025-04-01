
// AI Assistant Service that mimics the functionality of the Python backend

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
    return "Good Morning! What can I do for you?";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon! What can I do for you?";
  } else {
    return "Good Evening! What can I do for you?";
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
    return "Opening YouTube";
  } 
  else if (query.includes('open google')) {
    window.open('https://google.com', '_blank');
    return "Opening Google";
  } 
  else if (query.includes('youtube') && !query.includes('open')) {
    const searchTerm = query.replace('youtube', '').trim();
    const encodedSearch = encodeURIComponent(searchTerm);
    window.open(`https://www.youtube.com/results?search_query=${encodedSearch}`, '_blank');
    return `Searching YouTube for "${searchTerm}"`;
  } 
  else if (query.includes('google') && !query.includes('open')) {
    const searchTerm = query.replace('google', '').trim();
    const encodedSearch = encodeURIComponent(searchTerm);
    window.open(`https://www.google.com/search?q=${encodedSearch}`, '_blank');
    return `Searching Google for "${searchTerm}"`;
  } 
  else if (query.includes('play music')) {
    return "I'd play music for you, but I can't access your local files in a web browser. Try asking for a YouTube song instead!";
  } 
  else if (query.includes('the time')) {
    return `The time is ${getCurrentTime()}`;
  } 
  else if (query.includes('the date')) {
    return `The date is ${getCurrentDate()}`;
  } 
  else if (query.includes('how are you')) {
    return "I am fine! What about you?";
  } 
  else if (query.includes('fine')) {
    return "Sounds good!";
  } 
  else if (query.includes('bye')) {
    return "Goodbye! Have a nice day!";
  } 
  else {
    // For general knowledge questions, use a Wolfram Alpha-like response
    return await getGeneralKnowledgeResponse(query);
  }
};

// Simulate a Wikipedia search
const searchWikipedia = async (query: string): Promise<string> => {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Wikipedia search failed');
    }
    
    const data = await response.json();
    return `According to Wikipedia: ${data.extract}`;
  } catch (error) {
    console.error('Wikipedia error:', error);
    return "I couldn't find information about that on Wikipedia. Could you try a different search term?";
  }
};

// Simulate WolframAlpha functionality with general knowledge responses
const getGeneralKnowledgeResponse = async (query: string): Promise<string> => {
  // This is a mock implementation - in a real app you'd connect to WolframAlpha API
  try {
    // For demonstration, we'll use a simple pattern matching approach
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
          return `The capital of ${country} is ${capitals[key]}.`;
        }
      }
    }
    
    if (query.includes('population of')) {
      return "I don't have current population data. Try looking that up on Google.";
    }
    
    if (query.includes('weather') || query.includes('temperature')) {
      return "I don't have access to current weather data. You might want to check a weather website or app for that information.";
    }
    
    if (query.includes('calculate') || /[0-9+\-*\/^]/.test(query)) {
      try {
        // Extract mathematical expression and evaluate it
        const expression = query.replace(/calculate/i, '').replace(/what is/i, '').trim();
        // CAUTION: eval is generally not recommended for production use due to security risks
        // This is a simplified example
        const result = eval(expression);
        return `The result is ${result}`;
      } catch (e) {
        return "I couldn't calculate that. Please provide a clearer mathematical expression.";
      }
    }
    
    // Default fallback response
    return "I don't have an answer for that. You might want to try searching Google or asking a more specific question.";
  } catch (error) {
    console.error('Knowledge response error:', error);
    return "I'm having trouble finding an answer to that question.";
  }
};
