import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handling for WebSocket and other unhandled errors
window.addEventListener('unhandledrejection', (event) => {
  // Suppress WebSocket DOMException errors in console
  if (event.reason?.name === 'DOMException' && event.reason?.message?.includes('WebSocket')) {
    console.warn('WebSocket connection issue handled silently');
    event.preventDefault();
  }
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  // Suppress WebSocket-related errors
  if (event.error?.name === 'DOMException' && event.message?.includes('WebSocket')) {
    console.warn('WebSocket error handled silently');
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
