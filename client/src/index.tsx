import React from "react";
import App from "./App";
import { AuthProvider } from "./context/auth-context/AuthContext";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import globalTheme from "./utils/globalTheme";
import "./css/app.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <AuthProvider>
    <ThemeProvider theme={globalTheme}>
      <App />
      <Toaster position="bottom-center" reverseOrder={true} />
    </ThemeProvider>
  </AuthProvider>
);
