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

    // Validate environment variables with detailed logging
    if (!jiraEmail || !jiraApiToken || !jiraDomain) {
      const missingVars = {
        email: !jiraEmail,
        token: !jiraApiToken,
        domain: !jiraDomain
      };
      console.error('Missing JIRA credentials:', missingVars);
      throw new Error(`Missing JIRA credentials: ${JSON.stringify(missingVars)}`);
    }

    // Clean up domain and log it
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

    // Format description in JIRA's Atlassian Document Format
    const jiraDescription = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Security Vulnerability Details" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Severity: ", marks: [{ type: "strong" }] },
            { type: "text", text: severity }
          ]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Source: ", marks: [{ type: "strong" }] },
            { type: "text", text: source }
          ]
        }
      ]
    };

    // Add file path if provided
    if (filePath) {
      jiraDescription.content.push({
        type: "paragraph",
        content: [
          { type: "text", text: "File: ", marks: [{ type: "strong" }] },
          { type: "text", text: filePath }
        ]
      });
    }

    // Add line number if provided
    if (lineNumber) {
      jiraDescription.content.push({
        type: "paragraph",
        content: [
          { type: "text", text: "Line: ", marks: [{ type: "strong" }] },
          { type: "text", text: lineNumber.toString() }
        ]
      });
    }

    // Add description
    jiraDescription.content.push(
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Description" }]
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: description }]
      }
    );

    const jiraUrl = `https://${cleanDomain}/rest/api/3/issue`;
    console.log('JIRA API URL:', jiraUrl);

    const authToken = btoa(`${jiraEmail}:${jiraApiToken}`);
    console.log('Auth token generated successfully');

    const requestBody = {
      fields: {
        project: {
          key: "SEC"
        },
        summary: summary,
        description: jiraDescription,
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