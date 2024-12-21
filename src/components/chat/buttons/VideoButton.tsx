import React from 'react';
import { Video } from 'lucide-react';
import { MediaButton } from './MediaButton';

interface VideoButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const VideoButton: React.FC<VideoButtonProps> = ({ onFileSelect, disabled }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="file-video"
        className="hidden"
        accept="video/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <MediaButton
        icon={Video}
        label="Video"
        onClick={() => document.getElementById('file-video')?.click()}
        disabled={disabled}
      />
    </div>
  );
};