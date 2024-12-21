import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function DashboardView() {
  const { data: vulnerabilities, isLoading } = useQuery({
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

  const getSeverityDistribution = () => {
    if (!vulnerabilities) return [];
    
    const distribution = vulnerabilities.reduce((acc: any, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getStatusDistribution = () => {
    if (!vulnerabilities) return [];

    const distribution = vulnerabilities.reduce((acc: any, curr) => {
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
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Severity Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getSeverityDistribution()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {getSeverityDistribution().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={severityColors[entry.name as keyof typeof severityColors] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getStatusDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Recent Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900">
            <p className="text-sm text-green-600 dark:text-green-200">Total Vulnerabilities</p>
            <p className="text-2xl font-semibold">{vulnerabilities?.length || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
            <p className="text-sm text-red-600 dark:text-red-200">High Severity</p>
            <p className="text-2xl font-semibold">
              {vulnerabilities?.filter(v => v.severity === 'high').length || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900">
            <p className="text-sm text-orange-600 dark:text-orange-200">Open Issues</p>
            <p className="text-2xl font-semibold">
              {vulnerabilities?.filter(v => v.status === 'open').length || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}