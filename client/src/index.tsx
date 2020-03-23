import React from "react";
import ReactDOM from "react-dom";
import App from "./ts/global/App";
import {AuthProvider} from "./ts/global/AuthContext";

import "./scss/app.scss";

ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById("root"));
