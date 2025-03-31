
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
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        API key not configured. Responses are simulated. Configure your OpenAI API key in settings.
      </AlertDescription>
    </Alert>
  );
};
