import { toast } from "@/hooks/use-toast";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const API_BASE_URL = 'http://localhost:3001'; // Backend service URL

export const api = {
  async fetchSecurityReport(type: 'veracode' | 'sonar' | 'prisma'): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${type}`);
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

  async sendChatMessage(message: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
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
};