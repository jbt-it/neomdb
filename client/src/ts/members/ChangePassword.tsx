/**
 * Component for resetting the password by the user without the help of a admin
 *
 */

import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import api from "../utils/api";
import { AuthContext } from "../global/AuthContext";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import decode from "jwt-decode";
import PageBar from "../global/navigation/PageBar";

const ChangePassword: React.FunctionComponent = () => {

  const useStyles = makeStyles((theme) => ({
    inputfield: {
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
  }));

  /**
   *  get username from auth token
   */
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("no token");
    } else {
      try {
        const { name } = decode(token);
        return name;
      }
      catch {
        console.warn("token Problem");
      }
    }
  };

  const classes = useStyles();
  const username = getUsernameFromToken();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValidation, setNewPasswordValidation] = useState<string>("");
  const [failedOldPassword, setFailedoldPassword] = useState<boolean>(false);
  const [postSuccesful, setPostSuccesful] = useState<boolean>(true);
  const [resResponse200, setResResponse200] = useState<boolean>(false);



  /**
   * checks old PW
   * Handles the API call and cleans state thereafter
   */
  const postPassword = () => {
    if (newPassword === newPasswordValidation && checkNewPassword(newPassword)) {
      setPostSuccesful(true);
      // Data package
      const data = {
        oldPassword,
        newPassword,
        username,
      };

      // Post request
      api.post("/users/change-password", data, {

        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then((res) => {
          if (res.status === 200) {
            // Worked
            setResResponse200(true);
            return [{ status: res.status }];
          } else {
            return [{ status: res.status }];
            setFailedoldPassword(true);
            setResResponse200(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setFailedoldPassword(true);
        });

    } else {
      setPostSuccesful(false);
      setResResponse200(false);
      console.error("new passwords not the same or not complex enough, so no request sent");
    }
    setOldPassword("");
    setNewPassword("");
    setNewPasswordValidation("");
  };

  /**
   * check if the new PW is okay: min 8 chars; mind 1 je num/a-z/A-Z
   */
  const checkNewPassword = (testString: string) => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regex.test(testString);
  };

  /*
  * Gets the password correct state of the password field, depending on if a previous login attempt failed
  */
  const getOldPasswordField = () => {
    if (failedOldPassword) {
      return (
        <Textfield error className={classes.inputfield} id="oldPassword" label="altes Passwort" type="password"
          helperText=" Altes Passwort ist nicht korrekt" value={oldPassword}
          onChange={event => { setOldPassword(event.target.value); }} fullWidth />
      );
    }
    return (
      <Textfield className={classes.inputfield} id="password" label="altes Passwort" type="password" value={oldPassword}
        onChange={event => { setOldPassword(event.target.value); }} fullWidth />
    );
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
   * if PW post was not sent
   */
  const postNotSentWarning = () => {
    if (!postSuccesful) {
      return "Das neue Paswwort wurde nicht gesendet, da es entweder nicht komplex genug war oder nicht übereingestimmt hat";
    } else {
      return "";
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
            Das Passwort wurde geändert
          </p>
        </Paper>
      );
    }
    else {
      return null;
    }
  };

  return (
    <div>
      <div className="content-page">

        <Paper className={classes.paper}>
          <p>
            Das neue Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen kleinen- und einen großen Buchstaben enthalten
          </p>
        </Paper>

        <Paper className={classes.paper}>
          <div>
            {getOldPasswordField()}

            {getNewPasswordField()}

            {getNewPasswordFieldValidation()}
          </div>
          <div>
            <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit" onClick={postPassword}>
              Neues Passwort speichern
          </Button>
          </div>
          <div>
            <p>
              {postNotSentWarning()}
            </p>
          </div>
        </Paper>

        {resResponse200Field()}

      </div>
      <PageBar pageTitle="Passwort ändern" />
    </div>
  );
};

export default ChangePassword;