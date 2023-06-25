import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider } from "@material-ui/core/styles";
import globalTheme from "./ts/utils/globalTheme";
import { AuthProvider } from "./ts/global/AuthContext";
import "./css/app.css";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={globalTheme}>
      <App />
      <Toaster position="bottom-center" reverseOrder={true} />
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
