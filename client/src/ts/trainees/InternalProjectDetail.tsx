import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

interface DetailProps {
  name: string;
  value: string;
}

export const InternalProjectDetail: React.FC<DetailProps> = ({ name, value }) => {
  const useStyles = makeStyles((theme) => ({
    submit: {
      margin: theme.spacing(3, 0, 1),
      color: "white",
    },
    paper: {
      margin: theme.spacing(3),
      padding: theme.spacing(3),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    category: {
      color: theme.palette.text.secondary,
      width: "100%",
    },
    categoryHeader: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },

    categoryTitle: {
      textAlign: "center",
    },
    categoryLine: {
      paddingTop: "12.5px",
      paddingBottom: "11.5px",
      textAlign: "right",
    },

    categoryItem: {
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.up("md")]: {
        width: "30%",
      },
      [theme.breakpoints.down("md")]: {
        width: "50%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "60%",
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
    },
    categoryItemList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "right",
    },

    button: {
      padding: "6px 12px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      margin: "4px 2px",
      cursor: "pointer",
      backgroundColor: "white",
      color: "black",
      border: "none",
    },
    fullWidth: {
      width: "100%",
    },

    submitContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },

    cancelButton: {
      margin: theme.spacing(1, 1, 1, 1),
    },
    submitButton: {
      margin: theme.spacing(1, 0, 1, 1),
      color: "white",
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.categoryItem}>
      <Typography className={classes.categoryLine}>{name}:&nbsp;&nbsp;</Typography>
      <Typography className={classes.categoryLine}>{value}</Typography>
    </div>
  );
};
