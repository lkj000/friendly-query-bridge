import { toast } from "@/hooks/use-toast";

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async fetchSecurityReport(type: 'veracode' | 'sonar' | 'prisma'): Promise<ApiResponse<SecurityReport>> {
    try {
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

  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
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