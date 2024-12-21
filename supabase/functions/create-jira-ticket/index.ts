import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";

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

    const jiraDescription = `
*Severity:* ${severity}
*Source:* ${source}
${filePath ? `*File:* ${filePath}` : ''}
${lineNumber ? `*Line:* ${lineNumber}` : ''}

*Description:*
${description}
    `;

    const response = await fetch(`https://${jiraDomain}.atlassian.net/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${jiraEmail}:${jiraApiToken}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: 'SEC'  // Assuming 'SEC' is your security project key
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
            name: 'Bug'  // Or whatever issue type you want to use
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

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating JIRA ticket:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});