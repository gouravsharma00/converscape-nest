
import React, { useState, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { initializeApiConfig, isApiConfigured } from "@/utils/apiService";
import { ApiSettings } from "@/components/ApiSettings";
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
  const [apiConfigured, setApiConfigured] = useState(false);
  const { messages, isLoading, handleSendMessage } = useChatMessages(
    conversationId,
    onConversationUpdate
  );

  // Check if API is configured on component mount
  useEffect(() => {
    const configured = initializeApiConfig();
    setApiConfigured(configured);
  }, []);

  // Handle API configuration change
  const handleApiConfigChange = (isConfigured: boolean) => {
    setApiConfigured(isConfigured);
  };

  return (
    <div className="flex flex-col h-full">
      <ApiWarning isApiConfigured={apiConfigured} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
