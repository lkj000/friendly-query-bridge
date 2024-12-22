import { toast } from "@/hooks/use-toast";
import { getVsCodeApi } from "@/utils/vscode";
import { supabase } from "@/integrations/supabase/client";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface SecurityReport {
  highSeverity: number;
  mediumSeverity: number;
  lastUpdated: string;
  details: Array<{
    id: string;
    title: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
}

interface ChatResponse {
  reply: string;
  context?: string;
}

interface AudioUploadResponse {
  audio_context: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const vscode = getVsCodeApi();

export const api = {
  async uploadAudio(file: File): Promise<ApiResponse<AudioUploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/upload-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload audio');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      toast({
        title: "Error uploading audio",
        description: "Could not upload audio file. Please try again.",
        variant: "destructive",
      });
      return { error: 'Failed to upload audio' };
    }
  },

  async fetchSecurityReport(type: 'veracode' | 'sonar' | 'prisma'): Promise<ApiResponse<SecurityReport>> {
    try {
      const { data: vulnerabilities, error } = await supabase
        .from('vulnerability_scans')
        .select('*')
        .eq('source', type);

      if (error) throw error;

      const report: SecurityReport = {
        highSeverity: vulnerabilities.filter(v => v.severity === 'high').length,
        mediumSeverity: vulnerabilities.filter(v => v.severity === 'medium').length,
        lastUpdated: new Date().toISOString(),
        details: vulnerabilities.map(v => ({
          id: v.id,
          title: v.description,
          severity: v.severity as 'high' | 'medium' | 'low',
          description: v.description
        }))
      };

      return { data: report };
    } catch (error) {
      console.error('Error fetching security report:', error);
      toast({
        title: "Error fetching report",
        description: "Could not fetch security report. Please try again later.",
        variant: "destructive",
      });
      return { error: 'Failed to fetch report' };
    }
  },

  async sendChatMessage(
    message: string, 
    mediaContext?: { type: string; content: string }
  ): Promise<ApiResponse<ChatResponse>> {
    try {
      if (vscode) {
        vscode.postMessage({
          type: 'sendMessage',
          payload: { message, mediaContext }
        });
        return {
          data: {
            reply: "Message sent through VS Code extension",
            context: "VS Code"
          }
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, media_context: mediaContext }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Could not send message. Please check your connection.",
        variant: "destructive",
      });
      return { error: 'Failed to send message' };
    }
  },

  async checkVpnConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vpn/status`);
      return response.ok;
    } catch {
      return false;
    }
  }
};
