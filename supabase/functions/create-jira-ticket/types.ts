export interface CreateTicketPayload {
  summary: string;
  description: string;
  severity: string;
  source: string;
  filePath?: string;
  lineNumber?: number;
}

export interface JiraCredentials {
  email: string;
  apiToken: string;
  domain: string;
  projectKey: string;
}