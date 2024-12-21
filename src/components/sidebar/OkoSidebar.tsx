import React from 'react';
import { OkoSidebarHeader } from './OkoSidebarHeader';
import { OkoSidebarNav } from './OkoSidebarNav';
import { OkoSidebarFooter } from './OkoSidebarFooter';

export function OkoSidebar() {
  const [activeView, setActiveView] = React.useState('chat');

  return (
    <div className="flex flex-col h-screen bg-background border-r">
      <OkoSidebarHeader />
      <OkoSidebarNav activeView={activeView} onViewChange={setActiveView} />
      <OkoSidebarFooter />
    </div>
  );
}