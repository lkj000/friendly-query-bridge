import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SeverityPieChart } from '../dashboard/SeverityPieChart';
import { StatusBarChart } from '../dashboard/StatusBarChart';
import { StatisticsCards } from '../dashboard/StatisticsCards';

interface VulnerabilityScan {
  severity: string;
  status: string;
}

interface SeverityDistribution {
  name: string;
  value: number;
}

interface StatusDistribution {
  status: string;
  count: number;
}

export function DashboardView() {
  const { data: vulnerabilities, isLoading } = useQuery<VulnerabilityScan[]>({
    queryKey: ['vulnerabilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vulnerability_scans')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const severityColors = {
    high: '#ef4444',
    medium: '#f97316',
    low: '#22c55e',
  };

  const getSeverityDistribution = (): SeverityDistribution[] => {
    if (!vulnerabilities) return [];
    
    const distribution = vulnerabilities.reduce((acc: Record<string, number>, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getStatusDistribution = (): StatusDistribution[] => {
    if (!vulnerabilities) return [];

    const distribution = vulnerabilities.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status || 'open'] = (acc[curr.status || 'open'] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
    }));
  };

  if (isLoading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Security Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeverityPieChart 
          data={getSeverityDistribution()} 
          colors={severityColors} 
        />
        <StatusBarChart 
          data={getStatusDistribution()} 
        />
      </div>

      <StatisticsCards vulnerabilities={vulnerabilities || []} />
    </div>
  );
}