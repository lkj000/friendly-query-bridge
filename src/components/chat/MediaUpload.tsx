import React, { useState } from 'react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, FileText, FileSpreadsheet, Mic, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Process file through backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process file');

      const { media_context } = await response.json();

      onMediaContext({ 
        type: file.type, 
        content: media_context || publicUrl 
      });

      toast({
        title: "File uploaded successfully",
        description: "Your file has been processed and is ready to use.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Failed to upload file. Please try again.",
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
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:8000/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process audio');

      const { media_context } = await response.json();
      onMediaContext({ 
        type: 'audio/wav', 
        content: media_context 
      });

      toast({
        title: "Audio recorded successfully",
        description: "Your recording has been processed and is ready to use.",
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error processing audio",
        description: "Failed to process audio. Please try again.",
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

      <AudioRecorder onAudioRecorded={handleAudioRecorded} isProcessing={isUploading} />
    </div>
  );
}