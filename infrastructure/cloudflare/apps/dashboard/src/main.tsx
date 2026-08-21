import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.js";
import { App } from "./App.js";

import "@gefi/ui/tokens.css";
import "@gefi/ui/components.css";
import "./styles/app.css";

const el = document.getElementById("root");
if (!el) throw new Error("Root element not found");

createRoot(el).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
