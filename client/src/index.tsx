import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider } from "@material-ui/core/styles";
import globalTheme from "./ts/utils/globalTheme";
import { AuthProvider } from "./ts/global/AuthContext";
import "./scss/app.scss";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={globalTheme}>
      <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{vertical: "bottom", horizontal: "center",}}
          hideIconVariant={false}
          dense={false}
          preventDuplicate={false}
          >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </AuthProvider>
  , document.getElementById("root"));
