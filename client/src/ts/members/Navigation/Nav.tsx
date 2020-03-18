import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  SwipeableDrawer,
  Typography,
  InputBase,
  CssBaseline,
  Drawer,
  Hidden
} from "@material-ui/core";
import {
  Menu,
  Search
} from "@material-ui/icons";
import MenuDrawer from "./MenuDrawer";
import ScrollTopBtn from "./ScrollTopBtn";
import JBTLogoWhite from "../../../images/jbt-logo-white.png";

/**
 * The navigation of the application
 */
const Nav:React.FunctionComponent = () => {

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = React.useState(false);
  const [isSearchBarActive, setIsSearchBarActive] = React.useState(false);

  /**
   * Handles the toogle drawer event
   *
   * @param open boolean value which indicates whether the drawer is open or not
   */
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsMenuDrawerOpen(open);
  };

 /**
  * Returns the scss-class for the search bar
  */
  const getClassForSearchBar = () => {
    if(isSearchBarActive) {
      return "search-active";
    } else {
      return "search";
    }
  };

  return (<div className="bar-root">
    <CssBaseline />
    <AppBar position="fixed" className="bar">
      <Toolbar>
        <IconButton
          edge="start"
          className="menu-button"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
        >
          <Menu/>
        </IconButton>
        <div className="title">
          <Typography variant="h6" noWrap>
            JBT neoMDB
          </Typography>
          <img src={JBTLogoWhite} alt="JBT Logo" className="jbt-logo"/>
        </div>
        <div className={getClassForSearchBar()}>
          <div className="search-icon">
            <Search/>
          </div>
          <InputBase
            placeholder="Suche..."
            classes={{
              root: "search-input-root",
              input: "search-input-input"
            }}
            inputProps={{ "aria-label": "search" }}
            onFocus={() => {
              setIsSearchBarActive(true);
            }}
            onBlur={() => {
              setIsSearchBarActive(false);
            }}
          />
        </div>
      </Toolbar>
    </AppBar>
    <nav className="permanent-drawer">
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
          variant="temporary"
          open={isMenuDrawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          ModalProps={{
            keepMounted: true
          }}
        >
            <MenuDrawer drawer={toggleDrawer}/>
          </SwipeableDrawer>
          </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
          >
            <MenuDrawer drawer={toggleDrawer}/>
          </Drawer>
        </Hidden>
      </nav>
      <ScrollTopBtn/>
</div>);
};

export default Nav;
