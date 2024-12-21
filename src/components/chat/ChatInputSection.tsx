import React from 'react';
import { ChatInput } from '@/components/chat/ChatInput';

interface ChatInputSectionProps {
  onSendMessage: (content: string, mediaContext?: { type: string; content: string }) => void;
  disabled: boolean;
}

export const ChatInputSection: React.FC<ChatInputSectionProps> = ({ onSendMessage, disabled }) => {
  return (
    <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto p-4">
        <ChatInput 
          onSendMessage={onSendMessage}
          disabled={disabled}
        />
      </div>
    </div>
  );
};