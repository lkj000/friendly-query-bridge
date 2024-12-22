import React from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import * as RechartsPrimitive from 'recharts';

interface StatusDistribution {
  status: string;
  count: number;
}

interface Props {
  data: StatusDistribution[];
}

export function StatusBarChart({ data }: Props) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
      <div className="h-[300px]">
        <ChartContainer
          config={{}}
          className="w-full h-full"
        >
          <RechartsPrimitive.ResponsiveContainer>
            <RechartsPrimitive.BarChart data={data}>
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
              <RechartsPrimitive.XAxis dataKey="status" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Tooltip />
              <RechartsPrimitive.Bar dataKey="count" fill="#3b82f6" />
            </RechartsPrimitive.BarChart>
          </RechartsPrimitive.ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
}