
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { generateAIResponse, initializeApiConfig, isApiConfigured } from "@/utils/apiService";
import { ApiSettings } from "@/components/ApiSettings";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatInterfaceProps {
  conversationId: string | null;
  onConversationUpdate?: (title: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationId,
  onConversationUpdate,
}) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if API is configured on component mount
  useEffect(() => {
    const configured = initializeApiConfig();
    setApiConfigured(configured);
  }, []);

  // Handle API configuration change
  const handleApiConfigChange = (isConfigured: boolean) => {
    setApiConfigured(isConfigured);
  };

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
    
    if (apiConfigured) {
      getAIResponse(message);
    } else {
      getMockResponse(message);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, conversationId]);

  return (
    <div className="flex flex-col h-full">
      {!apiConfigured && (
        <Alert variant="warning" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            API key not configured. Responses are simulated. Configure your OpenAI API key in settings.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            role={message.role}
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-2 animate-fade-in">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chatbot-bot">
              <span className="w-4 h-4 text-white flex items-center justify-center text-xs">AI</span>
            </div>
            <div className="space-y-2 w-2/3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};
