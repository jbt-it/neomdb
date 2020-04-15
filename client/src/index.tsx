import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./scss/app.scss";

// Global theme
export const globalTheme = createMuiTheme({
  palette: {
    primary: {
      // Ci-orange as hex
      main: "#f6891f",
    },
    secondary: {
      // Ci-grey as hex
      main: "#aeb0b2",
    },
    text: {
      primary: "#000000",
      secondary: "#ffffff",
    }
  },
});

ReactDOM.render(
  <ThemeProvider theme={globalTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
