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
  // Handle security vulnerabilities question
  if (message.includes('security') && message.includes('vulnerabilities')) {
    const { data: vulns } = await supabase
      .from('vulnerability_scans')
      .select('severity, description')
      .order('created_at', { ascending: false })
      .limit(5)

    if (vulns && vulns.length > 0) {
      return `Here are the latest security findings:\n${vulns
        .map((v: any) => `- ${v.severity.toUpperCase()}: ${v.description}`)
        .join('\n')}`
    }
    return "No recent security vulnerabilities found."
  }

  // Handle incident trends question
  if (message.includes('incident') && message.includes('trends')) {
    const { data: incidents } = await supabase
      .from('total_incidents')
      .select('count')
      .single()

    const { data: majorIncidents } = await supabase
      .from('majorincidentdata_accepted')
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)

    return `Current incident statistics:\n- Total incidents: ${incidents?.count || 0}\n- Recent major incidents: ${majorIncidents?.[0]?.count || 0}`
  }

  // Handle API integrations status
  if (message.includes('api') && message.includes('integration')) {
    const { data: apis } = await supabase
      .from('api_integrations')
      .select('name, type, is_active')

    if (apis && apis.length > 0) {
      return `API Integration Status:\n${apis
        .map((api: any) => `- ${api.name} (${api.type}): ${api.is_active ? 'Active' : 'Inactive'}`)
        .join('\n')}`
    }
    return "No API integrations found."
  }

  // Handle major incidents question
  if (message.includes('major') && message.includes('incident')) {
    const { data: accepted } = await supabase
      .from('majorincidentdata_accepted')
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)

    const { data: rejected } = await supabase
      .from('majorincidentdata_rejected')
      .select('count')
      .order('month_year', { ascending: false })
      .limit(1)

    return `Major Incidents Status:\n- Accepted: ${accepted?.[0]?.count || 0}\n- Rejected: ${rejected?.[0]?.count || 0}`
  }

  // Default response for unhandled questions
  return "I can help you with information about:\n- Security vulnerabilities\n- Incident trends\n- API integration status\n- Major incidents\n\nPlease ask about any of these topics!"
}