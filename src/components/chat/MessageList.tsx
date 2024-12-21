import React from 'react';

interface Message {
  content: string;
  isUser: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const renderMedia = (message: Message) => {
    if (!message.mediaUrl) return null;

    if (message.mediaType?.startsWith('image/')) {
      return <img src={message.mediaUrl} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />;
    }

    if (message.mediaType?.startsWith('video/')) {
      return (
        <video controls className="max-w-full rounded-lg">
          <source src={message.mediaUrl} type={message.mediaType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (message.mediaType?.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={message.mediaUrl} type={message.mediaType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    // For other file types (PDF, text, etc.), show a download link
    return (
      <a 
        href={message.mediaUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-500 hover:underline"
      >
        View uploaded file
      </a>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'
          } max-w-[80%]`}
        >
          <div className="break-words">{message.content}</div>
          {message.mediaUrl && (
            <div className="mt-2">
              {renderMedia(message)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};