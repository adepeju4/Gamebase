import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./global.css";
import "stream-chat-react/dist/css/v2/index.css";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster richColors position="top-right" />
  </React.StrictMode>
); 