import React from 'react';
import { FileText } from 'lucide-react';
import { MediaButton } from './MediaButton';

interface DocumentButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DocumentButton: React.FC<DocumentButtonProps> = ({ onFileSelect, disabled }) => {
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
        id="file-document"
        className="hidden"
        accept=".txt,.doc,.docx,.pdf"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <MediaButton
        icon={FileText}
        label="Document"
        onClick={() => document.getElementById('file-document')?.click()}
        disabled={disabled}
      />
    </div>
  );
};