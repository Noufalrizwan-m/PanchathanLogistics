// main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {/* ✅ Directly render App, which contains the one necessary Router */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
