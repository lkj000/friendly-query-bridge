import React, { useState, useEffect } from 'react';
import { MessageList } from '@/components/chat/MessageList';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatInputSection } from '@/components/chat/ChatInputSection';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { DefaultMessageHandler } from '@/services/messageHandler';

interface ChatViewProps {
  messageHandler?: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    conversations, 
    createNewConversation,
    isLoading: isLoadingConversations 
  } = useConversations();

  const {
    messages,
    sendMessage,
    isLoading: isLoadingMessages
  } = useMessages(currentConversation);

  useEffect(() => {
    if (conversations.length > 0 && !currentConversation) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, currentConversation]);

  const handleNewChat = async () => {
    const conversation = await createNewConversation();
    if (conversation) {
      setCurrentConversation(conversation.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader onNewChat={handleNewChat} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onConversationSelect={setCurrentConversation}
          isLoading={isLoadingConversations}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={messages} 
              isLoading={isLoadingMessages}
            />
          </div>
          <ChatInputSection 
            onSendMessage={sendMessage}
            disabled={isProcessing || !currentConversation}
          />
        </div>
      </div>
    </div>
  );
};