import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PromptProvider } from "./context/PromptContext";
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <PromptProvider>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Audience for your API
          scope: 'openid profile email write:blog',
        }}
      >
        <App />
      </Auth0Provider>
    </PromptProvider>
  </React.StrictMode>
);
