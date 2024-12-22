import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}