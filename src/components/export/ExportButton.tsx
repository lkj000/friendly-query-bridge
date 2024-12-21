import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ExportButton() {
  const { toast } = useToast();

  const exportData = async (format: 'pdf' | 'csv') => {
    try {
      const { data: vulnerabilities, error } = await supabase
        .from('vulnerability_scans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (format === 'csv') {
        const csvContent = generateCSV(vulnerabilities);
        downloadFile(csvContent, 'vulnerability-report.csv', 'text/csv');
      } else {
        const pdfContent = await generatePDF(vulnerabilities);
        downloadFile(pdfContent, 'vulnerability-report.pdf', 'application/pdf');
      }

      toast({
        title: 'Export Successful',
        description: `Report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const generateCSV = (data: any[]) => {
    const headers = ['Severity', 'Source', 'Description', 'Status', 'Created At'];
    const rows = data.map(item => [
      item.severity,
      item.source,
      item.description,
      item.status,
      new Date(item.created_at).toLocaleDateString()
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const generatePDF = async (data: any[]) => {
    // For now, return a simple text representation
    // In a real implementation, you would use a PDF library
    return `Vulnerability Report\n\n${JSON.stringify(data, null, 2)}`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportData('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('pdf')}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}