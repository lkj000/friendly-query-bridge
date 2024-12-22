import React from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SeverityDistribution {
  name: string;
  value: number;
}

interface SeverityPieChartProps {
  data: SeverityDistribution[];
  colors: Record<string, string>;
}

export const SeverityPieChart: React.FC<SeverityPieChartProps> = ({ data, colors }) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
        <ChartContainer
          className="w-full h-full"
          config={{
            severity: {
              theme: {
                light: "#8884d8",
                dark: "#8884d8"
              }
            }
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore - Known issue with Recharts types */}
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={colors[entry.name.toLowerCase()] || '#8884d8'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};