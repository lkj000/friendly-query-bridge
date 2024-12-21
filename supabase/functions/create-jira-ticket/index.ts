import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateTicketPayload {
  summary: string;
  description: string;
  severity: string;
  source: string;
  filePath?: string;
  lineNumber?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const jiraEmail = Deno.env.get('JIRA_EMAIL');
    const jiraApiToken = Deno.env.get('JIRA_API_TOKEN');
    const jiraDomain = Deno.env.get('JIRA_DOMAIN');

    if (!jiraEmail || !jiraApiToken || !jiraDomain) {
      throw new Error('Missing JIRA credentials');
    }

    const { summary, description, severity, source, filePath, lineNumber }: CreateTicketPayload = await req.json();

    console.log('Creating JIRA ticket with payload:', { summary, severity, source });

    const jiraDescription = `
*Severity:* ${severity}
*Source:* ${source}
${filePath ? `*File:* ${filePath}` : ''}
${lineNumber ? `*Line:* ${lineNumber}` : ''}

*Description:*
${description}
    `;

    // Construct the JIRA API URL properly
    const jiraUrl = `https://${jiraDomain}.atlassian.net/rest/api/3/issue`;
    
    console.log('Sending request to JIRA API:', jiraUrl);

    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${jiraEmail}:${jiraApiToken}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: 'SEC'
          },
          summary: summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: jiraDescription
                  }
                ]
              }
            ]
          },
          issuetype: {
            name: 'Bug'
          },
          priority: {
            name: severity === 'critical' ? 'Highest' : 
                  severity === 'high' ? 'High' : 
                  severity === 'medium' ? 'Medium' : 'Low'
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('JIRA API Error:', data);
      throw new Error(data.message || 'Failed to create JIRA ticket');
    }

    console.log('JIRA ticket created successfully:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating JIRA ticket:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});