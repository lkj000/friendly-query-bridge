import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationList } from '@/components/chat/ConversationList';

interface ChatSidebarProps {
  conversations: any[];
  currentConversation: string | null;
  onConversationSelect: (id: string) => void;
  isLoading: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversation,
  onConversationSelect,
  isLoading
}) => {
  return (
    <ScrollArea className="w-64 border-r p-4">
      <ConversationList
        conversations={conversations}
        currentConversation={currentConversation}
        onConversationSelect={onConversationSelect}
        isLoading={isLoading}
      />
    </ScrollArea>
  );
};