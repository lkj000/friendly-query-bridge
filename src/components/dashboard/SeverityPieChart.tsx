import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart as RechartsChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SeverityDistribution {
  name: string;
  value: number;
}

interface Props {
  data: SeverityDistribution[];
  colors: Record<string, string>;
}

export function SeverityPieChart({ data, colors }: Props) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Severity Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart width={400} height={400}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.name] || '#94a3b8'}
                />
              ))}
            </Pie>
            <Tooltip />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}