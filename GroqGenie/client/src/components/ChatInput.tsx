import { useState, useRef, useCallback, useEffect } from "react";
import { PaperclipIcon, Mic, ChevronUp, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({ 
  onSubmit, 
  placeholder = "Ask me anything...",
  disabled = false
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Update input with voice transcript
  useEffect(() => {
    if (transcript) {
      setMessage(prev => prev + transcript);
    }
  }, [transcript]);

  // Sync listening state
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      toast({
        title: "Voice Input Active",
        description: "Speak now. Click the mic button again to stop.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      // Stop listening if active
      if (isListening) {
        SpeechRecognition.stopListening();
      }
      onSubmit(message);
      setMessage("");
      resetTranscript();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center bg-muted border ${disabled ? 'border-primary/20' : 'border-primary/50'} rounded-lg pl-2 pr-1 py-1 evil-border ${
          disabled ? 'opacity-75' : 'focus-within:ring-1 focus-within:ring-accent focus-within:border-accent'
        }`}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-accent hover:text-accent/80 hover:bg-primary/20 w-8 h-8"
            aria-label="Attach files"
            disabled={disabled}
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>

          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border-none focus:ring-0 bg-transparent text-foreground py-1 px-1 text-sm"
            disabled={disabled}
          />

          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`${isListening ? 'text-secondary bg-secondary/20' : 'text-accent'} hover:text-accent/80 hover:bg-primary/20 w-8 h-8 transition-all duration-200`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              onClick={toggleListening}
              disabled={disabled}
            >
              {isListening ? (
                <StopCircle className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg w-8 h-8 flex items-center justify-center hover:opacity-90 ml-1"
              disabled={disabled || !message.trim()}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <span className="text-xs text-foreground/50">
            <span className="text-glow-accent text-accent">P</span>owered by <span className="text-glow text-primary">iLL</span> <span className="text-glow-accent">AI</span> • <a href="#privacy" className="text-primary hover:text-primary/80">Privacy</a>
          </span>
        </div>
      </form>
    </div>
  );
}