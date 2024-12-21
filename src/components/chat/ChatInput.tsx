import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MediaButtons } from './MediaButtons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex gap-4 items-end">
      <MediaButtons />
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Type your message..."
        />
        <Button
          onClick={handleSend}
          className="px-4 py-2"
          disabled={!inputValue.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};