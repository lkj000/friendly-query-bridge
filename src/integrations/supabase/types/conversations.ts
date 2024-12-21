export type Conversation = {
  id: string;
  created_at: string;
  title: string | null;
  user_id: string;
  last_message_at: string;
}

export type ConversationMessage = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  media_context: any | null;
  is_bot: boolean | null;
  conversation_id: string | null;
}