export interface WebviewMessage {
  type: 'fetchReport' | 'sendMessage';
  payload: any;
}

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

  public sendMessage(message: WebviewMessage) {
    this.vscode.postMessage(message);
  }

  public async fetchReport(type: 'veracode' | 'sonar' | 'prisma') {
    this.sendMessage({
      type: 'fetchReport',
      payload: { type }
    });
  }

  public async sendChatMessage(message: string) {
    this.sendMessage({
      type: 'sendMessage',
      payload: { message }
    });
  }
}