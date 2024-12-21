import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, validateJiraCredentials, createJiraDescription } from './jiraUtils.ts';
import { CreateTicketPayload } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const credentials = validateJiraCredentials();
    const { summary, description, severity, source, filePath, lineNumber }: CreateTicketPayload = await req.json();

    console.log('Creating JIRA ticket with payload:', {
      summary,
      severity,
      source,
      filePath,
      lineNumber
    });

    const jiraUrl = `https://${credentials.domain}/rest/api/3/issue`;
    console.log('JIRA API URL:', jiraUrl);

    const authToken = btoa(`${credentials.email}:${credentials.apiToken}`);
    console.log('Auth token generated successfully');

    const requestBody = {
      fields: {
        project: {
          key: credentials.projectKey
        },
        summary: summary,
        description: createJiraDescription(description, severity, source, filePath, lineNumber),
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