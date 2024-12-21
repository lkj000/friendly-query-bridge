import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Conversation } from '@/integrations/supabase/types/conversations';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversation: string | null;
  onConversationSelect: (id: string) => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  currentConversation,
  onConversationSelect,
  isLoading
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Button
          key={conv.id}
          variant={currentConversation === conv.id ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onConversationSelect(conv.id)}
        >
          {conv.title || 'Untitled Chat'}
        </Button>
      ))}
    </div>
  );
}