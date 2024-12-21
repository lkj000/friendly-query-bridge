import React from 'react';
import { AudioButton } from './buttons/AudioButton';
import { VideoButton } from './buttons/VideoButton';
import { DocumentButton } from './buttons/DocumentButton';
import { SpreadsheetButton } from './buttons/SpreadsheetButton';

interface MediaButtonsProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ onFileSelect, disabled }) => {
  return (
    <div className="flex gap-4">
      <AudioButton onFileSelect={onFileSelect} disabled={disabled} />
      <VideoButton onFileSelect={onFileSelect} disabled={disabled} />
      <DocumentButton onFileSelect={onFileSelect} disabled={disabled} />
      <SpreadsheetButton onFileSelect={onFileSelect} disabled={disabled} />
    </div>
  );
};