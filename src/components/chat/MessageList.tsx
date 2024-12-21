import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

  const renderMedia = (message: Message) => {
    if (!message.media_context) return null;
    const { type, content } = message.media_context;

    if (type.startsWith('image/')) {
      return (
        <div className="mt-2">
          <img src={content} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />
        </div>
      );
    }

    if (type.startsWith('video/')) {
      return (
        <div className="mt-2">
          <video controls className="max-w-full rounded-lg">
            <source src={content} type={type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={content} type={type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (type === 'application/pdf') {
      return (
        <div className="mt-2">
          <iframe
            src={content}
            className="w-full h-96 rounded-lg"
            title="PDF document"
          />
        </div>
      );
    }

    // For other file types, show a download link
    return (
      <div className="mt-2">
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
      </div>
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
              {message.media_context && renderMedia(message)}
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};