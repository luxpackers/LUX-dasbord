import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { AppProvider } from './context/AppContext'; // ✅ Import the context provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider> {/* ✅ Wrap your App inside the provider */}
      <App />
    </AppProvider>
  </React.StrictMode>
);
