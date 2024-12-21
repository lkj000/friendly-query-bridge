import React from 'react';
import { MediaButton } from './buttons/MediaButton';
import { AudioLines, Video, FileText, FileSpreadsheet, File } from 'lucide-react';

interface MediaButtonsProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ onFileSelect, isUploading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const mediaButtons = [
    { icon: AudioLines, label: 'Audio', accept: 'audio/*' },
    { icon: Video, label: 'Video', accept: 'video/*' },
    { icon: FileText, label: 'Text', accept: '.txt,.doc,.docx' },
    { icon: FileSpreadsheet, label: 'Excel', accept: '.xls,.xlsx,.csv' },
    { icon: File, label: 'PDF', accept: '.pdf' },
  ];

  return (
    <div className="flex gap-4">
      {mediaButtons.map((button) => (
        <div key={button.label} className="relative">
          <input
            type="file"
            id={`file-${button.label}`}
            className="hidden"
            accept={button.accept}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <MediaButton
            icon={button.icon}
            label={button.label}
            onClick={() => document.getElementById(`file-${button.label}`)?.click()}
            disabled={isUploading}
          />
        </div>
      ))}
    </div>
  );
};