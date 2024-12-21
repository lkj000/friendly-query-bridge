import React, { useRef } from 'react';
import { AudioLines, Video, FileText, FileSpreadsheet, File } from 'lucide-react';
import { MediaButton } from './buttons/MediaButton';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/services/uploadService';

interface MediaButtonsProps {
  onMediaUpload: (url: string, type: string) => void;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ onMediaUpload }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentMediaType = useRef<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadService.uploadFile(file);
      if (url) {
        onMediaUpload(url, currentMediaType.current);
        toast({
          title: "File uploaded successfully",
          description: "Your file has been uploaded and added to the chat.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediaClick = (mediaType: string) => {
    currentMediaType.current = mediaType;
    fileInputRef.current?.click();
  };

  const mediaButtons = [
    { icon: AudioLines, label: 'Audio', type: 'audio' },
    { icon: Video, label: 'Video', type: 'video' },
    { icon: FileText, label: 'Text', type: 'text' },
    { icon: FileSpreadsheet, label: 'Excel', type: 'excel' },
    { icon: File, label: 'PDF', type: 'pdf' },
  ];

  return (
    <div className="flex gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept="audio/*,video/*,text/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />

      {mediaButtons.map((button) => (
        <MediaButton
          key={button.type}
          icon={button.icon}
          label={button.label}
          onClick={() => handleMediaClick(button.type)}
        />
      ))}
    </div>
  );
};