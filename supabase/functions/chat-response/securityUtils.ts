import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function getSecurityResponse(supabase: any) {
  console.log('Fetching vulnerability data...');
  
  const { data: vulns, error } = await supabase
    .from('vulnerability_scans')
    .select('*')
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching vulnerabilities:', error);
    return "Sorry, I couldn't fetch the vulnerability data.";
  }

  const severityCounts = vulns.reduce((acc: any, curr: any) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  const response = [
    '🛡️ Security Vulnerabilities Summary:\n',
    `Total Vulnerabilities: ${vulns.length}\n`,
    '\nBreakdown by Severity:',
    `- Critical: ${severityCounts.critical || 0}`,
    `- High: ${severityCounts.high || 0}`,
    `- Medium: ${severityCounts.medium || 0}`,
    `- Low: ${severityCounts.low || 0}\n`,
    '\nRecent Critical/High Issues:',
    ...vulns
      .filter((v: any) => ['critical', 'high'].includes(v.severity))
      .slice(0, 3)
      .map((v: any) => `- ${v.severity.toUpperCase()}: ${v.description}`)
  ].join('\n');

  return response;
}