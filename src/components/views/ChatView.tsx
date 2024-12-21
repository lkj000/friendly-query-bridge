import React, { useState } from 'react';
import { MessageHandler } from '../../services/messageHandler';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';

interface ChatViewProps {
  messageHandler?: MessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler = MessageHandler.getInstance() }) => {
  const [messages, setMessages] = useState<Array<{
    content: string;
    isUser: boolean;
    code?: string;
    languageId?: string;
    mediaContext?: {
      type: string;
      content: string;
    };
  }>>([]);

  const handleSendMessage = async (
    message: string,
    code?: string,
    languageId?: string,
    mediaContext?: { type: string; content: string }
  ) => {
    const newMessage = {
      content: message,
      isUser: true,
      code,
      languageId,
      mediaContext,
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await messageHandler.sendChatMessage(message);
      if (response) {
        setMessages((prev) => [
          ...prev,
          { content: response, isUser: false },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
            code={message.code}
            languageId={message.languageId}
            mediaContext={message.mediaContext}
          />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};