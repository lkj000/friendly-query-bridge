import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('OKO extension is now active');
  
  const provider = new OkoSidebarProvider(context.extensionUri);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("oko.securityView", provider)
  );

  const openSidebarCommand = vscode.commands.registerCommand('oko.openSidebar', () => {
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
    console.log('Resolving webview view');
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'index.js');
    const scriptUri = webviewView.webview.asWebviewUri(scriptPathOnDisk);
    
    const stylePathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'style.css');
    const styleUri = webviewView.webview.asWebviewUri(stylePathOnDisk);

    const nonce = getNonce();

    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webviewView.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src ${webviewView.webview.cspSource} https:; connect-src ${webviewView.webview.cspSource} https:;">
          <link href="${styleUri}" rel="stylesheet">
          <title>OKO Security</title>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            window.vscode = vscode;
          </script>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;

    webviewView.webview.onDidReceiveMessage(async (data) => {
      console.log('Received message:', data);
      
      switch (data.type) {
        case 'fetchReport':
          console.log('Fetching report:', data.payload);
          break;
        case 'sendMessage':
          console.log('Sending message:', data.payload);
          break;
      }
    });
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}