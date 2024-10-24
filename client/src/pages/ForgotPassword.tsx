/**
 * Component for resetting the password by the user without the help of a admin, bofore logging in
 */
import React, { useState } from "react";
import { Paper, Grid, Button, TextField, useTheme, Box } from "@mui/material";
import jbtLogoBlack from "../assets/jbt-logo-black.png";
import api from "../utils/api";

/**
 * Function that allwos the user to reset the password, if forgotten by sending them a reset link
 */
const ForgotPassword: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the ForgotPassword
   */
  const styles = {
    forgotPassword: {
      width: "65%",
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    paper: {
      margin: theme.spacing(3),
      padding: theme.spacing(3),
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
    jbtLogoBlack: {
      width: "30%",
      height: "auto",
      marginTop: theme.spacing(3),
    },
  };

  const [email, setEmail] = useState<string>("");
  const [submitBoolean, setSubmitBoolean] = useState<boolean>(false);

  /**
   * Send the email to the backend
   */
  const sendEmailWithLink = () => {
    const data = {
      email,
    };
    api.post("/auth/forgot-password", data).then((res) => {
      if (res.status === 204) setSubmitBoolean(true);
    });
  };

  /**
   * Check if input is an email
   */
  const emailRegexTest = (testEmail: string) => {
    const regex = /^.+@.+\..{1,6}/i;
    return regex.test(testEmail);
  };

  /**
   * Return a warning if it is not a valid email
   */
  const invalidEmailWarning = () => {
    if (email !== "" && !emailRegexTest(email)) {
      return "Bitte gib eine gültige E-Mail an";
    } else {
      return "";
    }
  };

  /**
   * The button was clicked and the user is informed about the action
   */
  const informationOfSubmit = () => {
    if (submitBoolean) {
      return (
        <Paper sx={styles.paper}>
          Der Link zum Zurücksetzen des Passworts wurde an die angegebene E-Mail-Adresse gesendet.
        </Paper>
      );
    } else {
      return;
    }
  };

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper sx={styles.paper}>
          <img style={styles.jbtLogoBlack} src={jbtLogoBlack} />
          <h1>Passwort vergessen</h1>
          <form
            id="emailForm"
            onSubmit={(event) => {
              sendEmailWithLink();
            }}
          >
            <TextField
              sx={styles.inputfield}
              id="email"
              label="E-Mail"
              type="text"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              fullWidth
            />
            <Box sx={styles.warningText}>{invalidEmailWarning()}</Box>
            <Button sx={styles.submit} variant="contained" fullWidth color="primary" type="submit">
              Passwort anfordern
            </Button>
          </form>
        </Paper>
        {informationOfSubmit()}
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
