import React, { useState } from 'react';
import { MessageHandler } from '../messageHandler';

interface ChatViewProps {
  messageHandler: MessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = { content: inputValue, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    try {
      const response = await messageHandler.sendChatMessage(inputValue);
      if (response) {
        setMessages(prev => [...prev, { content: response, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};