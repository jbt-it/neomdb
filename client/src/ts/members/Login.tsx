/**
 * Component that handles the login process
 */
import React, { useState } from "react";

import api from "../utils/api";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../../images/jbt-logo-black.png";
import Link from "@material-ui/core/Link";

const Login: React.FunctionComponent = () => {

  /**
   * Styles
   */
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      paddingBottom: theme.spacing(3),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      width: "30%",
      height: "auto",
      marginTop: theme.spacing(3),
    },
    login: {
      width: "65%",
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    inputfield: {
    },
    submit: {
      margin: theme.spacing(3, 0, 1),
    },
    linkItem: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    warningItem: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    warningText: {
      color: theme.palette.error.main,
      textDecoration: "none",
      pointerEvents: "none",
    },
  }));

  const classes = useStyles();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [capslock, setCapslock] = useState<boolean>(false);
  const [failedLogin, setFailedLogin] = useState<boolean>(false);

  /**
   * Handles the API call and cleans state thereafter
   */
  const login: VoidFunction = () => {
    api.post("/users/login", {
      username,
      password
    })
    .then((res) => {
      if (res.status === 200){
        localStorage.setItem("token", res.data);
      } else {
        setFailedLogin(true);
      }
    }, () => {
      setFailedLogin(true);
    });
    setPassword("");
  };

  /*
   * Gets the password correct state of the password field, depending on if a previous login attempt failed
   */
  const getPasswordField: VoidFunction = () => {
    if (failedLogin) {
      return (
        <Textfield error className={classes.inputfield} id="password" label="Passwort" type="password"
          helperText="Passwort oder Benutzername sind nicht korrekt" value={password}
          onChange = {event => {setPassword(event.target.value);}}
          onKeyUp={event => {handleKeyUp(event.getModifierState("CapsLock"));}} fullWidth />
      );
    }
    return (
      <Textfield className={classes.inputfield} id="password" label="Passwort" type="password" value={password}
        onChange = {event => {setPassword(event.target.value);}}
        onKeyUp={event => {handleKeyUp(event.getModifierState("CapsLock"));}} fullWidth />
    );
  };

  /**
   * Check if Capslock is enabled
   */
  const handleKeyUp = (isCapsEnabled:boolean) => {
    setCapslock(isCapsEnabled);
  };

  /*
   * Warn if capslock is enabled
   */
  const setCapsLockWaring = () => {
    if (capslock) {
      return "Caps Lock is enabled!";
    }
    return "";
  };

  return (
    <div className="login">
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper className={classes.paper}>
            <img className={classes.logo} src={logo}/>
            <h1>Login</h1>
            <form className={classes.login} onSubmit={event => {login();}}>
              <Textfield className={classes.inputfield} id="username" label="Benutzername" type="text" value={username}
                onChange = {event => {setUsername(event.target.value);}}
                onKeyUp={event => {handleKeyUp(event.getModifierState("CapsLock"));}} fullWidth />
              {getPasswordField()}
              <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                      Login
              </Button>
              <Grid container>
                <Grid item xs className={classes.linkItem}>
                  <Link href="#/login" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs className={classes.warningItem}>
                  <Link id="capswarning" variant="body2" className={classes.warningText}>
                    {setCapsLockWaring()}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
