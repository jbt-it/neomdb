import React from "react";
import {
  Zoom,
  Fab,
  useScrollTrigger
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

/**
 * A button, which scrolls back to the top of the page, when clicked
 */
const ScrollTopBtn:React.FunctionComponent = () => {

    const trigger = useScrollTrigger();
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <Zoom in={trigger}>
        <div
          onClick={handleClick}
          role="presentation"
          className="scroll-top-btn"
        >
          <Fab className="scroll-top-fab" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon className="scroll-top-icon"/>
          </Fab>
        </div>
      </Zoom>
    );
  };

  export default ScrollTopBtn;