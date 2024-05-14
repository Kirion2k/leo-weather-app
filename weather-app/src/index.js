import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // This line should be present


const root = document.getElementById('root');
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);