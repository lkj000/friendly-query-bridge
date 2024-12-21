import { OkoSidebar } from "@/components/sidebar/OkoSidebar";
import { ChatView } from "@/components/views/ChatView";
import { ReportView } from "@/components/views/ReportView";
import { MessageHandler } from "@/services/messageHandler";
import { useState } from "react";

export default function Index() {
  const [activeView, setActiveView] = useState('chat');
  const messageHandler = MessageHandler.getInstance();

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <OkoSidebar />
      </div>
      
      <div className="flex-1">
        {activeView === 'chat' && <ChatView messageHandler={messageHandler} />}
        {activeView === 'veracode' && (
          <ReportView type="veracode" title="Veracode Security Report" />
        )}
        {activeView === 'sonar' && (
          <ReportView type="sonar" title="Sonar Code Quality Report" />
        )}
        {activeView === 'prisma' && (
          <ReportView type="prisma" title="Prisma Cloud Security Report" />
        )}
      </div>
    </div>
  );
}