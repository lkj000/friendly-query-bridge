export interface Conversation {
  id: string;
  created_at: string;
  title: string | null;
  user_id: string;
  last_message_at: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_context?: {
    type: string;
    content: string;
  } | null;
  is_bot?: boolean;
  conversation_id?: string;
}