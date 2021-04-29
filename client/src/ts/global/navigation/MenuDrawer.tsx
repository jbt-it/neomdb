// The MenuDrawer-Component displays a drawer with navigation-options.

import React, {
  useState,
  useEffect,
  useContext
} from "react";
import {
  NavLink,
  useHistory,
  useLocation
} from "react-router-dom";
import {
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import {
  Avatar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography
} from "@material-ui/core";
import {
  Dashboard,
  PeopleAlt,
  Event,
  Build,
  MoreHoriz,
  Apps,
  EmojiObjects,
  ExitToApp,
  TrendingUp
} from "@material-ui/icons";
import {
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core/styles";
import JBTLogoBlack from "../../../images/jbt-logo-black.png";
import { AuthContext } from "../AuthContext";

/**
 * Function which proivdes the styles of the MenuDrawer
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  menuDrawer: {
    width: "280px",
  },
  avatarSection: {
    [theme.breakpoints.down("md")]: {
      marginLeft: theme.spacing(),
      padding: theme.spacing(),
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(),
      padding: theme.spacing(),
    },
  },
  muiAvatarRoot: {
    marginBottom: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  avatarName: {
    fontWeight: "bold",
    fontSize: "medium",
  },
  listItemNavText: {
    color: "black",
    textDecoration: "none",
  },
  subListItem: {
    marginLeft: theme.spacing(8),
  },
  drawerListItemActive: {
    color: theme.palette.primary.main,
  },
  drawerListItem: {
    color: "inherit",
  },
}));

// Interface for the drawer props
interface DrawerProps {
  drawer: (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => void;
}

/**
 * A drawer which enters from the left and depicts various options for navigation
 * @param props
 */
const MenuDrawer: React.FunctionComponent<DrawerProps> = (props: DrawerProps) => {
  const [authenticated, setAuthenticated,
    userID, setUserID, userName, setUserName] = useContext(AuthContext);
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    setActiveNavLink(location.pathname);
  }, [location.pathname]);

  const [activeNavLink, setActiveNavLink] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [myFunctionsOpen, setMyFunctionsOpen] = useState(false);

  /**
   * Handles the click event on the different extendable list items
   * @param value topic of the extendable list item
   */
  const handleCollpaseClick = (value: string) => (event: React.MouseEvent) => {
    switch (value) {
      case "Mitglieder": {
        setMemberOpen(!memberOpen);
        setToolsOpen(false);
        setMyFunctionsOpen(false);
        break;
      }
      case "Tools": {
        setToolsOpen(!toolsOpen);
        setMemberOpen(false);
        setMyFunctionsOpen(false);
        break;
      }
      case "Meine Funktionen": {
        setMyFunctionsOpen(!myFunctionsOpen);
        setMemberOpen(false);
        setToolsOpen(false);
        break;
      }
    }
  };

  /**
   * Handles the click Event of the nav links
   * @param value topic of the nav link
   */
  const handleNavLinkClick = (pathname: string) => (event: React.MouseEvent) => {
    setMemberOpen(false);
    setToolsOpen(false);
    setMyFunctionsOpen(false);
    setActiveNavLink(pathname);
  };

  /**
   * Handles click on logout link
   */
  const handleLogout: VoidFunction = () => {
    setAuthenticated(false);
    localStorage.clear();
    history.push("/login");
  };

  /**
   * Determines the class for list items
   * @param value the topic of the list item
   */
  const determineListItemClass = (value: string) => {
    // Special case for the collapseable list items: when a sub list item is clicked the parent list item will be also highlighted for better orientation
    switch (value) {
      case "Mitglieder": {
        if (activeNavLink === "/gesamtuebersicht" || activeNavLink === "/vorstand" || activeNavLink === "/geburtstage"
          || activeNavLink === "/traineebereich" || activeNavLink === "/kuratoren") {
          return classes.drawerListItemActive;
        }
        break;
      }
      case "Tools": {
        if (activeNavLink === "/mm-tracking" || activeNavLink === "/pl-qm-tool" || activeNavLink === "/raumreservierung"
          || activeNavLink === "/innovationsmanagement") {
          return classes.drawerListItemActive;
        }
        break;
      }
      case "Meine Funktionen": {
        if (activeNavLink === "user-change-password" || activeNavLink === "/meine-funktionen") {
          return classes.drawerListItemActive;
        }
      }
    }
    // Normal case for list items without collapseable sub list items: When the value and the activeNavLink are equivalent the class of the list item should change
    if (value === activeNavLink) {
      return classes.drawerListItemActive;
    }
    return classes.drawerListItem;
  };

  // The side list, which containts all navigational options
  const sideList = (pathname: string) => (
    <div className={classes.menuDrawer}>
      <div className={classes.avatarSection}>
        {/* Default avatar */}
        <Avatar className={classes.muiAvatarRoot} src={JBTLogoBlack} />
        <div>
          <Typography className={classes.avatarName}>{userName}</Typography>
        </div>
      </div>
      <Divider />
      <List>
        <NavLink exact to="/" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <Dashboard className={determineListItemClass("/")} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NavLink>
        <ListItem button onClick={handleCollpaseClick("Mitglieder")}>
          <ListItemIcon>
            <PeopleAlt className={determineListItemClass("Mitglieder")} />
          </ListItemIcon>
          <ListItemText primary="Mitglieder" className={determineListItemClass("Mitglieder")} />
          {memberOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={memberOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink exact to="/gesamtuebersicht" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Gesamtübersicht" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/ressorts" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Ressorts" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/vorstand" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Der Vorstand" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/geburtstage" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Geburtstage" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/traineebereich" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Traineebereich" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/kuratoren" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Kuratoren" />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>
        <NavLink exact to="/projekte" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <TrendingUp className={determineListItemClass("/projekte")} />
            </ListItemIcon>
            <ListItemText primary="Projekte" />
          </ListItem>
        </NavLink>
        <NavLink exact to="/veranstaltungen" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <Event className={determineListItemClass("/veranstaltungen")} />
            </ListItemIcon>
            <ListItemText primary="Veranstaltungen" />
          </ListItem>
        </NavLink>
        <ListItem button onClick={handleCollpaseClick("Tools")}>
          <ListItemIcon>
            <Build className={determineListItemClass("Tools")} />
          </ListItemIcon>
          <ListItemText primary="Tools" className={determineListItemClass("Tools")} />
          {toolsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink exact to="/mm-tracking" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="MM-Tracking" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/pl-qm-tool" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="PL-QM-Tool" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/raumreservierung" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Raumreservierung" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/innovationsmanagement" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Innovationsmanagement" />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>
        <ListItem button onClick={handleCollpaseClick("Meine Funktionen")}>
          <ListItemIcon>
            <PeopleAlt className={determineListItemClass("Meine Funktionen")} />
          </ListItemIcon>
          <ListItemText primary="Meine Funktionen" className={determineListItemClass("Meine Funktionen")} />
          {myFunctionsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={myFunctionsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink exact to="/meine-funktionen" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Meine Seite" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/user-change-password" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Passwort ändern" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/meine-funktionen" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Lines abonieren" />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>
        <NavLink exact to="/weitere-funktionen" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <MoreHoriz className={determineListItemClass("/weitere-funktionen")} />
            </ListItemIcon>
            <ListItemText primary="Weitere Funktionen" />
          </ListItem>
        </NavLink>
      </List>
      <Divider />
      <List>
        <NavLink exact to="/kvp" className={classes.listItemNavText} activeStyle={{ color: "rgb(246,137,31)", textDecoration: "none" }} onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <EmojiObjects className={determineListItemClass("/kvp")} />
            </ListItemIcon>
            <ListItemText primary="KVP" />
          </ListItem>
        </NavLink>
        <ListItem button onClick={() => { props.drawer(false); handleLogout(); }}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>);

  return sideList(useLocation().pathname);
};

export default MenuDrawer;