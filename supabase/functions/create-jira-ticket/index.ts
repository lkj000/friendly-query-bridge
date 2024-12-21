import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './jiraUtils.ts';
import { CreateTicketPayload } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const email = Deno.env.get('JIRA_EMAIL');
    const apiToken = Deno.env.get('JIRA_API_TOKEN');
    const domain = Deno.env.get('JIRA_DOMAIN');
    const projectKey = Deno.env.get('JIRA_PROJECT_KEY');

    if (!email || !apiToken || !domain || !projectKey) {
      console.error('Missing JIRA credentials:', {
        hasEmail: !!email,
        hasToken: !!apiToken,
        hasDomain: !!domain,
        hasProjectKey: !!projectKey
      });
      throw new Error('Missing required JIRA credentials');
    }

    const { summary, description, severity, source, filePath, lineNumber }: CreateTicketPayload = await req.json();

    console.log('Creating JIRA ticket with payload:', {
      summary,
      severity,
      source,
      filePath,
      lineNumber,
      projectKey
    });

    const cleanDomain = domain.replace(/[\/]+$/, '').split('/')[0];
    const jiraUrl = `https://${cleanDomain}/rest/api/3/issue`;
    console.log('JIRA API URL:', jiraUrl);

    const authToken = btoa(`${email}:${apiToken}`);
    
    const requestBody = {
      fields: {
        project: {
          key: projectKey
        },
        summary: summary,
        description: {
          version: 1,
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Severity: ${severity}`,
                  marks: [{ type: "strong" }]
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Source: ${source}`,
                  marks: [{ type: "strong" }]
                }
              ]
            }
          ]
        },
        issuetype: {
          name: "Bug"
        },
        priority: {
          name: severity === 'critical' ? 'Highest' : 
                severity === 'high' ? 'High' : 
                severity === 'medium' ? 'Medium' : 'Low'
        }
      }
    };

    if (filePath) {
      requestBody.fields.description.content.push({
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `File: ${filePath}${lineNumber ? `:${lineNumber}` : ''}`,
            marks: [{ type: "code" }]
          }
        ]
      });
    }

    console.log('Sending request to JIRA with body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Raw JIRA API response:', responseText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JIRA response:', e);
      throw new Error(`Invalid JSON response from JIRA: ${responseText}`);
    }

    if (!response.ok) {
      console.error('JIRA API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const errorMessage = responseData.errors ? 
        Object.entries(responseData.errors).map(([field, error]) => `${field}: ${error}`).join(', ') :
        responseData.errorMessages?.[0] || 
        responseData.message || 
        `JIRA API error: ${response.status} ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    console.log('JIRA ticket created successfully:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Detailed error in create-jira-ticket function:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});