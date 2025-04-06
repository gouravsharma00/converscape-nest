
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessageProps } from "@/components/ChatMessage";
import { processCommand, getGreeting } from "@/utils/aiAssistantService";

export function useChatMessages(conversationId: string | null, onConversationUpdate?: (title: string) => void) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Add welcome message if empty
  if (messages.length === 0 && conversationId) {
    const greeting = getGreeting();
    setMessages([{
      role: "assistant",
      content: greeting,
      timestamp: new Date(),
    }]);
  }

  // Process user command
  const processUserCommand = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      const response = await processCommand(userMessage);
      
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation title if first message
      if (messages.length === 1 && onConversationUpdate) {
        const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : "");
        onConversationUpdate(title);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to process command',
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
