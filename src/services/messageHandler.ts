import { api } from './api';

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
      const response = await api.sendChatMessage(message, mediaContext);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data?.reply || 'No response received';
    } catch (error) {
      console.error('Error in sendChatMessage:', error);
      throw error;
    }
  }
}