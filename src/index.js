// main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// The development overlay treats the browser's deferred ResizeObserver
// notification as an application exception. Keep real exceptions visible;
// the browser will deliver the deferred observations on a subsequent frame.
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (event) => {
    if (!event.error && (
      event.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      event.message === 'ResizeObserver loop limit exceeded'
    )) {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.warn(event.message);
    }
  }, true);
}
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* ✅ Directly render App, which contains the one necessary Router */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
