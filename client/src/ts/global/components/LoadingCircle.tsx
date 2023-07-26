/*
 * Component for rendering a loading circle
 */
import { Avatar, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import Lenni from "../../../images/lenni.jpeg";

/**
 * Function which proivdes the styles of the LoadingCircle
 */
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 180,
      height: 180,
    },
    center: {
      marginTop: 20,
      textAlign: "center",
    },
  })
);

/**
 * Displays a "loading circle"
 * @returns An Avatar and text
 */
const LoadingCircle = () => {
  const classes = useStyles();
  return (
    <div>
      <Avatar className={`rotate ${classes.root}`} src={Lenni} />
      <div className={classes.center}>
        <Typography variant="h4">Lade neoMDB...</Typography>
      </div>
    </div>
  );
};

export default LoadingCircle;
