import React from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

interface StatusDistribution {
  status: string;
  count: number;
}

interface StatusBarChartProps {
  data: StatusDistribution[];
}

export const StatusBarChart: React.FC<StatusBarChartProps> = ({ data }) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <ChartContainer
          className="w-full h-full"
          config={{
            status: {
              theme: {
                light: "#3b82f6",
                dark: "#3b82f6"
              }
            }
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore - Known issue with Recharts types */}
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};