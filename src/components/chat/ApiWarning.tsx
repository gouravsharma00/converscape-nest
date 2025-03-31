
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApiWarningProps {
  isApiConfigured: boolean;
}

export const ApiWarning: React.FC<ApiWarningProps> = ({ isApiConfigured }) => {
  if (isApiConfigured) {
    return null;
  }

  return (
    <Alert variant="default" className="m-4 border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      <AlertDescription>
        Using pattern-matching chatbot mode. This chatbot responds to common phrases without using external AI APIs.
      </AlertDescription>
    </Alert>
  );
};
