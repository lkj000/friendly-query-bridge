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
    // Simulate sending a message and receiving a response
    return `Response to: ${message}`;
  }
}
