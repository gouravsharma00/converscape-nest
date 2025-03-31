
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { saveApiConfig, getApiConfig, clearApiConfig, isApiConfigured } from "@/utils/apiService";

interface ApiSettingsProps {
  onConfigChange: (isConfigured: boolean) => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({ onConfigChange }) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const config = getApiConfig();
    setApiKey(config.apiKey || "");
    const isConfigured = isApiConfigured();
    setConfigured(isConfigured);
    onConfigChange(isConfigured);
  }, [onConfigChange]);

  const handleSave = () => {
    saveApiConfig({
      provider: 'openai',
      apiKey: apiKey.trim()
    });
    const isConfigured = isApiConfigured();
    setConfigured(isConfigured);
    onConfigChange(isConfigured);
    setOpen(false);
  };

  const handleClear = () => {
    clearApiConfig();
    setApiKey("");
    setConfigured(false);
    onConfigChange(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setOpen(true)}
        className="ml-2 relative"
      >
        <Settings className="h-4 w-4" />
        {configured && 
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></div>
        }
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI API Configuration</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to enable AI chat responses.
              Your key is stored only in your browser's local storage.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="sk-..."
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            {configured && (
              <Button
                variant="outline" 
                onClick={handleClear}
                className="mr-auto"
              >
                Clear API Key
              </Button>
            )}
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
