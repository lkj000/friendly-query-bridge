import React, { useState, useEffect } from 'react';
import { DefaultMessageHandler } from '@/services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

interface ChatViewProps {
  messageHandler: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      const channel = subscribeToMessages();
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
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
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return channel;
  };

  const handleSendMessage = async (message: string, mediaUrl?: string, mediaType?: string) => {
    if (!message.trim() && !mediaUrl) return;

    setIsProcessing(true);
    try {
      // First, insert the user's message
      const { data: userMessage, error: insertError } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user?.id,
          media_context: mediaUrl ? { type: mediaType, content: mediaUrl } : null,
          is_bot: false
        })
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      // Then get the bot's response
      const response = await messageHandler.sendChatMessage(message);
      
      // Insert the bot's response
      const { data: botMessage, error: botError } = await supabase
        .from('messages')
        .insert({
          content: response,
          user_id: user?.id,
          is_bot: true
        })
        .select()
        .maybeSingle();

      if (botError) throw botError;

      // Update messages state with both new messages
      if (userMessage && botMessage) {
        setMessages(prev => [...prev, userMessage, botMessage]);
      }
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
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};