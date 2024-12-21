import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface ChatPresence {
  user: string;
  isTyping: boolean;
  lastTyped?: string;
}

export const useRealtimeChat = () => {
  const [typingUsers, setTypingUsers] = useState<Record<string, ChatPresence>>({});
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase.channel('chat_room')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<ChatPresence>();
        console.log('Presence state updated:', state);
        setTypingUsers(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat room');
        } else if (status === 'CLOSED') {
          toast({
            title: "Chat connection closed",
            description: "Lost connection to chat room",
            variant: "destructive",
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const updateTypingStatus = async (isTyping: boolean) => {
    try {
      const channel = supabase.channel('chat_room');
      await channel.track({
        user: 'current_user',
        isTyping,
        lastTyped: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return {
    typingUsers,
    updateTypingStatus,
  };
};