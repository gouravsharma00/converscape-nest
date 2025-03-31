
import React from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { ConversationsList } from "@/components/ConversationsList";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center h-14 px-4">
          <Bot className="h-6 w-6 text-chatbot-accent mr-2" />
          <h1 className="font-semibold text-lg">AI Chatbot</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ConversationsList 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelect={onSelectConversation}
          onNew={onNewConversation}
          onDelete={onDeleteConversation}
        />
      </SidebarContent>
    </Sidebar>
  );
};
