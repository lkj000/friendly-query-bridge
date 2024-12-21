import React, { useState } from 'react';
import { MediaUpload } from './MediaUpload';
import { VoiceInput } from './VoiceInput';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, mediaContext?: { type: string; content: string }) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [mediaContext, setMediaContext] = useState<{ type: string; content: string } | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || mediaContext) {
      onSendMessage(message, mediaContext);
      setMessage("");
      setMediaContext(undefined);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + transcript);
  };

  return (
    <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <MediaUpload onMediaContext={setMediaContext} />
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={disabled ? "Processing..." : "Type your message..."}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={disabled}
          />
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            disabled={disabled}
          />
          <Button type="submit" disabled={disabled || (!message.trim() && !mediaContext)}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {mediaContext && (
          <div className="text-sm text-muted-foreground">
            File ready to send: {mediaContext.type}
          </div>
        )}
      </div>
    </div>
  );
};