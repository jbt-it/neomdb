import React from "react";
import { Typography, makeStyles, Theme, createStyles } from "@material-ui/core";
import { HelpOutline, MoreVert, ClassSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme:Theme) => createStyles({
  pageBar: {
    position: "fixed",
    bottom: theme.spacing(0),
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.up("md")]:{
      marginLeft: "280px",
      padding: "8px",
    },
    [theme.breakpoints.down("md")]:{
      padding: "9px",
    },
  },
}));

interface PageBarProps {
  pageTitle: string;
}

const PageBar: React.FunctionComponent<PageBarProps> = (pageBarProps: PageBarProps) => {
  const classes = useStyles();

  return (
    <div className={classes.pageBar}>
      <Typography>{pageBarProps.pageTitle}</Typography>
    </div>
  );
};

export default PageBar;