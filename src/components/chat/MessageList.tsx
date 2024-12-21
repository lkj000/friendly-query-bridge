import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  content: string;
  is_bot: boolean;
  media_context?: {
    type: string;
    content: string;
  };
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            content={message.content}
            isBot={message.is_bot}
            mediaContext={message.media_context}
          />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};