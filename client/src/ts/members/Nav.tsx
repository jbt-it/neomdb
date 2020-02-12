import React, { ReactElement, useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import EventIcon from "@material-ui/icons/Event";
import BuildIcon from "@material-ui/icons/Build";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AppsIcon from "@material-ui/icons/Apps";
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  Theme,
  makeStyles
} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import {NavLink} from 'react-router-dom';
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";


const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  root: {
    flexGrow: 1
  },
  bar: {
    backgroundColor: "orange"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  }
}));

// interface for the drawer props
interface DrawerProps {
  open: boolean,
  drawer: Function
}

/**
 * a drawer which enters from the left and depicts various options for navigation
 * 
 * @param props
 */
const SwipeableTemporaryDrawer = (props: DrawerProps) => {
  const classes = useStyles();

  const [memberOpen, setMemberOpen] = useState(false);

  /**
   * handles the click event on the different extendable list items
   * 
   * @param value topic of the extendable list item
   */
  const handleClick = (value: string) => (event: React.MouseEvent) =>  {
    switch (value){
      case "Mitglieder" : {
        setMemberOpen(!memberOpen);
      }
    }
  }

  // the side list, which containts all navigational options
  const sideList = () => (
    <div className={classes.list}>
      <List>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <NavLink exact to="/" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary="Dashboard" />
          </NavLink>
        </ListItem>
        <ListItem button onClick={handleClick("Mitglieder")}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Mitglieder" />
          {memberOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={memberOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Mitglieder" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Gesamtübersicht"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Vorstand" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Der Vorstand"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/EvHistorie" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Ewige EV-Liste"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Expertenwissen" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Expertenwissen"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Geburtstage" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Geburtstage"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Generationenbeauftragte" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Generationenbeauftragte"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Traineebereich" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Traineebereich"} />
              </NavLink>
            </ListItem>
            <ListItem button onClick={props.drawer(false)}>
              <NavLink exact to="/Kuratoren" activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItemText primary={"Kuratoren"} />
              </NavLink>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <NavLink exact to="/Projekte" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary={"Projekte"} />
          </NavLink>
        </ListItem>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <NavLink exact to="/Veranstaltungen" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary={"Veranstaltungen"} />
          </NavLink>
        </ListItem>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <NavLink exact to="/Tools" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary={"Tools"} />
          </NavLink>
        </ListItem>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <NavLink exact to="/MeineFunktionen" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary={"Meine Funktionen"} />
          </NavLink>
        </ListItem>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <MoreHorizIcon />
          </ListItemIcon>
          <NavLink exact to="/WeitereFunktionen" activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItemText primary={"Weitere Funktionen"} />
          </NavLink>
        </ListItem>
      </List>
      <Divider />
      <List>
      <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <EmojiObjectsIcon />
          </ListItemIcon>
          <ListItemText primary={"KVP"} />
        </ListItem>
        <ListItem button onClick={props.drawer(false)}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  );

  
  return (
    <div
    role="presentation"
    onKeyDown={props.drawer(false)}
    >
      <SwipeableDrawer
        open={props.open}
        onClose={props.drawer(false)}
        onOpen={props.drawer(true)}
      >
        {sideList()}
      </SwipeableDrawer>
    </div>
  );
}

/**
 * the navigation of the application 
 */
const Nav = () => {

  const classes = useStyles();

  const [state, setState] = React.useState(false);

  /**
   * handles the toogle drawer event
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

    setState(open);
  };

  return (<div>
    <AppBar position="static" className={classes.bar}>
  <Toolbar>
    <IconButton
      edge="start"
      className={classes.menuButton}
      color="inherit"
      aria-label="open drawer"
      onClick={toggleDrawer(true)}
    >
      <MenuIcon />
    </IconButton>
    <Typography className={classes.title} variant="h6" noWrap>
      JBT neoMDB LOGO{" "}
    </Typography>
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  </Toolbar>
</AppBar>
<SwipeableTemporaryDrawer open={state} drawer={toggleDrawer}/>
</div>);
}

export default Nav;
