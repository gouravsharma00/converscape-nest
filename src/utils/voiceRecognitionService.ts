
// Basic types for SpeechRecognition
interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResult;
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export interface VoiceRecognitionState {
  isListening: boolean;
  error: string | null;
}

export type VoiceRecognitionCallback = (transcript: string) => void;

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(onResult: VoiceRecognitionCallback, onStateChange?: (state: VoiceRecognitionState) => void): void {
    if (!this.recognition) {
      if (onStateChange) onStateChange({ isListening: false, error: 'Speech recognition not supported' });
      return;
    }

    if (this.isListening) this.stopListening();
    
    this.isListening = true;
    if (onStateChange) onStateChange({ isListening: true, error: null });

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript.toLowerCase());
    };

    this.recognition.onerror = (event) => {
      if (onStateChange) onStateChange({ isListening: false, error: `Error: ${event.error}` });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onStateChange) onStateChange({ isListening: false, error: null });
    };

    try {
      this.recognition.start();
    } catch (error) {
      if (onStateChange) onStateChange({ isListening: false, error: 'Failed to start recognition' });
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
