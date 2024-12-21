import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { MediaButton } from './MediaButton';

interface SpreadsheetButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const SpreadsheetButton: React.FC<SpreadsheetButtonProps> = ({ onFileSelect, disabled }) => {
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
        id="file-spreadsheet"
        className="hidden"
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <MediaButton
        icon={FileSpreadsheet}
        label="Spreadsheet"
        onClick={() => document.getElementById('file-spreadsheet')?.click()}
        disabled={disabled}
      />
    </div>
  );
};