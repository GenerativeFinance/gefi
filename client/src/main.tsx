import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Global error handling for WebSocket and other unhandled errors
window.addEventListener('unhandledrejection', (event) => {
  // Suppress WebSocket DOMException errors in console
  if (event.reason?.name === 'DOMException' && event.reason?.message?.includes('WebSocket')) {
    console.warn('WebSocket connection issue handled silently');
    event.preventDefault();
  }
  
  // Suppress Vite WebSocket connection promise rejections
  if (event.reason?.name === 'SyntaxError' && event.reason?.message?.includes('string did not match the expected pattern')) {
    console.warn('Vite WebSocket connection promise rejection handled silently');
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
  
  // Suppress Vite WebSocket connection errors (malformed URL patterns)
  if (event.error?.name === 'SyntaxError' && event.error?.message?.includes('string did not match the expected pattern')) {
    console.warn('Vite WebSocket connection error handled silently');
    event.preventDefault();
  }
  
  // Suppress source map loading errors (502 Bad Gateway) - these are harmless development warnings
  if (event.message?.includes('Failed to load resource') && event.message?.includes('.map')) {
    event.preventDefault();
    return;
  }
});

// Override console.error to suppress development warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  // Suppress development warnings and errors
  const message = args.join(' ');
  if (message.includes('Failed to load resource') && message.includes('.map') && message.includes('502')) {
    return; // Silently ignore source map errors
  }
  
  // Suppress WebSocket connection syntax errors
  if (message.includes('WebSocket') || 
      message.includes('string did not match the expected pattern') ||
      message.includes('DOMException') ||
      message.includes('[vite] connecting...')) {
    return; // Silently ignore WebSocket connection errors
  }
  
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
