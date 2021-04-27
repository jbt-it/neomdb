/**
 * Component for resetting the password by the user without the help of a admin, bofore logging in
 *
 */
import React, { useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import logo from "../../images/jbt-logo-black.png";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";
import api from "../utils/api";

/**
 * Function that allwos the suer to reset the password, if forgotten
 * @returns returns the interface for the user
 */
const ForgotPassword: React.FunctionComponent = () => {
  /**
   * Function which proivdes the styles of the MenuDrawer
   */
  const useStyles = makeStyles((theme) => ({
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
    inputfield: {
    },
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
    logo: {
      width: "30%",
      height: "auto",
      marginTop: theme.spacing(3),
    },
  }));

  const classes = useStyles();
  const [email, setEmail] = useState<string>("");
  const [submitBoolean, setSubmitBoolean] = useState<boolean>(false);

  /**
   * send the email to the backend
   */
  const sendPassword = () => {

    const data = {
      email
    };
    api.patch("/users/forgot-password", data
    )
    .then((res) => {
      if(res.status === 200)
      setSubmitBoolean(true);
    });
  };

  /**
   * check if input is an email
   */
  const emailRegexTest = (testEmail: string) => {
    const regex = /^.+@.+\..{1,6}/i;
    return regex.test(testEmail);
  };

  /**
   * return a warning if it is not a valid email
   */
  const invalidEmailWarning = () => {
    if (email !== "" && !emailRegexTest(email)) {
      return "This is not an Email";
    } else {
      return "";
    }
  };

  /**
   * the button was clicked
   */
  const informationOfSubmit = () => {
    if(submitBoolean){
      return (
        <Paper className={classes.paper}>
          If you gave your correct email, you should recieve a new password
        </Paper>
      );
    }else{
      return;
    }
  };

  return (
    <div className="forgotPassword">
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper className={classes.paper}>
            <img className={classes.logo} src={logo} />
            <h1>Forgot Password</h1>
            <form id="emailForm" onSubmit={event => { sendPassword(); }}>
              <Textfield className={classes.inputfield} id="email" label="Email" type="text" value={email}
                onChange={event => { setEmail(event.target.value); }} fullWidth />
              <p className={classes.warningText}>
                {invalidEmailWarning()}
              </p>
              <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                Send Password
              </Button>
            </form>
          </Paper>
          {informationOfSubmit()}
        </Grid>
      </Grid>
    </div>
  );
};

export default ForgotPassword;