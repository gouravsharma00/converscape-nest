
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp = new Date(),
}) => {
  const isUser = role === "user";
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "flex max-w-3xl",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full mr-2",
          isUser ? "ml-2 mr-0 bg-chatbot-user" : "bg-chatbot-bot"
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-black" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div 
          className={cn(
            "px-4 py-3 rounded-lg",
            isUser 
              ? "bg-chatbot-user text-black rounded-tr-none" 
              : "bg-chatbot-bot text-white rounded-tl-none"
          )}
        >
          <div className="whitespace-pre-wrap">{content}</div>
          <div 
            className={cn(
              "text-xs mt-1 opacity-70",
              isUser ? "text-right" : "text-left"
            )}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
