import React from 'react';
import { MediaButton } from './buttons/MediaButton';
import { AudioButton } from './buttons/AudioButton';
import { DocumentButton } from './buttons/DocumentButton';
import { SpreadsheetButton } from './buttons/SpreadsheetButton';
import { VideoButton } from './buttons/VideoButton';

interface MediaButtonsProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ onFileSelect, disabled }) => {
  return (
    <div className="flex items-center gap-4">
      <AudioButton onFileSelect={onFileSelect} disabled={disabled} />
      <VideoButton onFileSelect={onFileSelect} disabled={disabled} />
      <DocumentButton onFileSelect={onFileSelect} disabled={disabled} />
      <SpreadsheetButton onFileSelect={onFileSelect} disabled={disabled} />
    </div>
  );
};