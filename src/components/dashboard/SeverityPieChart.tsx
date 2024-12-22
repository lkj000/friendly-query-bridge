import React from 'react';
import { Card } from "@/components/ui/card";
import * as RechartsPrimitive from "recharts";
import { ChartContainer } from "@/components/ui/chart";

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
        <ChartContainer config={{}} className="w-full">
          <RechartsPrimitive.PieChart>
            <RechartsPrimitive.Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <RechartsPrimitive.Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.name] || '#94a3b8'}
                />
              ))}
            </RechartsPrimitive.Pie>
            <RechartsPrimitive.Tooltip />
          </RechartsPrimitive.PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
}