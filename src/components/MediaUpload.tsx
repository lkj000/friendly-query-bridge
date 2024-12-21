import React, { useState } from 'react';
import { Upload, Image, Video, FileText, FileSpreadsheet, FileText as TextIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder } from './AudioRecorder';

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

      const response = await fetch('http://localhost:8000/api/upload-media', {
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
        title: "Error processing media",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recorded_audio.wav');

      const response = await fetch('http://localhost:8000/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onMediaContext({ type: 'audio/wav', content: data.media_context });
      
      toast({
        title: "Audio processed successfully",
        description: "Your recording has been processed and added to the context.",
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error processing audio",
        description: "Failed to process recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="media-upload"
        accept="image/*,audio/*,video/*,application/pdf,text/plain,text/csv"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <label htmlFor="media-upload" className="cursor-pointer">
        <Button
          variant="outline"
          size="icon"
          disabled={isUploading}
          className="relative"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </label>
      <AudioRecorder 
        onAudioRecorded={handleAudioRecorded}
        isProcessing={isUploading}
      />
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          document.getElementById('media-upload')?.click();
        }}
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          document.getElementById('media-upload')?.click();
        }}
      >
        <Video className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          document.getElementById('media-upload')?.click();
        }}
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          document.getElementById('media-upload')?.click();
        }}
      >
        <TextIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          document.getElementById('media-upload')?.click();
        }}
      >
        <FileSpreadsheet className="h-4 w-4" />
      </Button>
    </div>
  );
}