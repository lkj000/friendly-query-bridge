import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getApiIntegrationResponse(supabase: any) {
  console.log('Fetching API integration status...');
  
  const { data: integrations, error } = await supabase
    .from('api_integrations')
    .select('*');
  
  if (error) {
    console.error('Error fetching API integrations:', error);
    return "Sorry, I couldn't fetch the API integration status.";
  }

  if (!integrations || integrations.length === 0) {
    return "No API integrations found in the system.";
  }

  const activeCount = integrations.filter((i: any) => i.is_active).length;
  
  const response = [
    '🔌 API Integration Status:\n',
    `Total Integrations: ${integrations.length}`,
    `Active Integrations: ${activeCount}`,
    `Inactive Integrations: ${integrations.length - activeCount}\n`,
    '\nIntegration Details:',
    ...integrations.map((i: any) => 
      `- ${i.name}: ${i.is_active ? '✅ Active' : '❌ Inactive'} (${i.type})`
    )
  ].join('\n');

  return response;
}