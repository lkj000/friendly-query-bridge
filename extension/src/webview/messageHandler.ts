import { MessageHandler } from './types';

export class DefaultMessageHandler implements MessageHandler {
  private static instance: DefaultMessageHandler;
  private vscode: any;

  private constructor() {
    // @ts-ignore
    this.vscode = acquireVsCodeApi();
  }

  public static getInstance(): DefaultMessageHandler {
    if (!DefaultMessageHandler.instance) {
      DefaultMessageHandler.instance = new DefaultMessageHandler();
    }
    return DefaultMessageHandler.instance;
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

  public async sendChatMessage(message: string): Promise<string> {
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

const API_URL = 'http://localhost:8000';