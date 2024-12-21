import React, { useState, useEffect } from 'react';
import { DefaultMessageHandler } from '@/services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Conversation } from '@/integrations/supabase/types/conversations';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatViewProps {
  messageHandler: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();
      const channel = subscribeToMessages();
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
      if (data && data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "Could not load conversations. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error fetching messages",
        description: "Could not load messages. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.conversation_id === currentConversation) {
            setMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return channel;
  };

  const handleNewChat = async () => {
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

      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation.id);
      setMessages([]);
      
      toast({
        title: "New Chat Started",
        description: "You can now start a fresh conversation.",
      });
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Could not create new conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (message: string, mediaContext?: { type: string; content: string }) => {
    if (!message.trim() && !mediaContext) return;
    if (!currentConversation) {
      await handleNewChat();
    }

    setIsProcessing(true);
    try {
      const { data: userMessage, error: insertError } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user?.id,
          media_context: mediaContext || null,
          is_bot: false,
          conversation_id: currentConversation
        })
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      const response = await messageHandler.sendChatMessage(message);
      
      const { data: botMessage, error: botError } = await supabase
        .from('messages')
        .insert({
          content: response,
          user_id: user?.id,
          is_bot: true,
          conversation_id: currentConversation
        })
        .select()
        .maybeSingle();

      if (botError) throw botError;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentConversation);

    } catch (error) {
      console.error('Error in chat interaction:', error);
      toast({
        title: "Error sending message",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={currentConversation === conv.id ? 'default' : 'ghost'}
              className="w-full justify-start mb-2"
              onClick={() => setCurrentConversation(conv.id)}
            >
              {conv.title || 'Untitled Chat'}
            </Button>
          ))}
        </ScrollArea>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} />
          </div>
          <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-3xl mx-auto p-4">
              <ChatInput 
                onSendMessage={handleSendMessage}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};