import { ApiIntegration } from './api';
import { Conversation, ConversationMessage } from './conversations';

export type Tables = {
  api_integrations: {
    Row: ApiIntegration;
    Insert: Omit<ApiIntegration, 'id' | 'created_at'>;
    Update: Partial<ApiIntegration>;
  };
  conversations: {
    Row: Conversation;
    Insert: Omit<Conversation, 'id' | 'created_at' | 'last_message_at'>;
    Update: Partial<Conversation>;
  };
  messages: {
    Row: ConversationMessage;
    Insert: Omit<ConversationMessage, 'id' | 'created_at'>;
    Update: Partial<ConversationMessage>;
  };
}