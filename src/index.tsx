import React from 'react';
import ReactDOM from 'react-dom/client';
import { getCreatedApp } from './firebase';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
getCreatedApp();
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);