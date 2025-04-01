
import React from "react";
import { AlertCircle } from "lucide-react";

export const ApiWarning: React.FC = () => {
  return (
    <div className="bg-muted p-3 text-sm border-b flex items-center gap-2">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <span>
        NOVA is an AI assistant designed to respond directly to your queries without searching the web.
      </span>
    </div>
  );
};
