
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Mic, MicOff, RefreshCw } from "lucide-react";
import { voiceRecognition, VoiceRecognitionState } from "@/utils/voiceRecognitionService";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  isLoading = false
}) => {
  const [message, setMessage] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceRecognitionState>({
    isListening: false,
    error: null
  });
  const [voiceText, setVoiceText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceRecognition = () => {
    if (voiceState.isListening) {
      voiceRecognition.stopListening();
      setVoiceText("");
    } else {
      if (!voiceRecognition.isSupported()) {
        toast({
          title: "Voice Recognition Error",
          description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
          variant: "destructive"
        });
        return;
      }

      voiceRecognition.startListening(
        (transcript) => {
          setVoiceText(transcript);
          setMessage(transcript);
          
          // Only auto-submit if we have a clear command or question
          if (transcript.trim().length > 3 && 
              (transcript.includes("?") || 
               transcript.includes("what") || 
               transcript.includes("how") || 
               transcript.includes("when") || 
               transcript.includes("open") || 
               transcript.includes("search") || 
               transcript.includes("google") || 
               transcript.includes("youtube"))) {
            
            onSendMessage(transcript);
            setMessage("");
            setVoiceText("");
            
            // Auto-stop listening after processing a command
            setTimeout(() => {
              voiceRecognition.stopListening();
            }, 300);
          }
        },
        (state) => {
          setVoiceState(state);
          if (state.error) {
            toast({
              title: "Voice Recognition Error",
              description: state.error,
              variant: "destructive"
            });
            setVoiceText("");
          }
        }
      );
    }
  };

  // Clean up voice recognition on component unmount
  useEffect(() => {
    return () => {
      if (voiceState.isListening) {
        voiceRecognition.stopListening();
      }
    };
  }, [voiceState.isListening]);

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex flex-col">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={voiceState.isListening 
              ? voiceText || "Listening... speak now" 
              : "Ask NOVA something..."}
            className={`resize-none pr-24 max-h-40 min-h-[80px] ${voiceState.isListening ? 'border-purple-500' : ''}`}
            disabled={isLoading || voiceState.isListening}
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button 
              type="button" 
              size="icon" 
              variant={voiceState.isListening ? "default" : "ghost"}
              className={`h-8 w-8 rounded-full ${voiceState.isListening ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
              onClick={toggleVoiceRecognition}
              disabled={isLoading}
            >
              {voiceState.isListening ? (
                <MicOff className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={(!message.trim() && !voiceState.isListening) || isLoading}
              className="h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          NOVA AI - Voice commands: "open YouTube", "Google [search term]", "Wikipedia [topic]", "bye babu" to end
        </div>
      </div>
    </form>
  );
};
