import React from 'react';
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <ChartContainer config={{}}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </RechartsBarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}