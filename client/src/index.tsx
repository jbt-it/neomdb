import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import { ThemeProvider } from "@material-ui/core/styles";
import globalTheme from "./ts/global/GlobalTheme";
import "./scss/app.scss";

ReactDOM.render(
  <ThemeProvider theme={globalTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
