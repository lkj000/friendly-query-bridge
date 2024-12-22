import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/config/api';

interface Message {
  content: string;
  is_bot: boolean;
  media_context?: {
    type: string;
    content: string;
  };
}

export const useMessages = (messageHandler: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaContext, setMediaContext] = useState<{ type: string; content: string } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleFileSelect = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload-media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setMediaContext({ type: file.type, content: data.media_context });
      
      toast({
        title: "File uploaded successfully",
        description: "Your file has been processed and is ready to send.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    isProcessing,
    mediaContext,
    handleSendMessage,
    handleFileSelect,
    setMessages
  };
};
