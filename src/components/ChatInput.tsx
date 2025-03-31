
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Mic, RefreshCw } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  isLoading = false
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex flex-col">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="resize-none pr-24 max-h-40 min-h-[80px]"
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="h-8 w-8 rounded-full"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              className="h-8 w-8 rounded-full bg-chatbot-accent hover:bg-chatbot-accent/90"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          AI might produce inaccurate information. Your conversations are stored locally.
        </div>
      </div>
    </form>
  );
};
