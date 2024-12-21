import { toast } from "@/hooks/use-toast";
import { getVsCodeApi } from "@/utils/vscode";

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
      if (vscode) {
        vscode.postMessage({
          type: 'fetchReport',
          payload: { type }
        });
        return {
          data: {
            highSeverity: 0,
            mediumSeverity: 0,
            lastUpdated: new Date().toISOString(),
            details: []
          }
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/reports/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      toast({
        title: "Error fetching report",
        description: "Could not fetch security report. Please check your VPN connection.",
        variant: "destructive",
      });
      return { error: 'Failed to fetch report' };
    }
  },

  async sendChatMessage(message: string, audioContext?: string): Promise<ApiResponse<ChatResponse>> {
    try {
      if (vscode) {
        vscode.postMessage({
          type: 'sendMessage',
          payload: { message, audioContext }
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
        body: JSON.stringify({ message, audio_context: audioContext }),
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
      if (vscode) {
        return true;
      }
      const response = await fetch(`${API_BASE_URL}/api/vpn/status`);
      return response.ok;
    } catch {
      return false;
    }
  }
};
