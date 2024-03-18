import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import './output.css';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);