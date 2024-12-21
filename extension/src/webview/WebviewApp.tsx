import React from 'react';
import { ChatView } from './components/ChatView';
import { ReportView } from './components/ReportView';
import { MessageHandler } from './messageHandler';

const WebviewApp: React.FC = () => {
  const [activeView, setActiveView] = React.useState<string>('chat');
  const messageHandler = MessageHandler.getInstance();

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        {activeView === 'chat' && <ChatView messageHandler={messageHandler} />}
        {activeView === 'veracode' && (
          <ReportView type="veracode" title="Veracode Security Report" messageHandler={messageHandler} />
        )}
        {activeView === 'sonar' && (
          <ReportView type="sonar" title="Sonar Code Quality Report" messageHandler={messageHandler} />
        )}
        {activeView === 'prisma' && (
          <ReportView type="prisma" title="Prisma Cloud Security Report" messageHandler={messageHandler} />
        )}
      </div>
    </div>
  );
};

export default WebviewApp;