import { OkoSidebar } from "@/components/sidebar/OkoSidebar";
import { ChatView } from "@/components/views/ChatView";
import { ReportView } from "@/components/views/ReportView";
import { VulnerabilityView } from "@/components/views/VulnerabilityView";
import { ApiIntegrationsView } from "@/components/views/ApiIntegrationsView";
import { DefaultMessageHandler } from "@/services/messageHandler";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function Index() {
  const [activeView, setActiveView] = useState('vulnerabilities');
  const messageHandler = DefaultMessageHandler.getInstance();
  const { user } = useAuth();

  const { data: totalIncidents } = useQuery({
    queryKey: ['totalIncidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('total_incidents')
        .select('*')
        .maybeSingle();
      
      if (error) {
        toast({
          title: "Error fetching incidents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data || { count: 0 };
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
        {activeView === 'vulnerabilities' && <VulnerabilityView />}
        {activeView === 'veracode' && (
          <ReportView type="veracode" title="Veracode Security Report" />
        )}
        {activeView === 'sonar' && (
          <ReportView type="sonar" title="Sonar Code Quality Report" />
        )}
        {activeView === 'prisma' && (
          <ReportView type="prisma" title="Prisma Cloud Security Report" />
        )}
        {activeView === 'api-integrations' && <ApiIntegrationsView />}
      </div>
    </div>
  );
}