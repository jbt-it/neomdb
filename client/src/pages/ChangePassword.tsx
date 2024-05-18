/**
 * Component for resetting the password by the user without the help of a admin, when logged in
 *
 */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context/AuthContext";
import { Paper, Button, useTheme } from "@mui/material";
import Textfield from "@mui/material/TextField";
import { Container } from "@mui/system";
import useAuth from "../hooks/useAuth";

/**
 * Function that allows the user to change the password when logged in, by posting the new password to the backend
 * @returns returns the interface for the user
 */
const ChangePassword: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MenuDrawer
   */
  const styles = {
    inputfield: {},
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
  };

  const { auth } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordValidation, setNewPasswordValidation] = useState<string>("");
  const [failedOldPassword, setFailedoldPassword] = useState<boolean>(false);
  const [postSuccesful, setPostSuccesful] = useState<boolean>(true);
  const [resResponse200, setResResponse200] = useState<boolean>(false);
  const { changePassword } = useAuth();

  /**
   * check if the new PW is okay: min 8 chars; mind 1 je num/a-z/A-Z
   */
  const checkNewPassword = (testString: string) => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regex.test(testString);
  };

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
        userID: auth.userID,
        userName: auth.userName,
      };
      const response = changePassword(data);
      response
        .then((res) => {
          if (res.status === 204) {
            // Password change was succefull
            setResResponse200(true);
          } else {
            setFailedoldPassword(true);
            setResResponse200(false);
          }
        })
        .catch(() => {
          setFailedoldPassword(true);
        });
    }

    setOldPassword("");
    setNewPassword("");
    setNewPasswordValidation("");
  };

  /*
   * Gets the password correct state of the password field, depending on if a previous login attempt failed
   */
  const getOldPasswordField = () => {
    if (failedOldPassword) {
      return (
        <Textfield
          error
          sx={styles.inputfield}
          id="oldPassword"
          label="altes Passwort"
          type="password"
          helperText=" Altes Passwort ist nicht korrekt"
          value={oldPassword}
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
          fullWidth
        />
      );
    }
    return (
      <Textfield
        sx={styles.inputfield}
        id="password"
        label="altes Passwort"
        type="password"
        value={oldPassword}
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
        fullWidth
      />
    );
  };

  /**
   * new password fild
   */
  const getNewPasswordField = () => {
    if (!checkNewPassword(newPassword) && newPassword !== "") {
      return (
        <Textfield
          error
          sx={styles.inputfield}
          id="newpassword"
          label="neues Passwort"
          type="password"
          helperText="erfüllt nicht die Vorraussetzungen"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
          fullWidth
        />
      );
    } else {
      return (
        <Textfield
          sx={styles.inputfield}
          id="newpassword"
          label="neues Passwort"
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
   * new password field validation
   */
  const getNewPasswordFieldValidation = () => {
    if (newPassword === newPasswordValidation) {
      return (
        <Textfield
          sx={styles.inputfield}
          id="newpasswordvalidation"
          label="neues Passwort wiederholen"
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
        <Textfield
          error
          sx={styles.inputfield}
          id="newpasswordvalidation"
          label="neues Passwort wiederholen"
          type="password"
          helperText="Die Passwörter müsen gleich sein"
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
   * if PW post was not sent
   */
  const postNotSentWarning = () => {
    if (!postSuccesful) {
      return "Das neue Passwort wurde nicht gesendet, da es entweder nicht komplex genug war oder nicht übereingestimmt hat";
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
        <Paper sx={styles.paper}>
          <p>Das Passwort wurde geändert</p>
        </Paper>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Container>
        <Paper sx={styles.paper}>
          <p>
            Das neue Passwort muss mindestens 8 Zeichen lang sein und eine Zahl, einen kleinen- und einen großen
            Buchstaben enthalten
          </p>
        </Paper>
        <Paper sx={styles.paper}>
          <div>
            {getOldPasswordField()}
            {getNewPasswordField()}
            {getNewPasswordFieldValidation()}
          </div>
          <div>
            <Button
              sx={styles.submit}
              variant="contained"
              fullWidth
              color="primary"
              type="submit"
              onClick={postPassword}
            >
              Neues Passwort speichern
            </Button>
          </div>
          <div>
            <p>{postNotSentWarning()}</p>
          </div>
        </Paper>
        {resResponse200Field()}
      </Container>
    </>
  );
};

export default ChangePassword;
