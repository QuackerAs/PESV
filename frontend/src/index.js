import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AccessibilityProvider><App /></AccessibilityProvider>
  </React.StrictMode>
);
