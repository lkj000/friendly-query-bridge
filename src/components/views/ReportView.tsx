import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Info } from "lucide-react";

interface ReportViewProps {
  type: 'veracode' | 'sonar' | 'prisma';
  title: string;
}

export function ReportView({ type, title }: ReportViewProps) {
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
            <p className="text-2xl font-bold">3</p>
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
            <p className="text-2xl font-bold">7</p>
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
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}