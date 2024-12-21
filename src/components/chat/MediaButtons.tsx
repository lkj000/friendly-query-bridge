import React from 'react';
import { AudioLines, Video, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const MediaButtons = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} feature`,
      description: `${feature} feature coming soon!`,
    });
  };

  return (
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
    </div>
  );
};