export type ApiIntegration = {
  id: string;
  created_at: string;
  name: string;
  url: string;
  type: string;
  is_active: boolean;
  headers: Record<string, any>;
}

export type Tables = {
  api_integrations: {
    Row: ApiIntegration;
    Insert: Omit<ApiIntegration, 'id' | 'created_at'>;
    Update: Partial<ApiIntegration>;
  };
}