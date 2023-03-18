import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider } from "@material-ui/core/styles";
import globalTheme from "./ts/utils/globalTheme";
import { AuthProvider } from "./ts/global/AuthContext";
import "./css/app.css";
import { SnackbarProvider } from "notistack";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={globalTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        hideIconVariant={false}
        dense={false}
        preventDuplicate={false}
      >
        <App />
        <Toaster position="bottom-center" reverseOrder={true} />
      </SnackbarProvider>
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
