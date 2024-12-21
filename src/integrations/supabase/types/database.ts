export type ApiIntegration = {
  id: string;
  created_at: string;
  name: string;
  url: string;
  type: string;
  is_active: boolean;
  headers: Record<string, any>;
}

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