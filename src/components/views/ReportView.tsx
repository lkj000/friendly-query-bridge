import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { api } from '@/services/api';

interface ReportViewProps {
  type: 'veracode' | 'sonar' | 'prisma';
  title: string;
}

export function ReportView({ type, title }: ReportViewProps) {
  const { data: report, isLoading } = useQuery({
    queryKey: ['report', type],
    queryFn: () => api.fetchSecurityReport(type),
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <Shield className="mr-2" />
              High Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report?.data?.highSeverity || 0}</p>
            <p className="text-sm text-muted-foreground">Issues found</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-500">
              <AlertTriangle className="mr-2" />
              Medium Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report?.data?.mediumSeverity || 0}</p>
            <p className="text-sm text-muted-foreground">Issues found</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2" />
              Latest Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last updated: {report?.data?.lastUpdated || new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}