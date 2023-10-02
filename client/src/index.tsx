import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import globalTheme from "./utils/globalTheme";
import { AuthProvider } from "./context/auth-context/AuthContext";
import "./css/app.css";
import { Toaster } from "react-hot-toast";
import { HashRouter } from "react-router-dom";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

ReactDOM.render(
  <AuthProvider>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={globalTheme}>
        <HashRouter>
          <App />
        </HashRouter>
        <Toaster position="bottom-center" reverseOrder={true} />
      </ThemeProvider>
    </StyledEngineProvider>
  </AuthProvider>,
  document.getElementById("root")
);
