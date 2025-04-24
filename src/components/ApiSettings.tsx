
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveApiConfig, getApiConfig, clearApiConfig, isApiConfigured } from "@/utils/apiService";

interface ApiSettingsProps {
  onConfigChange: (isConfigured: boolean) => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({ onConfigChange }) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<"openai" | "supabase">("openai");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const config = getApiConfig();
    setApiKey(config.apiKey || "");
    setProvider(config.provider || "perplexity");  // Set default to Perplexity
    setModel(config.model || "llama-3.1-sonar-small-128k-online");
    const isConfigured = isApiConfigured();
    setConfigured(isConfigured);
    onConfigChange(isConfigured);
  }, [onConfigChange]);

  const handleSave = () => {
    saveApiConfig({
      provider,
      apiKey: apiKey.trim(),
      model
    });
    const isConfigured = isApiConfigured();
    setConfigured(isConfigured);
    onConfigChange(isConfigured);
    setOpen(false);
  };

  const handleClear = () => {
    clearApiConfig();
    setApiKey("");
    setProvider("openai");
    setModel("gpt-3.5-turbo");
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
              Configure your AI provider settings. Your settings are stored securely in your browser's local storage.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Select
                value={provider}
                onValueChange={(value: "openai" | "supabase" | "perplexity") => setProvider(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perplexity">Perplexity AI</SelectItem>
                  <SelectItem value="openai">OpenAI (Direct)</SelectItem>
                  <SelectItem value="supabase">Supabase Edge Function</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {provider === 'perplexity' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Select
                  value={model}
                  onValueChange={(value) => setModel(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.1-sonar-small-128k-online">Sonar Small</SelectItem>
                    <SelectItem value="llama-3.1-sonar-large-128k-online">Sonar Large</SelectItem>
                    <SelectItem value="llama-3.1-sonar-huge-128k-online">Sonar Huge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder={provider === 'perplexity' ? 'pplx-...' : provider === 'openai' ? 'sk-...' : 'Supabase service key'}
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
