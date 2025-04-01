
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessageProps } from "@/components/ChatMessage";
import { processCommand, getGreeting } from "@/utils/aiAssistantService";

export function useChatMessages(conversationId: string | null, onConversationUpdate?: (title: string) => void) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Clear messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      setMessages([]);
    }
  }, [conversationId]);

  // Welcome message when no messages exist
  useEffect(() => {
    if (messages.length === 0 && conversationId) {
      const greeting = getGreeting();
      const welcomeMessage: ChatMessageProps = {
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, conversationId]);

  // Process user command and get AI response
  const processUserCommand = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Process the command using our AI service
      const response = await processCommand(userMessage);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to process command';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages.length, onConversationUpdate, toast]);

  const handleSendMessage = useCallback((message: string) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    processUserCommand(message);
  }, [processUserCommand]);

  return {
    messages,
    isLoading,
    handleSendMessage
  };
}
