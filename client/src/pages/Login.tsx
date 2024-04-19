/**
 * Component that handles the login process
 */
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import api from "../utils/api";
import { Paper, Grid, Button, TextField, Link, useTheme, styled } from "@mui/material";
import JBTLogoBlack from "../assets/jbt-logo-black.png";
import { authReducerActionType } from "../types/globalTypes";
import { useAuth } from "../hooks/useAuth";

const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { dispatchAuth } = useAuth();

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

  const StyledForm = styled("form")<{ children?: React.ReactNode }>(({ theme }) => ({
    width: "65%",
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }));

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [capslock, setCapslock] = useState<boolean>(false);
  const [failedLogin, setFailedLogin] = useState<boolean>(false);

  /**
   * Handles the API call and cleans state thereafter
   */
  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    api
      .post("/auth/login", {
        username,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          const userID = res.data.mitgliedID;
          const userName = res.data.name;
          const permissions = res.data.permissions;
          const roles = res.data.roles;
          dispatchAuth({
            type: authReducerActionType.authenticate,
            payload: { userID, userName, permissions, roles },
          });
          navigate("/");
        } else {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          setFailedLogin(true);
        }
      })
      .catch(() => {
        setFailedLogin(true);
      });
    setPassword("");
  };

  /**
   * Gets the password correct state of the password field, depending on if a previous login attempt failed
   */
  const getPasswordField: VoidFunction = () => {
    if (failedLogin) {
      return (
        <TextField
          error
          sx={styles.inputfield}
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
        sx={styles.inputfield}
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

  /**
   * Check if Capslock is enabled
   */
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCapslock(event.getModifierState("CapsLock"));
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
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper sx={styles.paper}>
          <img style={styles.JBTLogoBlack} src={JBTLogoBlack} alt="JBT-Logo" />
          <h1>Login</h1>
          <StyledForm
            id="loginform"
            onSubmit={(event) => {
              login(event);
            }}
          >
            <>
              <TextField
                sx={styles.inputfield}
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
              <Button sx={styles.submit} variant="contained" fullWidth color="primary" type="submit">
                Login
              </Button>
              <Grid container>
                <Grid item xs sx={styles.linkItem}>
                  <NavLink to="/passwort-vergessen">Forgot Password?</NavLink>
                </Grid>
                <Grid item xs sx={styles.warningItem}>
                  <Link id="capswarning" variant="body2" sx={styles.warningText}>
                    {setCapsLockWaring()}
                  </Link>
                </Grid>
              </Grid>
            </>
          </StyledForm>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
