import React from 'react';
import { AudioButton } from './buttons/AudioButton';
import { VideoButton } from './buttons/VideoButton';
import { DocumentButton } from './buttons/DocumentButton';
import { SpreadsheetButton } from './buttons/SpreadsheetButton';

interface MediaButtonsProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({ onFileSelect, isUploading }) => {
  return (
    <div className="flex gap-4">
      <AudioButton onFileSelect={onFileSelect} disabled={isUploading} />
      <VideoButton onFileSelect={onFileSelect} disabled={isUploading} />
      <DocumentButton onFileSelect={onFileSelect} disabled={isUploading} />
      <SpreadsheetButton onFileSelect={onFileSelect} disabled={isUploading} />
    </div>
  );
};