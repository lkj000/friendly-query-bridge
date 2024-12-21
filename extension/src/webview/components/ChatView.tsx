import React, { useState } from 'react';
import { MessageHandler } from '../messageHandler';
import { AudioLines, Video, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatViewProps {
  messageHandler: MessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

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

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} feature`,
      description: `${feature} feature coming soon!`,
    });
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
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFeatureClick('Audio')}
            className="flex-shrink-0"
          >
            <AudioLines className="h-4 w-4" />
          </Button>
          <span className="text-xs mt-1">Audio</span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFeatureClick('Video')}
            className="flex-shrink-0"
          >
            <Video className="h-4 w-4" />
          </Button>
          <span className="text-xs mt-1">Video</span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFeatureClick('Text')}
            className="flex-shrink-0"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <span className="text-xs mt-1">Text</span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFeatureClick('Excel')}
            className="flex-shrink-0"
          >
            <FileSpreadsheet className="h-4 w-4" />
          </Button>
          <span className="text-xs mt-1">Excel</span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFeatureClick('PDF')}
            className="flex-shrink-0"
          >
            <File className="h-4 w-4" />
          </Button>
          <span className="text-xs mt-1">PDF</span>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            placeholder="Type your message..."
          />
        </div>
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