import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MediaButtons } from './MediaButtons';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/services/uploadService';

interface ChatInputProps {
  onSendMessage: (message: string, mediaUrl?: string, mediaType?: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [mediaContext, setMediaContext] = useState<{ url: string; type: string } | null>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (!inputValue.trim() && !mediaContext) return;
    onSendMessage(inputValue, mediaContext?.url, mediaContext?.type);
    setInputValue('');
    setMediaContext(null);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadService.uploadFile(file);
      if (url) {
        setMediaContext({ url, type: file.type });
        toast({
          title: "File uploaded successfully",
          description: "Your file is ready to be sent.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <MediaButtons onFileSelect={handleFileUpload} isUploading={isUploading} />
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Type your message..."
            disabled={isUploading}
          />
          <Button
            onClick={handleSend}
            className="px-4 py-2"
            disabled={(!inputValue.trim() && !mediaContext) || isUploading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {mediaContext && (
          <div className="text-sm text-muted-foreground">
            File ready to send: {mediaContext.type} file
          </div>
        )}
      </div>
    </div>
  );
};