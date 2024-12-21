import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MediaButtons } from './MediaButtons';
import { MessageInput } from './MessageInput';
import { uploadService } from '@/services/uploadService';
import { Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, mediaUrl?: string, mediaType?: string) => void;
  isProcessing?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
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
        <MediaButtons onFileSelect={handleFileUpload} disabled={isUploading || isProcessing} />
        <div className="flex items-center gap-4">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isUploading || isProcessing}
            placeholder={isProcessing ? "Processing message..." : "Type your message..."}
          />
          {(isProcessing || isUploading) && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
        {mediaContext && (
          <div className="text-sm text-muted-foreground">
            File ready to send: {mediaContext.type}
          </div>
        )}
      </div>
    </div>
  );
};