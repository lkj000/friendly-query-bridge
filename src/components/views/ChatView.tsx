import React, { useState, useEffect } from 'react';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ConversationList } from '@/components/chat/ConversationList';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';

export const ChatView: React.FC = () => {
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
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-primary">AskMe</h2>
        <Button
          onClick={handleNewChat}
          variant="outline"
          className="gap-2 hover:bg-secondary"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ScrollArea className="w-64 border-r p-4">
          <ConversationList
            conversations={conversations}
            currentConversation={currentConversation}
            onConversationSelect={setCurrentConversation}
            isLoading={isLoadingConversations}
          />
        </ScrollArea>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={messages} 
              isLoading={isLoadingMessages}
            />
          </div>
          <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-3xl mx-auto p-4">
              <ChatInput 
                onSendMessage={sendMessage}
                disabled={isProcessing || !currentConversation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};