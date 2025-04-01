
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
  private lang: string = 'en-US';
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.configureRecognition();
      }
    }
  }

  private configureRecognition() {
    if (!this.recognition) return;
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true; // Enable interim results for faster feedback
    this.recognition.lang = this.lang;
  }

  public setLanguage(lang: string): void {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
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
    this.retryCount = 0;
    
    if (onStateChange) {
      onStateChange({
        isListening: true,
        error: null
      });
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript;
      const confidence = event.results[lastResultIndex][0].confidence;
      
      // Only process final results with reasonable confidence
      if (event.results[lastResultIndex].isFinal && confidence > 0.5) {
        console.log(`Voice recognized: "${transcript}" (confidence: ${confidence})`);
        onResult(transcript.toLowerCase().trim());
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech' && this.retryCount < this.maxRetries) {
        // Retry on no-speech error
        this.retryCount++;
        try {
          this.recognition?.stop();
          setTimeout(() => {
            if (this.isListening) {
              this.recognition?.start();
            }
          }, 300);
        } catch (e) {
          console.error('Failed to restart recognition after no-speech error', e);
        }
        return;
      }
      
      if (onStateChange) {
        onStateChange({
          isListening: false,
          error: `Error occurred during recognition: ${event.error}`
        });
      }
    };

    this.recognition.onend = () => {
      // Only set isListening to false if we're not retrying
      if (this.retryCount >= this.maxRetries) {
        this.isListening = false;
        if (onStateChange) {
          onStateChange({
            isListening: false,
            error: null
          });
        }
      } else if (this.isListening) {
        // If we're still supposed to be listening, restart
        try {
          this.recognition?.start();
        } catch (e) {
          console.error('Failed to restart recognition after end event', e);
          this.isListening = false;
          if (onStateChange) {
            onStateChange({
              isListening: false,
              error: 'Voice recognition stopped unexpectedly'
            });
          }
        }
      }
    };

    try {
      this.recognition.start();
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
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
      try {
        this.recognition.stop();
        console.log('Voice recognition stopped');
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      this.isListening = false;
    }
  }
}

// Singleton instance
export const voiceRecognition = new VoiceRecognitionService();
