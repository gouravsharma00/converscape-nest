
import React from "react";
import { ChatInput } from "@/components/ChatInput";
import { ApiWarning } from "@/components/chat/ApiWarning";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { useChatMessages } from "@/components/chat/useChatMessages";

interface ChatInterfaceProps {
  conversationId: string | null;
  onConversationUpdate?: (title: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationId,
  onConversationUpdate,
}) => {
  const { messages, isLoading, handleSendMessage } = useChatMessages(
    conversationId,
    onConversationUpdate
  );

  return (
    <div className="flex flex-col h-full">
      <ApiWarning />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
