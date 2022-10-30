/*
 * The ScrollTopBtn-Component displays a button at the lower right hand corner,
 * which scrolls back up to the top when pressed
 */

import React from "react";
import { Zoom, Fab, useScrollTrigger } from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

/**
 * Function which proivdes the styles of the ScrollTopBtn
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scrollTopBtn: {
      position: "fixed",
      bottom: theme.spacing(5.5),
      right: theme.spacing(2),
      zIndex: 20,
    },
    scrollTopFab: {
      backgroundColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    scrollTopIcon: {
      color: "black",
      "&:hover": {
        color: "white",
      },
    },
  })
);

/**
 * A button, which scrolls back to the top of the page, when clicked
 */
const ScrollTopBtn: React.FunctionComponent = () => {
  const classes = useStyles();

  const trigger = useScrollTrigger();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.scrollTopBtn}>
        <Fab className={classes.scrollTopFab} size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon className={classes.scrollTopIcon} />
        </Fab>
      </div>
    </Zoom>
  );
};

export default ScrollTopBtn;
