import React, { useState } from 'react';
import { Upload, Image, Video, FileText, FileSpreadsheet, Mic, File } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/config/api';

interface MediaUploadProps {
  onMediaContext: (context: { type: string; content: string }) => void;
}

export function MediaUpload({ onMediaContext }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload-media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onMediaContext({ type: file.type, content: data.media_context });
      
      toast({
        title: "Media uploaded successfully",
        description: "Your file has been processed and added to the context.",
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Error uploading file",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="media-upload"
        accept="image/*,audio/*,video/*,application/pdf,text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <Mic className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">Audio</span>
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <Image className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">Image</span>
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <Video className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">Video</span>
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <FileText className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">Text</span>
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <File className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">PDF</span>
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button variant="outline" size="icon" disabled={isUploading}>
            <FileSpreadsheet className="h-4 w-4" />
          </Button>
        </label>
        <span className="text-xs mt-1">Excel/CSV</span>
      </div>
    </div>
  );
}