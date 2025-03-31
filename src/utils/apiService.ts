
// API key management and service calls

interface ApiConfig {
  provider: 'openai';
  apiKey: string | null;
}

// Default empty config
let apiConfig: ApiConfig = {
  provider: 'openai',
  apiKey: null
};

// Initialize from localStorage if available
export const initializeApiConfig = (): boolean => {
  const savedConfig = localStorage.getItem('chatbot_api_config');
  
  if (savedConfig) {
    try {
      apiConfig = JSON.parse(savedConfig);
      return !!apiConfig.apiKey;
    } catch (e) {
      console.error('Failed to parse saved API config:', e);
      return false;
    }
  }
  
  return false;
};

// Save config to localStorage
export const saveApiConfig = (config: ApiConfig): void => {
  apiConfig = config;
  localStorage.setItem('chatbot_api_config', JSON.stringify(config));
};

// Clear saved config
export const clearApiConfig = (): void => {
  apiConfig = {
    provider: 'openai',
    apiKey: null
  };
  localStorage.removeItem('chatbot_api_config');
};

// Get current config
export const getApiConfig = (): ApiConfig => {
  return { ...apiConfig };
};

// Check if API is configured
export const isApiConfigured = (): boolean => {
  return !!apiConfig.apiKey;
};

// Generate AI response using OpenAI
export const generateAIResponse = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
  if (!apiConfig.apiKey) {
    throw new Error('API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
