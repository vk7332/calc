import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 👈 This must be here for Tailwind to work!
import App from './App';;
import { AuthProvider } from './context/AuthContext'; // Import your AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* The Provider must be outside of App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);