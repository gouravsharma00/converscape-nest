
// Create our own types for SpeechRecognition as TypeScript doesn't have these by default
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// This service handles voice recognition functionality
export interface VoiceRecognitionState {
  isListening: boolean;
  error: string | null;
}

export type VoiceRecognitionCallback = (transcript: string) => void;

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor() {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(onResult: VoiceRecognitionCallback, onStateChange?: (state: VoiceRecognitionState) => void): void {
    if (!this.recognition) {
      if (onStateChange) {
        onStateChange({
          isListening: false,
          error: 'Speech recognition is not supported in this browser'
        });
      }
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;
    
    if (onStateChange) {
      onStateChange({
        isListening: true,
        error: null
      });
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript.toLowerCase());
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      if (onStateChange) {
        onStateChange({
          isListening: false,
          error: `Error occurred during recognition: ${event.error}`
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onStateChange) {
        onStateChange({
          isListening: false,
          error: null
        });
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      if (onStateChange) {
        onStateChange({
          isListening: false,
          error: 'Failed to start speech recognition'
        });
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

// Singleton instance
export const voiceRecognition = new VoiceRecognitionService();
