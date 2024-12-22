import React from 'react';
import { Mic } from 'lucide-react';
import { MediaButton } from './MediaButton';

interface AudioButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ onFileSelect, disabled }) => {
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
        id="file-audio"
        className="hidden"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <MediaButton
        icon={Mic}
        label="Audio"
        onClick={() => document.getElementById('file-audio')?.click()}
        disabled={disabled}
      />
    </div>
  );
};