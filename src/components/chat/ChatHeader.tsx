import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-semibold text-primary">AskMe</h2>
      <Button
        onClick={onNewChat}
        variant="outline"
        className="gap-2 hover:bg-secondary"
      >
        <PlusCircle className="h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};