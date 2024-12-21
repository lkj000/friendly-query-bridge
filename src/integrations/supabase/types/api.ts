export type ApiIntegration = {
  id: string;
  created_at: string;
  name: string;
  url: string;
  type: string;
  is_active: boolean;
  headers: Record<string, any>;
}