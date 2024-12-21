import React, { useState, useEffect } from 'react';
import { DefaultMessageHandler } from '@/services/messageHandler';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MediaUpload } from '@/components/MediaUpload';

interface ChatViewProps {
  messageHandler: DefaultMessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [mediaContext, setMediaContext] = useState<{ type: string; content: string } | null>(null);

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

  const handleNewChat = () => {
    setMessages([]);
    setMediaContext(null);
    toast({
      title: "New Chat Started",
      description: "You can now start a fresh conversation.",
    });
  };

  const handleMediaUpload = (context: { type: string; content: string }) => {
    setMediaContext(context);
    toast({
      title: "Media uploaded",
      description: "Your file has been uploaded and is ready to send.",
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() && !mediaContext) return;

    setIsProcessing(true);
    try {
      const { data: userMessage, error: insertError } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user?.id,
          media_context: mediaContext,
          is_bot: false
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
          is_bot: true
        })
        .select()
        .maybeSingle();

      if (botError) throw botError;

      if (userMessage && botMessage) {
        setMessages(prev => [...prev, userMessage, botMessage]);
      }

      // Clear media context after sending
      setMediaContext(null);
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
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto p-4">
          <div className="space-y-4">
            <MediaUpload onMediaContext={handleMediaUpload} />
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