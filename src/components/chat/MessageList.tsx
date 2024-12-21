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

export const MessageList = ({ messages }: MessageListProps) => {
  const renderMedia = (message: Message) => {
    if (!message.mediaUrl) return null;

    switch (message.mediaType) {
      case 'image':
        return <img src={message.mediaUrl} alt="Uploaded content" className="max-w-full h-auto rounded-lg" />;
      case 'video':
        return (
          <video controls className="max-w-full rounded-lg">
            <source src={message.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="w-full">
            <source src={message.mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View uploaded file</a>;
    }
  };

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
          {renderMedia(message)}
        </div>
      ))}
    </div>
  );
};