import React from 'react';
import { DefaultMessageHandler } from '@/services/messageHandler';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MediaButtons } from '@/components/chat/MediaButtons';
import { useMessages } from '@/hooks/useMessages';

interface ChatViewProps {
  messageHandler: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const {
    messages,
    isProcessing,
    handleSendMessage,
    handleFileSelect,
    setMessages
  } = useMessages(messageHandler);

  const handleNewChat = () => {
    setMessages([]);
    toast({
      title: "New Chat Started",
      description: "You can now start a fresh conversation.",
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader onNewChat={handleNewChat} />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto p-4">
          <div className="space-y-4">
            <MediaButtons onFileSelect={handleFileSelect} disabled={isProcessing} />
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};