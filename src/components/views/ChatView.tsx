import React from 'react';
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";

export function ChatView() {
  const [messages, setMessages] = React.useState<Array<{
    content: string;
    isUser: boolean;
    code?: string;
    languageId?: string;
  }>>([]);

  const handleSendMessage = (message: string, code?: string, languageId?: string) => {
    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      code,
      languageId
    }]);
    
    // Simulate bot response - in real implementation, this would call your bot API
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "I'm analyzing your request. Please note that I'm currently in development mode.",
        isUser: false
      }]);
    }, 1000);
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
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}