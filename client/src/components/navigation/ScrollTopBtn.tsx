/*
 * The ScrollTopBtn-Component displays a button at the lower right hand corner,
 * which scrolls back up to the top when pressed
 */

import React from "react";
import { Zoom, Fab, useScrollTrigger, useTheme, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/**
 * A button, which scrolls back to the top of the page, when clicked
 */
const ScrollTopBtn: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the ScrollTopBtn
   */
  const styles = {
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
  };

  const trigger = useScrollTrigger();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={styles.scrollTopBtn}>
        <Fab sx={styles.scrollTopFab} size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon sx={styles.scrollTopIcon} />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollTopBtn;
