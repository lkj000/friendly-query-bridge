export interface CreateTicketPayload {
  summary: string;
  description: string;
  severity: string;
  source: string;
  filePath?: string;
  lineNumber?: number;
}