import React, { useState } from 'react';
import { DefaultMessageHandler } from '@/services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from '../chat/MessageList';
import { ChatInput } from '../chat/ChatInput';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';

interface Message {
  content: string;
  isUser: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

interface ChatViewProps {
  messageHandler?: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
  messageHandler = DefaultMessageHandler.getInstance() 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { typingUsers, updateTypingStatus } = useRealtimeChat();

  const handleSendMessage = async (message: string, mediaUrl?: string, mediaType?: string) => {
    try {
      setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
      updateTypingStatus(false);
    }
  };

  const handleTyping = () => {
    updateTypingStatus(true);
    // Debounce typing status update
    setTimeout(() => updateTypingStatus(false), 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      {Object.values(typingUsers).some(user => user.isTyping) && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          Someone is typing...
        </div>
      )}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isProcessing={isProcessing}
        onTyping={handleTyping}
      />
    </div>
  );
};