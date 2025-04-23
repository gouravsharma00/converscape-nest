
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Mic, RefreshCw } from "lucide-react";
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
    } else {
      if (!voiceRecognition.isSupported()) {
        toast({
          title: "Voice Recognition Error",
          description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Listening...",
        description: "Go ahead and speak. I'm listening!",
        duration: 2000,
      });

      voiceRecognition.startListening(
        (transcript) => {
          setMessage(transcript);
          // Auto-submit if we have a valid transcript
          if (transcript.trim()) {
            onSendMessage(transcript);
            setMessage("");
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
            placeholder={voiceState.isListening ? "Listening..." : "Ask BuddyAI something..."}
            className="resize-none pr-24 max-h-40 min-h-[80px]"
            disabled={isLoading || voiceState.isListening}
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button 
              type="button" 
              size="icon" 
              variant={voiceState.isListening ? "default" : "ghost"}
              className={`h-8 w-8 rounded-full ${voiceState.isListening ? 'bg-purple-500 hover:bg-purple-600 animate-pulse' : ''}`}
              onClick={toggleVoiceRecognition}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
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
          BuddyAI - Your voice-enabled assistant. Try speaking to me or type your questions.
        </div>
      </div>
    </form>
  );
};
