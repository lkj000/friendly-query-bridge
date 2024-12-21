import React, { useState } from 'react';
import { MessageHandler } from '../../services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from '../chat/MessageList';
import { ChatInput } from '../chat/ChatInput';

interface ChatViewProps {
  messageHandler?: MessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler = MessageHandler.getInstance() }) => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    try {
      const newMessage = { content: message, isUser: true };
      setMessages(prev => [...prev, newMessage]);

      const response = await messageHandler.sendChatMessage(message);
      if (response) {
        setMessages(prev => [...prev, { content: response, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};