import React from 'react';

interface Message {
  content: string;
  isUser: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-2 rounded-lg ${
            message.isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};