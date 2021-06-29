/**
 * Component for resetting the password by the user without the help of a admin, when the user gets the reset link
 *
 */
import React, { useState, useContext } from "react";
import api from "../utils/api";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

/**
 * Functions that allows the user to reset the password with the sent reset link
 */
const ResetForgotPassword: React.FunctionComponent = () => {
  /**
   * Function which proivdes the styles of the MenuDrawer
   */
  const useStyles = makeStyles((theme) => ({
    inputfield: {
    },
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
  }));

  const classes = useStyles();
  const [email, setEmail] = useState<string>("");
  const { key }: any = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValidation, setNewPasswordValidation] = useState<string>("");
  const [resResponse200, setResResponse200] = useState<boolean>(false);

  /**
   * Sends the new PW to the database
   */
  const postResetPassword = () => {
    const data = {
      email,
      key,
      newPassword
    };
    api.patch("/users/reset-forgot-password", data
    )
      .then((res) => {
        if (res.status === 200)
          setResResponse200(true);
      });
  };

  /**
   * check if the new PW is okay: min 8 chars; mind 1 je num/a-z/A-Z
   */
  const checkNewPassword = (testString: string) => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regex.test(testString);
  };

  /**
   * new password fild
   */
  const getNewPasswordField = () => {
    if (!checkNewPassword(newPassword) && newPassword !== "") {
      return (
        <Textfield error className={classes.inputfield} id="newpassword" label="neues Passwort" type="password" helperText="erfüllt nicht die Vorraussetzungen" value={newPassword}
          onChange={event => { setNewPassword(event.target.value); }}
          fullWidth />
      );
    } else {
      return (
        <Textfield className={classes.inputfield} id="newpassword" label="neues Passwort" type="password" value={newPassword}
          onChange={event => { setNewPassword(event.target.value); }}
          fullWidth />
      );
    }
  };

  /**
   * new password field validation
   */
  const getNewPasswordFieldValidation = () => {
    if (newPassword === newPasswordValidation) {
      return (
        <Textfield className={classes.inputfield} id="newpasswordvalidation" label="neues Passwort wiederholen" type="password" value={newPasswordValidation}
          onChange={event => { setNewPasswordValidation(event.target.value); }}
          fullWidth />
      );
    } else {
      return (
        <Textfield error className={classes.inputfield} id="newpasswordvalidation" label="neues Passwort wiederholen" type="password" helperText="Die Passwörter müsen gleich sein" value={newPasswordValidation}
          onChange={event => { setNewPasswordValidation(event.target.value); }}
          fullWidth />
      );
    }
  };

  /**
   * if res is code 200
   */
  const resResponse200Field = () => {
    if (resResponse200) {
      return (
        <Paper className={classes.paper}>
          <p>
            Das passwort wurde gesendet
          </p>
        </Paper>
      );
    }
    else {
      return null;
    }
  };

  return (
    <div className="forgotPassword">
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper className={classes.paper}>
            <p>
              Das neue Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen kleinen- und einen großen Buchstaben enthalten
          </p>
          </Paper>
          <Paper className={classes.paper}>
            <form id="resetForgotPW" onSubmit={event => { postResetPassword(); }}>
              <div>
                {getNewPasswordField()}
                {getNewPasswordFieldValidation()}
              </div>
              <div>
                <Textfield className={classes.inputfield} id="email" label="Email" type="text" value={email}
                  onChange={event => { setEmail(event.target.value); }} fullWidth />
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