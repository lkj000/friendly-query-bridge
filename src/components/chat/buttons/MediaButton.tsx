import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface MediaButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  accept?: string;
}

export const MediaButton: React.FC<MediaButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        className="flex-shrink-0"
      >
        <Icon className="h-4 w-4" />
      </Button>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};