import React, { useEffect, useRef } from 'react';

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

    if (type?.startsWith('image/')) {
      return <img src={content} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />;
    }

    if (type?.startsWith('video/')) {
      return (
        <video controls className="max-w-full rounded-lg">
          <source src={content} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (type?.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={content} type={type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <a 
        href={content} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-500 hover:underline"
      >
        View uploaded file
      </a>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.is_bot 
              ? 'bg-secondary mr-auto max-w-[80%]' 
              : 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
          }`}
        >
          <div className="break-words">{message.content}</div>
          {message.media_context && (
            <div className="mt-2">
              {renderMedia(message)}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};