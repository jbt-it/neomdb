import React from "react";

import PropTypes from "prop-types";
import { forwardRef, ReactNode } from "react";

import Box from "@mui/material/Box";

import { StyledScrollbar, StyledRootScrollbar } from "./StyledScrollbar";

interface ScrollbarProps {
  children?: ReactNode;
  sx?: object;
}

/**
 * This component is responsible for styling the scrollbar.
 */
const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(({ children, sx, ...other }, ref) => {
  const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (mobile) {
    return (
      <Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

Scrollbar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default Scrollbar;
