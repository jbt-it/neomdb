/*
 * Component for rendering a loading circle
 */
import { Avatar, Typography, Box, Stack } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import Lenni from "../../assets/lenni.jpeg";

/**
 * Function which proivdes the styles of the LoadingCircle
 */
const useStyles = makeStyles(() =>
  createStyles({
    center: {
      marginTop: 20,
      textAlign: "center",
    },
    rotating: {
      width: 180,
      height: 180,
      animation: "spin 4s linear infinite",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "100%",
      maxWidth: "100%",
      marginTop: "10%",
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
    <Stack className={classes.loading}>
      <Box>
        <Avatar className={classes.rotating} src={Lenni} />
        <style>
          {`
            @keyframes spin {
                 0% { transform: rotate(360deg); }
                 100% { transform: rotate(0deg); }
            }
        `}
        </style>
      </Box>
      <div className={classes.center}>
        <Typography variant="h4">Lade neoMDB...</Typography>
      </div>
    </Stack>
  );
};

export default LoadingCircle;
