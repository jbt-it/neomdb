import React from "react";
import App from "./App";
import { AuthProvider } from "./context/auth-context/AuthContext";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import globalTheme from "./utils/globalTheme";
import "./css/app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <AuthProvider>
    <ThemeProvider theme={globalTheme}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="bottom-center" reverseOrder={true} />
        {/* Enable the devtools for react-query */}
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
);
