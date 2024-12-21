import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  mediaContext?: {
    type: string;
    content: string;
  };
}

export function ChatMessage({ content, isUser, mediaContext }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

    if (type === 'application/pdf') {
      return (
        <div className="flex flex-col gap-2">
          <iframe
            src={mediaContent}
            className="w-full h-96 rounded-lg"
            title="PDF document"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(mediaContent, '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      );
    }

    // For text files, CSV, Excel, Word docs
    if (type.startsWith('text/') || 
        type.includes('spreadsheet') || 
        type.includes('word')) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            File uploaded: {type.split('/').pop()}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(mediaContent, '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      );
    }

    return null;
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
}