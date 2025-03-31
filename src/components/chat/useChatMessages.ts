import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateAIResponse, isApiConfigured } from "@/utils/apiService";
import { generatePatternResponse } from "@/utils/patternMatchingService";
import { ChatMessageProps } from "@/components/ChatMessage";

export function useChatMessages(conversationId: string | null, onConversationUpdate?: (title: string) => void) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Clear messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      // In a real app, you would fetch messages for this conversation
      setMessages([]);
    }
  }, [conversationId]);

  // Welcome message when no messages exist
  useEffect(() => {
    if (messages.length === 0 && conversationId) {
      const welcomeMessage: ChatMessageProps = {
        role: "assistant",
        content: "Hello! I'm your pattern-matching chatbot. I can respond to basic queries without using paid AI APIs. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, conversationId]);

  // Get AI response from the backend
  const getAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Generate AI response
      const response = await generateAIResponse(conversationHistory);
      
      // Add AI response to messages
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation title if this is the first message
      if (messages.length === 1 && onConversationUpdate) {
        const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "");
        onConversationUpdate(title);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use pattern matching response
  const getPatternResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Generate pattern-based response
      const response = generatePatternResponse(userMessage);
      
      // Add AI response
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation title if this is the first message
      if (messages.length === 1 && onConversationUpdate) {
        const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "");
        onConversationUpdate(title);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use mock response as fallback when API is not configured
  const getMockResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock AI responses
      const aiResponses = [
        "I'm just a simple AI assistant. I don't have real intelligence, but I can simulate responses.",
        "That's an interesting question! As a demonstration AI, I can only provide mock answers.",
        "I'm designed to show how a chatbot interface would work. In a real implementation, I would connect to a backend API.",
        "In a production environment, I would use a language model like GPT or another AI service to generate proper responses.",
        "This is just a frontend demo. Configure your API key in settings to get real AI responses.",
      ];
      
      // Get random response
      const randomIndex = Math.floor(Math.random() * aiResponses.length);
      const response = aiResponses[randomIndex];
      
      // Add AI response
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation title if this is the first message
      if (messages.length === 1 && onConversationUpdate) {
        const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "");
        onConversationUpdate(title);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (isApiConfigured()) {
      getAIResponse(message);
    } else {
      getPatternResponse(message);
    }
  };

  return {
    messages,
    isLoading,
    handleSendMessage
  };
}
