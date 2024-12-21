import React from 'react';
import { MessageHandler } from '../messageHandler';

interface ReportViewProps {
  type: 'veracode' | 'sonar' | 'prisma';
  title: string;
  messageHandler: MessageHandler;
}

export const ReportView: React.FC<ReportViewProps> = ({ type, title, messageHandler }) => {
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await messageHandler.fetchReport(type);
        setReport(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch report');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [type, messageHandler]);

  if (loading) {
    return <div className="p-4">Loading report...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">High Severity Issues</h3>
              <p className="text-2xl">{report.highSeverity || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Medium Severity Issues</h3>
              <p className="text-2xl">{report.mediumSeverity || 0}</p>
            </div>
          </div>
          {report.details && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Details</h3>
              <div className="space-y-2">
                {report.details.map((detail: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{detail.title}</h4>
                    <p className="text-sm text-gray-600">{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};