/**
 * Component that handles the login process
 */
import React, { useState } from "react";

import api from "../utils/api";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";

const Login: React.FunctionComponent = () => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  /**
   * Handles the API call and cleans state thereafter
   */
  const login: VoidFunction = () => {
    api.post("/users/login", {
      username: username,
      password: password
    })
    .then((res) => {
      console.log(res.data);
    }, (err) => {
      console.log(err);
    });

    setUsername("");
    setPassword("");
  };

  return (
    <div className="login">
      <Card className="card">
        <CardContent>
          <h1>Login</h1>
          <form className="login-form">
            <Textfield id="username" label="Benutzername" type="text" value={username}
              onChange = {event => {setUsername(event.target.value);}}/>
            <Textfield id="password" label="Passwort" type="password" value={password}
              onChange = {event => {setPassword(event.target.value);}}/>
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" size="small" color="primary"
            onClick = {event => {login();}}>
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Login;
