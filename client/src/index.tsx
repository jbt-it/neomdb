import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import globalTheme from "./ts/utils/globalTheme";
import { AuthProvider } from "./ts/global/AuthContext";
import "./css/app.css";
import { Toaster } from "react-hot-toast";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

ReactDOM.render(
  <AuthProvider>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={globalTheme}>
        <App />
        <Toaster position="bottom-center" reverseOrder={true} />
      </ThemeProvider>
    </StyledEngineProvider>
  </AuthProvider>,
  document.getElementById("root")
);
