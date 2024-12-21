import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register the custom sidebar provider
  const provider = new OkoSidebarProvider(context.extensionUri);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("oko.securityView", provider)
  );

  // Register the command to open the sidebar
  let openSidebarCommand = vscode.commands.registerCommand('oko.openSidebar', () => {
    vscode.commands.executeCommand('workbench.view.extension.oko-sidebar');
  });

  context.subscriptions.push(openSidebarCommand);
}

class OkoSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'fetchReport':
          // Handle report fetching
          break;
        case 'sendMessage':
          // Handle chat messages
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Convert your React app's index.html to a string that works in the webview
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OKO Security</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // Initialize communication with the extension
            const vscode = acquireVsCodeApi();
          </script>
        </body>
      </html>
    `;
  }
}