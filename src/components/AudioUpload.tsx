import React, { useState } from 'react';
import { Upload, Mic, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadProps {
  onAudioContext: (context: string) => void;
}

export function AudioUpload({ onAudioContext }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await api.uploadAudio(file);
      if (response.data?.audio_context) {
        onAudioContext(response.data.audio_context);
        toast({
          title: "Audio processed successfully",
          description: "Your audio has been analyzed and added to the context.",
        });
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Error processing audio",
        description: "Failed to process audio file. Please try again.",
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
        id="audio-upload"
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <label
        htmlFor="audio-upload"
        className="cursor-pointer"
      >
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
      <Button
        variant="outline"
        size="icon"
        disabled={isUploading}
        onClick={() => {
          // TODO: Implement live audio recording
          toast({
            title: "Coming soon",
            description: "Live audio recording will be available in a future update.",
          });
        }}
      >
        <Mic className="h-4 w-4" />
      </Button>
    </div>
  );
}