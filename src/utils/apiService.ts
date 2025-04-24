// API service for chat functionalities
import { createClient } from '@supabase/supabase-js';

interface ApiConfig {
  provider: 'openai' | 'supabase' | 'perplexity';
  apiKey: string | null;
  model?: string;
}

// Default config
let apiConfig: ApiConfig = {
  provider: 'openai',
  apiKey: null,
  model: 'gpt-3.5-turbo'
};

// Initialize Supabase client
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    apiKey: null,
    model: 'gpt-3.5-turbo'
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

// Save conversation to Supabase
export const saveConversationToSupabase = async (
  conversationId: string,
  title: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('conversations')
      .upsert({ id: conversationId, title, updated_at: new Date().toISOString() });
    
    return !error;
  } catch (e) {
    console.error('Error saving conversation:', e);
    return false;
  }
};

// Save message to Supabase
export const saveMessageToSupabase = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        created_at: new Date().toISOString()
      });
    
    return !error;
  } catch (e) {
    console.error('Error saving message:', e);
    return false;
  }
};

// Load conversations from Supabase
export const loadConversationsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error loading conversations:', e);
    return [];
  }
};

// Load messages for a conversation from Supabase
export const loadMessagesFromSupabase = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Error loading messages:', e);
    return [];
  }
};

// Generate AI response using OpenAI directly
const generateOpenAIResponse = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
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
        model: apiConfig.model || 'gpt-3.5-turbo',
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
    console.error('Error generating OpenAI response:', error);
    throw error;
  }
};

// Generate AI response using Supabase Edge Functions
const generateSupabaseAIResponse = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: { messages, model: apiConfig.model || 'gpt-3.5-turbo' }
    });

    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error('Error generating Supabase AI response:', error);
    throw error;
  }
};

// Generate AI response using Perplexity
const generatePerplexityResponse = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
  if (!apiConfig.apiKey) {
    throw new Error('API key not configured');
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are BuddyAI, a helpful and friendly AI assistant. Be concise and helpful in your responses.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating Perplexity response:', error);
    throw error;
  }
};

// Generate AI response using selected provider
export const generateAIResponse = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
  if (apiConfig.provider === 'perplexity') {
    return generatePerplexityResponse(messages);
  } else if (apiConfig.provider === 'supabase') {
    return generateSupabaseAIResponse(messages);
  } else {
    return generateOpenAIResponse(messages);
  }
};
