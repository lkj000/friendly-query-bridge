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

    // Validate environment variables
    if (!jiraEmail || !jiraApiToken || !jiraDomain) {
      console.error('Missing JIRA credentials:', {
        hasEmail: !!jiraEmail,
        hasToken: !!jiraApiToken,
        hasDomain: !!jiraDomain
      });
      throw new Error('Missing JIRA credentials');
    }

    // Clean up domain
    const cleanDomain = jiraDomain.replace(/[\/]+$/, '').split('/')[0];
    console.log('Using JIRA domain:', cleanDomain);

    const { summary, description, severity, source, filePath, lineNumber }: CreateTicketPayload = await req.json();

    console.log('Creating JIRA ticket with payload:', {
      summary,
      severity,
      source,
      filePath,
      lineNumber
    });

    const jiraDescription = `
*Severity:* ${severity}
*Source:* ${source}
${filePath ? `*File:* ${filePath}` : ''}
${lineNumber ? `*Line:* ${lineNumber}` : ''}

*Description:*
${description}
    `;

    const jiraUrl = `https://${cleanDomain}/rest/api/3/issue`;
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
                    text: jiraDescription,
                    type: 'text'
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

    const responseData = await response.json();

    if (!response.ok) {
      console.error('JIRA API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      throw new Error(responseData.message || 'Failed to create JIRA ticket');
    }

    console.log('JIRA ticket created successfully:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error in create-jira-ticket function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});