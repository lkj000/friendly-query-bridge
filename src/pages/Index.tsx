import { OkoSidebar } from "@/components/sidebar/OkoSidebar";
import { ChatView } from "@/components/views/ChatView";
import { ReportView } from "@/components/views/ReportView";
import { MessageHandler } from "@/services/messageHandler";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function Index() {
  const [activeView, setActiveView] = useState('chat');
  const messageHandler = MessageHandler.getInstance();
  const { user } = useAuth();

  // Example of secure data fetching with authentication
  const { data: totalIncidents } = useQuery({
    queryKey: ['totalIncidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('total_incidents')
        .select('*')
        .single();
      
      if (error) {
        toast({
          title: "Error fetching incidents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

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