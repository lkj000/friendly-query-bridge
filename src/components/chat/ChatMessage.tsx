import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  mediaContext?: {
    type: string;
    content: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, mediaContext }) => {
  const renderMedia = () => {
    if (!mediaContext) return null;
    const { type, content: mediaContent } = mediaContext;

    if (type.startsWith('image/')) {
      return (
        <img 
          src={mediaContent} 
          alt="Uploaded content" 
          className="max-w-full h-auto rounded-lg"
          loading="lazy"
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <video controls className="max-w-full rounded-lg">
          <source src={mediaContent} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={mediaContent} type={type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <div className="text-sm text-muted-foreground">
        File uploaded: {type.split('/').pop()}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 rounded-lg",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {mediaContext && (
          <div className="mt-2">
            {renderMedia()}
          </div>
        )}
      </div>
    </div>
  );
};