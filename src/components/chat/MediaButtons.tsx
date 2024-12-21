import React, { useRef } from 'react';
import { AudioLines, Video, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/services/uploadService';

interface MediaButtonsProps {
  onMediaUpload: (url: string, type: string) => void;
}

export const MediaButtons = ({ onMediaUpload }: MediaButtonsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentMediaType = useRef<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadService.uploadFile(file);
    if (url) {
      onMediaUpload(url, currentMediaType.current);
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and added to the chat.",
      });
    }
  };

  const handleMediaClick = (mediaType: string) => {
    currentMediaType.current = mediaType;
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept="audio/*,video/*,text/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />

      <div className="flex flex-col items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleMediaClick('audio')}
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
          onClick={() => handleMediaClick('video')}
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
          onClick={() => handleMediaClick('text')}
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
          onClick={() => handleMediaClick('excel')}
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
          onClick={() => handleMediaClick('pdf')}
          className="flex-shrink-0"
        >
          <File className="h-4 w-4" />
        </Button>
        <span className="text-xs mt-1">PDF</span>
      </div>
    </div>
  );
};