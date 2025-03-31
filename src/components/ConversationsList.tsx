
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button 
          onClick={onNew}
          className="w-full justify-start bg-chatbot-accent hover:bg-chatbot-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-2">
        {conversations.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Button
                  variant={activeConversationId === conversation.id ? "secondary" : "ghost"}
                  className="w-full justify-between group"
                  onClick={() => onSelect(conversation.id)}
                >
                  <div className="flex items-center truncate">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">{conversation.title}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
