import React, { useState } from 'react';
import { DefaultMessageHandler } from '../../services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from '../chat/MessageList';
import { ChatInput } from '../chat/ChatInput';

interface ChatViewProps {
  messageHandler?: DefaultMessageHandler;
}

interface Message {
  content: string;
  isUser: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
  messageHandler = DefaultMessageHandler.getInstance() 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleSendMessage = async (message: string, mediaUrl?: string, mediaType?: string) => {
    try {
      const newMessage: Message = {
        content: message,
        isUser: true,
        mediaUrl,
        mediaType,
      };
      setMessages(prev => [...prev, newMessage]);

      const mediaContext = mediaUrl ? { type: mediaType || '', content: mediaUrl } : undefined;
      const response = await messageHandler.sendChatMessage(message, mediaContext);
      
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
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};