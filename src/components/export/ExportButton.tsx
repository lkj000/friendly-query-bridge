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
import jsPDF from 'jspdf';

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
    const pdf = new jsPDF();
    let yOffset = 20;

    // Add title
    pdf.setFontSize(16);
    pdf.text('Vulnerability Report', 20, yOffset);
    yOffset += 15;

    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yOffset);
    yOffset += 15;

    // Add summary
    pdf.setFontSize(12);
    pdf.text(`Total Vulnerabilities: ${data.length}`, 20, yOffset);
    yOffset += 10;

    // Add table headers
    pdf.setFontSize(10);
    const headers = ['Severity', 'Source', 'Status', 'Created'];
    const columnWidths = [30, 30, 30, 30];
    let xOffset = 20;

    headers.forEach((header, index) => {
      pdf.text(header, xOffset, yOffset);
      xOffset += columnWidths[index];
    });
    yOffset += 10;

    // Add table rows
    pdf.setFontSize(8);
    data.forEach((item) => {
      if (yOffset > 270) {
        pdf.addPage();
        yOffset = 20;
      }

      xOffset = 20;
      pdf.text(item.severity, xOffset, yOffset);
      xOffset += columnWidths[0];
      
      pdf.text(item.source, xOffset, yOffset);
      xOffset += columnWidths[1];
      
      pdf.text(item.status, xOffset, yOffset);
      xOffset += columnWidths[2];
      
      pdf.text(new Date(item.created_at).toLocaleDateString(), xOffset, yOffset);
      
      yOffset += 7;
    });

    return pdf.output('blob');
  };

  const downloadFile = (content: string | Blob, filename: string, type: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
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