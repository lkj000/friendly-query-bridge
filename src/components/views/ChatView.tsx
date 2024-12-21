import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { api } from '@/services/api';

export function ChatView() {
  const [messages, setMessages] = React.useState<Array<{
    content: string;
    isUser: boolean;
    code?: string;
    languageId?: string;
  }>>([]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, audioContext }: { message: string, audioContext?: string }) => {
      return api.sendChatMessage(message, audioContext);
    },
    onSuccess: (response) => {
      if (response.data) {
        setMessages(prev => [...prev, {
          content: response.data.reply,
          isUser: false,
        }]);
      }
    },
  });

  const handleSendMessage = (message: string, code?: string, languageId?: string, audioContext?: string) => {
    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      code,
      languageId
    }]);
    
    sendMessageMutation.mutate({ message, audioContext });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
            code={message.code}
            languageId={message.languageId}
          />
        ))}
      </div>
      <ChatInput 
        onSend={handleSendMessage} 
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}