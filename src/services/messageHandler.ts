export interface WebviewMessage {
  type: 'fetchReport' | 'sendMessage';
  payload: any;
}

const API_URL = 'http://localhost:8000';

export class MessageHandler {
  private static instance: MessageHandler;

  private constructor() {}

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  public async sendChatMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}