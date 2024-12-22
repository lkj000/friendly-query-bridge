export interface MessageHandler {
  sendChatMessage: (message: string) => Promise<string>;
  fetchReport: (type: 'veracode' | 'sonar' | 'prisma') => Promise<any>;
}

export interface ChatViewProps {
  messageHandler: MessageHandler;
}

export interface ReportViewProps {
  type: 'veracode' | 'sonar' | 'prisma';
  title: string;
  messageHandler: MessageHandler;
}

export interface Message {
  content: string;
  isUser: boolean;
}