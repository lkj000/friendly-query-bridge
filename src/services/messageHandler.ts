import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MessageHandler {
  sendChatMessage: (message: string, mediaContext?: { type: string; content: string }) => Promise<string>;
}

export class DefaultMessageHandler implements MessageHandler {
  private static instance: DefaultMessageHandler;

  private constructor() {}

  static getInstance(): DefaultMessageHandler {
    if (!DefaultMessageHandler.instance) {
      DefaultMessageHandler.instance = new DefaultMessageHandler();
    }
    return DefaultMessageHandler.instance;
  }

  async sendChatMessage(message: string, mediaContext?: { type: string; content: string }): Promise<string> {
    try {
      // Insert user message
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: userData.user.id,
          media_context: mediaContext,
          is_bot: false
        });

      if (insertError) throw insertError;

      // Simulate bot response
      const botResponse = `I received your message: "${message}"`;
      
      // Insert bot response
      const { error: botError } = await supabase
        .from('messages')
        .insert({
          content: botResponse,
          user_id: userData.user.id,
          is_bot: true
        });

      if (botError) throw botError;

      return botResponse;
    } catch (error) {
      console.error('Error in sendChatMessage:', error);
      toast({
        title: "Error sending message",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
}