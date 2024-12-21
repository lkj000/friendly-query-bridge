import React from 'react';
import { ChatView } from './components/ChatView';
import { ReportView } from './components/ReportView';
import { VulnerabilityView } from '@/components/views/VulnerabilityView';
import { DashboardView } from '@/components/views/DashboardView';
import { ApiIntegrationsView } from '@/components/views/ApiIntegrationsView';
import { OkoSidebarNav } from '@/components/sidebar/OkoSidebarNav';
import { MessageHandler } from './messageHandler';

const WebviewApp: React.FC = () => {
  const [activeView, setActiveView] = React.useState<string>('chat');
  const messageHandler = MessageHandler.getInstance();

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r">
        <OkoSidebarNav activeView={activeView} onViewChange={setActiveView} />
      </div>
      <div className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'chat' && <ChatView messageHandler={messageHandler} />}
        {activeView === 'vulnerabilities' && <VulnerabilityView />}
        {activeView === 'veracode' && (
          <ReportView type="veracode" title="Veracode Security Report" messageHandler={messageHandler} />
        )}
        {activeView === 'sonar' && (
          <ReportView type="sonar" title="Sonar Code Quality Report" messageHandler={messageHandler} />
        )}
        {activeView === 'prisma' && (
          <ReportView type="prisma" title="Prisma Cloud Security Report" messageHandler={messageHandler} />
        )}
        {activeView === 'api-integrations' && <ApiIntegrationsView />}
      </div>
    </div>
  );
};

export default WebviewApp;