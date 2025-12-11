import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './components/AuthProvider'

// Add CSS variables to root element
const rootElement = document.documentElement;
rootElement.style.setProperty('--primary-dark', '#0a0e27');
rootElement.style.setProperty('--secondary-dark', '#1a1f3a');
rootElement.style.setProperty('--accent-emerald', '#10b981');
rootElement.style.setProperty('--accent-teal', '#06b6d4');
rootElement.style.setProperty('--accent-purple', '#8b5cf6');
rootElement.style.setProperty('--text-primary', '#f8fafc');
rootElement.style.setProperty('--text-secondary', '#94a3b8');
rootElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.05)');
rootElement.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.1)');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)