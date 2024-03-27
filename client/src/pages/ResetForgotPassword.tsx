/**
 * Component for resetting the password by the user without the help of a admin, when the user gets the reset link
 *
 */
import React, { useState } from "react";
import { Paper, Button, TextField, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Functions that allows the user to reset the password with the sent reset link
 */
const ResetForgotPassword: React.FunctionComponent = () => {
  /**
   * Function which proivdes the styles of the MenuDrawer
   */
  const useStyles = makeStyles((theme) => ({
    inputfield: {},
    forgotPassword: {
      width: "65%",
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    submit: {
      margin: theme.spacing(3, 0, 1),
      color: "white",
    },
    pw: {
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
    warningText: {
      color: theme.palette.error.main,
      textDecoration: "none",
      pointerEvents: "none",
    },
    loginLink: {
      textDecoration: "none",
      color: "white",
    },
  }));

  const classes = useStyles();
  const [email, setEmail] = useState<string>("");
  const { key }: any = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValidation, setNewPasswordValidation] = useState<string>("");
  const [resResponse200, setResResponse200] = useState<boolean>(false);
  const { resetForgottenPassword } = useAuth();

  /**
   * Check if the new password is okay: min 8 chars; min 1 per num/a-z/A-Z
   */
  const checkNewPassword = (testString: string) => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regex.test(testString);
  };

  /**
   * Sends the new PW to the database
   */
  const postResetPassword = () => {
    if (newPassword === newPasswordValidation && checkNewPassword(newPassword)) {
      const data = {
        email,
        key,
        newPassword,
      };
      const response = resetForgottenPassword(data);
      response.then((res) => {
        if (res.status === 204) setResResponse200(true);
      });
    }
  };

  /**
   * New password field that checks if the new password conforms with the requirements
   */
  const getNewPasswordField = () => {
    if (!checkNewPassword(newPassword) && newPassword !== "") {
      return (
        <TextField
          error
          className={classes.inputfield}
          id="newpassword"
          label="Neues Passwort"
          type="password"
          helperText="Erfüllt nicht die Vorraussetzungen"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
          fullWidth
        />
      );
    } else {
      return (
        <TextField
          className={classes.inputfield}
          id="newpassword"
          label="Neues Passwort"
          type="password"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
          fullWidth
        />
      );
    }
  };

  /**
   * New password validation field that checks if both entered passwords are the same
   */
  const getNewPasswordFieldValidation = () => {
    if (newPassword === newPasswordValidation) {
      return (
        <TextField
          className={classes.inputfield}
          id="newpasswordvalidation"
          label="Neues Passwort wiederholen"
          type="password"
          value={newPasswordValidation}
          onChange={(event) => {
            setNewPasswordValidation(event.target.value);
          }}
          fullWidth
        />
      );
    } else {
      return (
        <TextField
          error
          className={classes.inputfield}
          id="newpasswordvalidation"
          label="Neues Passwort wiederholen"
          type="password"
          helperText="Die Passwörter müssen gleich sein"
          value={newPasswordValidation}
          onChange={(event) => {
            setNewPasswordValidation(event.target.value);
          }}
          fullWidth
        />
      );
    }
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
    if (!emailRegexTest(email)) {
      return "Bitte gib eine gültige E-Mail an";
    } else {
      return "";
    }
  };

  /**
   * If res is code 200
   */
  const resResponse200Field = () => {
    if (resResponse200) {
      return (
        <Paper className={classes.paper}>
          <p>Das Passwort wurde geändert, falls die E-Mail korrekt war</p>
          <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
            <NavLink to="/login" className={classes.loginLink}>
              Login
            </NavLink>
          </Button>
        </Paper>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="forgotPassword">
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper className={classes.paper}>
            <p>
              Das neue Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen Klein- und einen Großbuchstaben
              enthalten.
            </p>
          </Paper>
          <Paper className={classes.paper}>
            <form id="resetForgotPW" onSubmit={postResetPassword}>
              <div>
                {getNewPasswordField()}
                {getNewPasswordFieldValidation()}
              </div>
              <div>
                <TextField
                  className={classes.inputfield}
                  id="email"
                  label="E-Mail"
                  type="text"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  fullWidth
                />
                <p className={classes.warningText}>{invalidEmailWarning()}</p>
              </div>
              <div>
                <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                  Neues Passwort speichern
                </Button>
              </div>
            </form>
          </Paper>
          {resResponse200Field()}
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetForgotPassword;
