export interface ExportOptions {
  format: 'pdf' | 'csv';
  filters?: {
    severity?: string;
    status?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export interface ExportResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
}