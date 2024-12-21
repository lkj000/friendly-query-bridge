export interface WebviewMessage {
  type: 'fetchReport' | 'sendMessage';
  payload: any;
}

const API_URL = 'http://localhost:8000';

export class MessageHandler {
  private static instance: MessageHandler;
  private vscode: any;

  private constructor() {
    // @ts-ignore
    this.vscode = acquireVsCodeApi();
  }

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  private async fetchFromBackend(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async fetchReport(type: 'veracode' | 'sonar' | 'prisma') {
    try {
      const response = await this.fetchFromBackend(`/api/reports/${type}`);
      this.vscode.postMessage({
        type: 'fetchReport',
        payload: { type, data: response }
      });
      return response;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  public async sendChatMessage(message: string) {
    try {
      const response = await this.fetchFromBackend('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      this.vscode.postMessage({
        type: 'sendMessage',
        payload: { message, response }
      });
      return response.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}