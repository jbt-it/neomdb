/**
 * Component that handles the login process
 */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { Paper, Grid, Button, TextField, Theme, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import JBTLogoBlack from "../assets/jbt-logo-black.png";
import useAuth from "../hooks/useAuth";

const Login: React.FunctionComponent = () => {
  /**
   * Styles
   */
  const useStyles = makeStyles((theme: Theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      paddingBottom: theme.spacing(3),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    JBTLogoBlack: {
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
    inputfield: {},
    submit: {
      margin: theme.spacing(3, 0, 1),
      color: "white",
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

  const { login, isLoginError } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [capslock, setCapslock] = useState<boolean>(false);

  /**
   * Function that handles the login process
   * @param event - the event that triggers the login
   */
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password);
  };

  /**
   * Check if Capslock is enabled
   */
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapslock(event.getModifierState("CapsLock"));
  };

  /**
   * Gets the password correct state of the password field, depending on if a previous login attempt failed
   */
  const getPasswordField: VoidFunction = () => {
    if (isLoginError) {
      return (
        <TextField
          error
          className={classes.inputfield}
          id="password"
          label="Passwort"
          type="password"
          helperText="Passwort oder Benutzername sind nicht korrekt"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          onKeyUp={handleKeyUp}
          fullWidth
        />
      );
    }
    return (
      <TextField
        className={classes.inputfield}
        id="password"
        label="Passwort"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        onKeyUp={handleKeyUp}
        fullWidth
      />
    );
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
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper className={classes.paper}>
            <img className={classes.JBTLogoBlack} src={JBTLogoBlack} alt="JBT-Logo" />
            <h1>Login</h1>
            <form
              className={classes.login}
              id="loginform"
              onSubmit={(event) => {
                handleLogin(event);
              }}
            >
              <TextField
                className={classes.inputfield}
                id="username"
                label="Benutzername"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                onKeyUp={handleKeyUp}
                fullWidth
              />
              {getPasswordField()}
              <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                Login
              </Button>
              <Grid container>
                <Grid item xs className={classes.linkItem}>
                  <NavLink to="/passwort-vergessen">Forgot Password?</NavLink>
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
