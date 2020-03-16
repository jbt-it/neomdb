import React from "react";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";

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