import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CustomSnackbar from "./CustomSnackbar";
import { useSnackbar } from "notistack";



const NotFound: React.FunctionComponent = () => {
  const useStyles = makeStyles((theme) => ({
    app: {
      marginTop: "10%",
      marginLeft: "20%",
    },
    snack: {

    },
  }));


  const classes = useStyles();

  const handleClick = () => {
    return (<CustomSnackbar message={"Servus"}/>)
  };

  return (
    <div className={classes.app}>
      <React.Fragment>
        <Button className={classes.app} color="primary" variant="outlined" onClick={handleClick}>Was geht ab</Button>
      </React.Fragment>
    </div>
  );
};


export default NotFound;
