
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ApiWarning: React.FC = () => {
  return (
    <Alert variant="default" className="m-4 border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      <AlertDescription>
        Voice-enabled AI assistant. Try asking questions, searching Wikipedia, or saying "open YouTube" or "Google something".
      </AlertDescription>
    </Alert>
  );
};
