
import React, { useRef, useEffect } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-chatbot-bot flex items-center justify-center">
            <span className="text-white text-xs">AI</span>
          </div>
          <div className="space-y-2 w-2/3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
