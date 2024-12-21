import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/integrations/supabase/types/conversations';

interface MessageListProps {
  messages: ConversationMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMedia = (message: ConversationMessage) => {
    if (!message.media_context) return null;
    const { type, content } = message.media_context;

    if (type.startsWith('image/')) {
      return <img src={content} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />;
    }

    if (type.startsWith('video/')) {
      return (
        <video controls className="max-w-full rounded-lg">
          <source src={content} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={content} type={type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={content}
          className="w-full h-96 rounded-lg"
          title="PDF document"
        />
      );
    }

    return (
      <Card className="p-4">
        <a 
          href={content} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          View uploaded file
        </a>
      </Card>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.is_bot ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-4 py-3 rounded-lg break-words",
                message.is_bot 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-primary text-primary-foreground"
              )}
            >
              <div className="prose dark:prose-invert">
                {message.content}
              </div>
              {message.media_context && (
                <div className="mt-2">
                  {renderMedia(message)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};