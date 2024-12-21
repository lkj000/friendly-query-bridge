import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Bug, Lock } from "lucide-react";

export function OkoSidebar() {
  const [activeView, setActiveView] = React.useState('chat');

  return (
    <div className="flex flex-col h-screen bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">OKO Security</h2>
      </div>
      
      <nav className="flex-1 p-2 space-y-2">
        <Button
          variant={activeView === 'chat' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('chat')}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask Me
        </Button>
        
        <Button
          variant={activeView === 'veracode' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('veracode')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Veracode Report
        </Button>
        
        <Button
          variant={activeView === 'sonar' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('sonar')}
        >
          <Bug className="mr-2 h-4 w-4" />
          Sonar Report
        </Button>
        
        <Button
          variant={activeView === 'prisma' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('prisma')}
        >
          <Lock className="mr-2 h-4 w-4" />
          Prisma Report
        </Button>
      </nav>
      
      <div className="p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Connected to VPN
        </div>
      </div>
    </div>
  );
}