import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SUPABASE_URL = "https://nbyzigrsbbbmzwswqxcz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieXppZ3JzYmJibXp3c3dxeGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2ODYxOTcsImV4cCI6MjA0OTI2MjE5N30.CD2eF6TujW_I4XA8IhW_QaGWibgGTYxHba-XTY3cv60";

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
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Call Edge Function for chat response
      const { data, error: functionError } = await supabase.functions
        .invoke('chat-response', {
          body: { message }
        });

      if (functionError) throw functionError;

      const reply = data?.reply || "I'm sorry, I couldn't process your message.";
      return reply;

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