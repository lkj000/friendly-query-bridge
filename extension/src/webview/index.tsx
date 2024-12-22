import React from 'react';
import { createRoot } from 'react-dom/client';
import WebviewApp from './WebviewApp';

console.log('Initializing webview app');

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <WebviewApp />
    </React.StrictMode>
  );
  
  console.log('Webview app initialized successfully');
} catch (error) {
  console.error('Failed to initialize webview app:', error);
}