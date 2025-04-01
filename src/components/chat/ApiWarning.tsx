
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ApiWarning: React.FC = () => {
  return (
    <Alert variant="default" className="m-4 border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
      <AlertCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
      <AlertDescription>
        <span className="font-semibold">NOVA AI Assistant</span> - Your enhanced voice-enabled companion. 
        Ask questions, search Wikipedia, or try voice commands like "open YouTube", "Google something", 
        or ask about the weather, time, and more. Say "bye babu" to end the conversation.
      </AlertDescription>
    </Alert>
  );
};
