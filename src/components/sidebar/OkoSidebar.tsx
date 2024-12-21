import React from 'react';
import { OkoSidebarHeader } from './OkoSidebarHeader';
import { OkoSidebarNav } from './OkoSidebarNav';
import { OkoSidebarFooter } from './OkoSidebarFooter';

interface OkoSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function OkoSidebar({ activeView, onViewChange }: OkoSidebarProps) {
  return (
    <div className="flex flex-col h-screen bg-background border-r">
      <OkoSidebarHeader />
      <OkoSidebarNav activeView={activeView} onViewChange={onViewChange} />
      <OkoSidebarFooter />
    </div>
  );
}