
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const handleNewConversation = () => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: "New Chat",
      date: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (activeConversationId === id) {
      setActiveConversationId(conversations.length > 1 ? conversations[0].id : null);
    }
  };

  const handleUpdateConversationTitle = (title: string) => {
    if (activeConversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, title } 
            : conv
        )
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ChatSidebar 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b h-14 flex items-center px-4">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            <h2 className="font-medium">
              {activeConversationId 
                ? conversations.find(c => c.id === activeConversationId)?.title || "Chat" 
                : "AI Chatbot"}
            </h2>
          </header>
          
          <main className="flex-1 flex flex-col">
            {activeConversationId ? (
              <ChatInterface 
                conversationId={activeConversationId} 
                onConversationUpdate={handleUpdateConversationTitle}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col p-4">
                <h3 className="text-2xl font-semibold mb-2">Welcome to AI Chatbot</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Start a new conversation or select an existing one from the sidebar.
                </p>
                <Button 
                  onClick={handleNewConversation}
                  className="bg-chatbot-accent hover:bg-chatbot-accent/90"
                >
                  Start a New Chat
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
