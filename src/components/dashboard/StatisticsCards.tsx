import React from 'react';
import { Card } from "@/components/ui/card";

interface VulnerabilityScan {
  severity: string;
  status: string;
}

interface Props {
  vulnerabilities: VulnerabilityScan[];
}

export function StatisticsCards({ vulnerabilities }: Props) {
  return (
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
  );
}