import React from "react";
import { styled, Hidden, Drawer, SwipeableDrawer } from "@mui/material";
import MenuDrawer from "./MenuDrawer";
import { NavigateBeforeSharp } from "@mui/icons-material";

const StyledNav = styled("nav")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    position: "fixed",
    zIndex: 50,
  },
}));

const Sidebar: React.FunctionComponent = () => {
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = React.useState(false);
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsMenuDrawerOpen(open);
  };
  return (
    <StyledNav>
      <Hidden xlDown implementation="css">
        <Drawer variant="permanent" open>
          <MenuDrawer drawer={toggleDrawer} />
        </Drawer>
      </Hidden>
    </StyledNav>
  );
};

export default Sidebar;
