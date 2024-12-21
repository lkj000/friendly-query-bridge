import React, { useState } from 'react';
import { MessageHandler } from '../messageHandler';
import { AudioLines, Video, FileText, FileSpreadsheet, File, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat/ChatHeader';

interface ChatViewProps {
  messageHandler: MessageHandler;
}

export const ChatView: React.FC<ChatViewProps> = ({ messageHandler }) => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
  };

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
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceInput = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Not Supported",
          description: "Voice input is not supported in your browser.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + ' ' + transcript.trim());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting voice input:', error);
      toast({
        title: "Error",
        description: "Failed to start voice input. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.media_context) {
        const newMessage = {
          content: `Uploaded ${file.name}`,
          isUser: true,
          mediaContext: {
            type: file.type,
            content: data.media_context
          }
        };
        setMessages(prev => [...prev, newMessage]);
      }

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader onNewChat={handleNewChat} />
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
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
      <div className="flex gap-4 items-end p-4">
        <div className="flex gap-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept="audio/*,video/*,image/*,application/pdf,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="icon"
                disabled={isProcessing}
                className="flex-shrink-0"
              >
                <AudioLines className="h-4 w-4" />
              </Button>
            </label>
            <span className="text-xs mt-1">Audio</span>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="icon"
                disabled={isProcessing}
                className="flex-shrink-0"
              >
                <Video className="h-4 w-4" />
              </Button>
            </label>
            <span className="text-xs mt-1">Video</span>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="icon"
                disabled={isProcessing}
                className="flex-shrink-0"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </label>
            <span className="text-xs mt-1">Text</span>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="icon"
                disabled={isProcessing}
                className="flex-shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </label>
            <span className="text-xs mt-1">Excel</span>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="icon"
                disabled={isProcessing}
                className="flex-shrink-0"
              >
                <File className="h-4 w-4" />
              </Button>
            </label>
            <span className="text-xs mt-1">PDF</span>
          </div>

        </div>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Type your message..."
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            disabled={isRecording}
            className={isRecording ? 'bg-red-100 hover:bg-red-200' : ''}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            className="px-4 py-2"
            disabled={!inputValue.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
