import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityResponse } from './securityUtils.ts'
import { getIncidentTrendsResponse, getMajorIncidentsResponse } from './incidentUtils.ts'
import { getApiIntegrationResponse } from './apiUtils.ts'

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
  // Handle security vulnerabilities question
  if (message.includes('security') || message.includes('vulnerabilit')) {
    return await getSecurityResponse(supabase);
  }

  // Handle incident trends question
  if (message.includes('incident') && message.includes('trend')) {
    return await getIncidentTrendsResponse(supabase);
  }

  // Handle API integration status
  if (message.includes('api') || message.includes('integration')) {
    return await getApiIntegrationResponse(supabase);
  }

  // Handle major incidents question
  if (message.includes('major') && message.includes('incident')) {
    return await getMajorIncidentsResponse(supabase);
  }

  // Default response for unhandled questions
  return "I can help you with information about:\n- Security vulnerabilities\n- Incident trends\n- API integration status\n- Major incidents\n\nPlease ask about any of these topics!"
}