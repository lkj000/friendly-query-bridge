import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleVoiceInput = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Not Supported",
          description: "Voice input is not supported in your browser.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting voice input:', error);
      toast({
        title: "Error",
        description: "Failed to start voice input. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleVoiceInput}
      disabled={disabled || isRecording}
      className={isRecording ? 'bg-red-100 hover:bg-red-200' : ''}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};