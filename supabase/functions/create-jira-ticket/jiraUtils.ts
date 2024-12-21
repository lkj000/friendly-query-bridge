import { JiraCredentials } from './types.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function validateJiraCredentials(): JiraCredentials {
  const email = Deno.env.get('JIRA_EMAIL');
  const apiToken = Deno.env.get('JIRA_API_TOKEN');
  const domain = Deno.env.get('JIRA_DOMAIN');
  const projectKey = Deno.env.get('JIRA_PROJECT_KEY');

  const missingVars = {
    email: !email,
    token: !apiToken,
    domain: !domain,
    projectKey: !projectKey
  };

  if (Object.values(missingVars).some(missing => missing)) {
    console.error('Missing JIRA credentials:', missingVars);
    throw new Error(`Missing JIRA credentials: ${JSON.stringify(missingVars)}`);
  }

  return {
    email: email!,
    apiToken: apiToken!,
    domain: domain!.replace(/[\/]+$/, '').split('/')[0],
    projectKey: projectKey!
  };
}

export function createJiraDescription(description: string, severity: string, source: string, filePath?: string, lineNumber?: number) {
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

  if (filePath) {
    jiraDescription.content.push({
      type: "paragraph",
      content: [
        { type: "text", text: "File: ", marks: [{ type: "strong" }] },
        { type: "text", text: filePath }
      ]
    });
  }

  if (lineNumber) {
    jiraDescription.content.push({
      type: "paragraph",
      content: [
        { type: "text", text: "Line: ", marks: [{ type: "strong" }] },
        { type: "text", text: lineNumber.toString() }
      ]
    });
  }

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

  return jiraDescription;
}