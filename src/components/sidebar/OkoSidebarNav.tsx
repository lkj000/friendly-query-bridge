import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Bug, Lock, AlertTriangle } from "lucide-react";

interface OkoSidebarNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function OkoSidebarNav({ activeView, onViewChange }: OkoSidebarNavProps) {
  return (
    <nav className="flex-1 p-2 space-y-2">
      <Button
        variant={activeView === 'vulnerabilities' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('vulnerabilities')}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Vulnerabilities
      </Button>

      <Button
        variant={activeView === 'chat' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('chat')}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Ask Me
      </Button>
      
      <Button
        variant={activeView === 'veracode' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('veracode')}
      >
        <Shield className="mr-2 h-4 w-4" />
        Veracode Report
      </Button>
      
      <Button
        variant={activeView === 'sonar' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('sonar')}
      >
        <Bug className="mr-2 h-4 w-4" />
        Sonar Report
      </Button>
      
      <Button
        variant={activeView === 'prisma' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('prisma')}
      >
        <Lock className="mr-2 h-4 w-4" />
        Prisma Report
      </Button>
    </nav>
  );
}