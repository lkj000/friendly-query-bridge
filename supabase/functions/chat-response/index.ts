import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Process the message and generate appropriate response
    const response = await generateResponse(message.toLowerCase(), supabaseClient)
    
    return new Response(
      JSON.stringify({ reply: response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in chat-response:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function generateResponse(message: string, supabase: any): Promise<string> {
  // Handle incident trends question
  if (message.includes('incident') && message.includes('trend')) {
    console.log('Fetching incident trends data...')
    
    // Get total incidents
    const { data: totalIncidents, error: totalError } = await supabase
      .from('total_incidents')
      .select('count')
      .maybeSingle()
    
    if (totalError) {
      console.error('Error fetching total incidents:', totalError)
      return "Sorry, I couldn't fetch the incident trends data."
    }

    // Get incidents by state
    const tables = [
      'incidentstatedata_new',
      'incidentstatedata_inprogress',
      'incidentstatedata_resolved',
      'incidentstatedata_closed',
      'incidentstatedata_canceled',
      'incidentstatedata_onhold',
      'incidentstatedata_awaitingvendorresolved'
    ]

    const stateData: Record<string, number> = {}
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .order('month_year', { ascending: false })
        .limit(1)

      if (error) {
        console.error(`Error fetching ${table}:`, error)
        continue
      }

      const stateName = table.replace('incidentstatedata_', '')
      stateData[stateName] = data?.[0]?.count || 0
    }

    // Get major incidents data
    const { data: majorAccepted } = await supabase
      .from('majorincidentdata_accepted')
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)

    const { data: majorRejected } = await supabase
      .from('majorincidentdata_rejected')
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)

    // Format the response
    const response = [
      `📊 Current Incident Trends Summary:\n`,
      `Total Incidents: ${totalIncidents?.count || 0}\n`,
      `\nIncidents by State:`,
      `- New: ${stateData.new || 0}`,
      `- In Progress: ${stateData.inprogress || 0}`,
      `- Resolved: ${stateData.resolved || 0}`,
      `- Closed: ${stateData.closed || 0}`,
      `- Canceled: ${stateData.canceled || 0}`,
      `- On Hold: ${stateData.onhold || 0}`,
      `- Awaiting Vendor: ${stateData.awaitingvendorresolved || 0}\n`,
      `\nMajor Incidents:`,
      `- Accepted: ${majorAccepted?.[0]?.count || 0}`,
      `- Rejected: ${majorRejected?.[0]?.count || 0}`
    ].join('\n')

    return response
  }

  // Default response for unhandled questions
  return "I can help you with information about:\n- Security vulnerabilities\n- Incident trends\n- API integration status\n- Major incidents\n\nPlease ask about any of these topics!"
}