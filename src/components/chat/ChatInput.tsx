import React, { useState } from 'react';
import { MediaButtons } from './MediaButtons';
import { MessageInput } from './MessageInput';

interface ChatInputProps {
  onSendMessage: (message: string, mediaUrl?: string, mediaType?: string) => void;
  isProcessing?: boolean;
  onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isProcessing,
  onTyping 
}) => {
  const [message, setMessage] = useState("");
  const [mediaContext, setMediaContext] = useState<{ url: string; type: string } | null>(null);

  const handleSubmit = () => {
    if (message.trim() || mediaContext) {
      onSendMessage(message, mediaContext?.url, mediaContext?.type);
      setMessage("");
      setMediaContext(null);
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    onTyping?.();
  };

  return (
    <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <MediaButtons onFileSelect={() => {}} disabled={isProcessing} />
        <div className="flex items-center gap-4">
          <MessageInput
            value={message}
            onChange={handleMessageChange}
            onSend={handleSubmit}
            disabled={isProcessing}
            placeholder={isProcessing ? "Processing message..." : "Type your message..."}
          />
        </div>
        {mediaContext && (
          <div className="text-sm text-muted-foreground">
            File ready to send: {mediaContext.type}
          </div>
        )}
      </div>
    </div>
  );
};