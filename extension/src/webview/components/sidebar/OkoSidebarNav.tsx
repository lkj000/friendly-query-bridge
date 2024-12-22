import React from 'react';
import { Button } from '../ui/button';

interface OkoSidebarNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const OkoSidebarNav: React.FC<OkoSidebarNavProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="flex flex-col p-4 space-y-2">
      <Button
        variant={activeView === 'dashboard' ? 'default' : 'outline'}
        onClick={() => onViewChange('dashboard')}
      >
        Dashboard
      </Button>
      <Button
        variant={activeView === 'vulnerabilities' ? 'default' : 'outline'}
        onClick={() => onViewChange('vulnerabilities')}
      >
        Vulnerabilities
      </Button>
      <Button
        variant={activeView === 'chat' ? 'default' : 'outline'}
        onClick={() => onViewChange('chat')}
      >
        Chat
      </Button>
      <Button
        variant={activeView === 'api-integrations' ? 'default' : 'outline'}
        onClick={() => onViewChange('api-integrations')}
      >
        API Integrations
      </Button>
    </nav>
  );
};