import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tailwind CSS is loaded via index.html CDN script for simplicity in this hybrid setup

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);