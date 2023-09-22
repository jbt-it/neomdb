// The Nav-Component displays an AppBar with search-input

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
  Hidden,
  Theme,
  alpha,
} from "@mui/material";
import { Menu, Search } from "@mui/icons-material";
import MenuDrawer from "./MenuDrawer";
import ScrollTopBtn from "./ScrollTopBtn";
import { createStyles, makeStyles } from "@mui/styles";

/**
 * Function which proivdes the styles of the Nav
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    barRoot: {
      flexGrow: 1,
    },
    bar: {
      backgroundColor: theme.palette.primary.main,
      zIndex: 100,
    },
    menuButton: {
      display: "block",
      color: "white",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    barContent: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      marginBottom: "2px",
    },
    jbtLogo: {
      display: "block",
      width: "45px",
      marginLeft: "5px",
      marginRight: "10px",
    },
    title: {
      flexGrow: 1,
      color: "white",
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    searchInputRoot: {
      color: "white",
    },
    searchInputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
    permanentDrawer: {
      [theme.breakpoints.up("md")]: {
        position: "fixed",
        zIndex: 50,
      },
    },
  })
);

/**
 * The navigation of the application
 */
const Nav: React.FunctionComponent = () => {
  const classes = useStyles();

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = React.useState(false);

  /**
   * Handles the toogle drawer event
   * @param open boolean value which indicates whether the drawer is open or not
   */
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
    <div className={classes.barRoot}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.bar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            size="large"
          >
            <Menu />
          </IconButton>
          <div className={classes.barContent}>
            <Typography className={classes.title} variant="h6" noWrap>
              JBT neoMDB
            </Typography>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Suche..."
              classes={{
                root: classes.searchInputRoot,
                input: classes.searchInputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.permanentDrawer}>
        <Hidden mdUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            open={isMenuDrawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <MenuDrawer drawer={toggleDrawer} />
          </SwipeableDrawer>
        </Hidden>
        <Hidden xlDown implementation="css">
          <Drawer variant="permanent" open>
            <MenuDrawer drawer={toggleDrawer} />
          </Drawer>
        </Hidden>
      </nav>
      <ScrollTopBtn />
    </div>
  );
};

export default Nav;
