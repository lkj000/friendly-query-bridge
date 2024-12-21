import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ConversationMessage } from '@/integrations/supabase/types/conversations';

interface MessageListProps {
  messages: ConversationMessage[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-secondary rounded-lg w-3/4" />
            <div className="h-10 bg-secondary rounded-lg w-1/2" />
            <div className="h-10 bg-secondary rounded-lg w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={!message.is_bot}
            mediaContext={message.media_context}
          />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};