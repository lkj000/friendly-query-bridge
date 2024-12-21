import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from '@/integrations/supabase/types/conversations';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
      const channel = subscribeToConversations();
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "Could not load conversations. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user?.id,
          title: 'New Conversation'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "New Chat Started",
        description: "You can now start a fresh conversation.",
      });

      return conversation;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Could not create new conversation. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const subscribeToConversations = () => {
    return supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConversations(prev => [payload.new as Conversation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === payload.new.id ? { ...conv, ...payload.new } : conv
              )
            );
          }
        }
      )
      .subscribe();
  };

  return {
    conversations,
    createNewConversation,
    isLoading
  };
}