import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getIncidentTrendsResponse(supabase: any) {
  console.log('Fetching incident trends data...');
  
  const { data: totalIncidents, error: totalError } = await supabase
    .from('total_incidents')
    .select('*')
    .maybeSingle();
  
  if (totalError) {
    console.error('Error fetching total incidents:', totalError);
    return "Sorry, I couldn't fetch the incident trends data.";
  }

  const tables = [
    'incidentstatedata_new',
    'incidentstatedata_inprogress',
    'incidentstatedata_resolved',
    'incidentstatedata_closed',
    'incidentstatedata_canceled',
    'incidentstatedata_onhold',
    'incidentstatedata_awaitingvendorresolved'
  ];

  const stateData: Record<string, number> = {};
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      continue;
    }

    const stateName = table.replace('incidentstatedata_', '');
    stateData[stateName] = data?.count || 0;
  }

  const response = [
    '📊 Current Incident Trends Summary:\n',
    `Total Incidents: ${totalIncidents?.count || 0}\n`,
    '\nIncidents by State:',
    `- New: ${stateData.new || 0}`,
    `- In Progress: ${stateData.inprogress || 0}`,
    `- Resolved: ${stateData.resolved || 0}`,
    `- Closed: ${stateData.closed || 0}`,
    `- Canceled: ${stateData.canceled || 0}`,
    `- On Hold: ${stateData.onhold || 0}`,
    `- Awaiting Vendor: ${stateData.awaitingvendorresolved || 0}`
  ].join('\n');

  return response;
}

export async function getMajorIncidentsResponse(supabase: any) {
  console.log('Fetching major incidents data...');
  
  const tables = ['accepted', 'rejected', 'canceled'];
  const majorIncidents: Record<string, number> = {};
  
  for (const status of tables) {
    const { data, error } = await supabase
      .from(`majorincidentdata_${status}`)
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching major incidents (${status}):`, error);
      continue;
    }

    majorIncidents[status] = data?.count || 0;
  }

  const total = Object.values(majorIncidents).reduce((a, b) => a + b, 0);
  
  if (total === 0) {
    return "No major incidents found in the system.";
  }
  
  const response = [
    '🚨 Major Incidents Summary:\n',
    `Total Major Incidents: ${total}\n`,
    '\nStatus Breakdown:',
    `- Accepted: ${majorIncidents.accepted || 0} (${((majorIncidents.accepted || 0) / total * 100).toFixed(1)}%)`,
    `- Rejected: ${majorIncidents.rejected || 0} (${((majorIncidents.rejected || 0) / total * 100).toFixed(1)}%)`,
    `- Canceled: ${majorIncidents.canceled || 0} (${((majorIncidents.canceled || 0) / total * 100).toFixed(1)}%)`
  ].join('\n');

  return response;
}