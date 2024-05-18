/**
 * Component that handles the login process
 */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Paper, Grid, Button, TextField, Link, useTheme, styled } from "@mui/material";
import JBTLogoBlack from "../assets/jbt-logo-black.png";
import useAuth from "../hooks/useAuth";

/**
 * The styled form component
 */
const StyledForm = styled("form")<{ children?: React.ReactNode }>(({ theme }) => ({
  width: "65%",
  marginTop: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Login: React.FunctionComponent = () => {
  const theme = useTheme();
  /**
   * Styles
   */
  const styles = {
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
    link: {
      color: "inherit",
      textDecoration: "none",
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
  };

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

  /*
   * Warn if capslock is enabled
   */
  const setCapsLockWarning = () => {
    if (capslock) {
      return "Die Feststelltaste ist aktiviert!";
    }
    return "";
  };

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper sx={styles.paper}>
          <img style={styles.JBTLogoBlack} src={JBTLogoBlack} alt="JBT-Logo" />
          <h1>Login</h1>
          <StyledForm
            id="loginform"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              handleLogin(event);
            }}
          >
            <TextField
              error={isLoginError}
              sx={styles.inputfield}
              id="username"
              label="Benutzername"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              onKeyUp={handleKeyUp}
              fullWidth
            />
            <TextField
              error={isLoginError}
              sx={styles.inputfield}
              id="password"
              label="Passwort"
              type="password"
              autoComplete="current-password"
              helperText={isLoginError ? "Passwort oder Benutzername sind nicht korrekt" : ""}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              onKeyUp={handleKeyUp}
              fullWidth
            />
            <Button sx={styles.submit} variant="contained" fullWidth color="primary" type="submit">
              Login
            </Button>
            <Grid container>
              <Grid item xs sx={styles.linkItem}>
                <NavLink to="/passwort-vergessen" style={styles.link}>
                  Passwort vergessen?
                </NavLink>
              </Grid>
              <Grid item xs sx={styles.warningItem}>
                <Link id="capswarning" variant="body2" sx={styles.warningText}>
                  {setCapsLockWarning()}
                </Link>
              </Grid>
            </Grid>
          </StyledForm>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
