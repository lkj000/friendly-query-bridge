import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  isBot: boolean;
  mediaContext?: {
    type: string;
    content: string;
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isBot, mediaContext }) => {
  const renderMedia = () => {
    if (!mediaContext) return null;
    const { type, content: mediaContent } = mediaContext;

    if (type.startsWith('image/')) {
      return (
        <div className="mt-2">
          <img src={mediaContent} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />
        </div>
      );
    }

    if (type.startsWith('video/')) {
      return (
        <div className="mt-2">
          <video controls className="max-w-full rounded-lg">
            <source src={mediaContent} type={type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={mediaContent} type={type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (type === 'application/pdf') {
      return (
        <div className="mt-2">
          <iframe
            src={mediaContent}
            className="w-full h-96 rounded-lg"
            title="PDF document"
          />
        </div>
      );
    }

    return (
      <div className="mt-2">
        <Card className="p-4">
          <a 
            href={mediaContent} 
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
    <div className={cn("flex", isBot ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 rounded-lg break-words",
          isBot 
            ? "bg-secondary text-secondary-foreground" 
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="prose dark:prose-invert">
          {content}
        </div>
        {mediaContext && renderMedia()}
      </div>
    </div>
  );
};