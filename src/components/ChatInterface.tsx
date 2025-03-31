
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // AI response examples
  const aiResponses = [
    "I'm just a simple AI assistant. I don't have real intelligence, but I can simulate responses.",
    "That's an interesting question! As a demonstration AI, I can only provide mock answers.",
    "I'm designed to show how a chatbot interface would work. In a real implementation, I would connect to a backend API.",
    "In a production environment, I would use a language model like GPT or another AI service to generate proper responses.",
    "This is just a frontend demo. With a backend integration, I could provide more meaningful and dynamic answers.",
  ];

  // Generate a random AI response
  const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    return aiResponses[randomIndex];
  };

  // Simulate AI response with a delay
  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Add AI response
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: getRandomResponse(),
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
    simulateAIResponse(message);
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
