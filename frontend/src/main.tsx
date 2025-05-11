import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PromptProvider } from "./context/PromptContext";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <PromptProvider>
      <App />
    </PromptProvider>
  </React.StrictMode>
);
