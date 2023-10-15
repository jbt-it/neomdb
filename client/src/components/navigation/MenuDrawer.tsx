// The MenuDrawer-Component displays a drawer with navigation-options.

import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Avatar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Theme,
  styled,
} from "@mui/material";
import {
  Dashboard,
  PeopleAlt,
  Event,
  Build,
  MoreHoriz,
  EmojiObjects,
  ExitToApp,
  TrendingUp,
} from "@mui/icons-material";
import { makeStyles, createStyles } from "@mui/styles";
import JBTLogoBlack from "../../assets/jbt-logo-black.png";
import api from "../../utils/api";
import { authReducerActionType } from "../../types/globalTypes";
import { useAuth } from "../../hooks/useAuth";

/**
 * Function which proivdes the styles of the MenuDrawer
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuDrawer: {
      width: "280px",
    },
    avatarSection: {
      [theme.breakpoints.down("xl")]: {
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
    subListItem: {
      marginLeft: theme.spacing(8),
    },
    drawerListItemActive: {
      color: theme.palette.primary.main,
    },
    drawerListItem: {
      color: "inherit",
    },
  })
);

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: "black",
  textDecoration: "none",
  "&.active": {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
}));

// Interface for the drawer props
interface DrawerProps {
  drawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

/**
 * A drawer which enters from the left and depicts various options for navigation
 * @param props
 */
const MenuDrawer: React.FunctionComponent<DrawerProps> = (props: DrawerProps) => {
  const { auth, dispatchAuth } = useAuth();
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

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
  const handleCollpaseClick = (value: string) => () => {
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
  const handleNavLinkClick = (pathname: string) => () => {
    setMemberOpen(false);
    setToolsOpen(false);
    setMyFunctionsOpen(false);
    setActiveNavLink(pathname);
  };

  /**
   * Handles click on logout link
   */
  const handleLogout: VoidFunction = () => {
    api.post("/auth/logout").then(() => {
      navigate("/login");
      dispatchAuth({ type: authReducerActionType.deauthenticate });
    });
  };

  /**
   * Determines the class for list items
   * @param value the topic of the list item
   */
  const determineListItemClass = (value: string) => {
    // Special case for the collapseable list items: when a sub list item is clicked the parent list item will be also highlighted for better orientation
    switch (value) {
      case "Mitglieder": {
        if (
          activeNavLink === "/gesamtuebersicht" ||
          activeNavLink === "/vorstand" ||
          activeNavLink === "/geburtstage" ||
          activeNavLink === "/traineebereich" ||
          activeNavLink === "/kuratoren" ||
          activeNavLink === "/berechtigungen"
        ) {
          return classes.drawerListItemActive;
        }
        break;
      }
      case "Tools": {
        if (
          activeNavLink === "/mm-tracking" ||
          activeNavLink === "/pl-qm-tool" ||
          activeNavLink === "/raumreservierung" ||
          activeNavLink === "/innovationsmanagement"
        ) {
          return classes.drawerListItemActive;
        }
        break;
      }
      case "Meine Funktionen": {
        if (
          activeNavLink === "/user-change-password" ||
          activeNavLink === "/meine-funktionen" ||
          activeNavLink === `/gesamtuebersicht/${auth.userID}`
        ) {
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
          <Typography className={classes.avatarName}>{auth.userName}</Typography>
        </div>
      </div>
      <Divider />
      <List>
        <StyledNavLink to="/" onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <Dashboard className={determineListItemClass("/")} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </StyledNavLink>
        <ListItem button onClick={handleCollpaseClick("Mitglieder")}>
          <ListItemIcon>
            <PeopleAlt className={determineListItemClass("Mitglieder")} />
          </ListItemIcon>
          <ListItemText primary="Mitglieder" className={determineListItemClass("Mitglieder")} />
          {memberOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={memberOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/gesamtuebersicht" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Gesamtübersicht" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/vorstand" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Der Vorstand" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/ressorts" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Ressorts" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/vorstand" onClick={handleNavLinkClick(pathname)}></StyledNavLink>
            <StyledNavLink to="/ewigervorstand" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Ewiger Vorstand" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/geburtstage" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Geburtstage" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/traineebereich" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Traineebereich" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/kuratoren" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Kuratoren" />
              </ListItem>
            </StyledNavLink>
            {auth.permissions.length > 0 ? (
              <StyledNavLink to="/berechtigungen" onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                  <ListItemText className={classes.subListItem} primary="Berechtigungen" />
                </ListItem>
              </StyledNavLink>
            ) : null}
          </List>
        </Collapse>
        <StyledNavLink to="/projekte" onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <TrendingUp className={determineListItemClass("/projekte")} />
            </ListItemIcon>
            <ListItemText primary="Projekte" />
          </ListItem>
        </StyledNavLink>
        <StyledNavLink to="/veranstaltungen" onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <Event className={determineListItemClass("/veranstaltungen")} />
            </ListItemIcon>
            <ListItemText primary="Veranstaltungen" />
          </ListItem>
        </StyledNavLink>
        <ListItem button onClick={handleCollpaseClick("Tools")}>
          <ListItemIcon>
            <Build className={determineListItemClass("Tools")} />
          </ListItemIcon>
          <ListItemText primary="Tools" className={determineListItemClass("Tools")} />
          {toolsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <StyledNavLink to="/mm-tracking" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="MM-Tracking" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/pl-qm-tool" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="PL-QM-Tool" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/raumreservierung" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Raumreservierung" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/innovationsmanagement" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Innovationsmanagement" />
              </ListItem>
            </StyledNavLink>
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
            <StyledNavLink to={`/gesamtuebersicht/${auth.userID}`} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Meine Seite" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/user-change-password" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Passwort ändern" />
              </ListItem>
            </StyledNavLink>
            <StyledNavLink to="/meine-funktionen" onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemText className={classes.subListItem} primary="Lines abonieren" />
              </ListItem>
            </StyledNavLink>
          </List>
        </Collapse>
        <StyledNavLink to="/weitere-funktionen" onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <MoreHoriz className={determineListItemClass("/weitere-funktionen")} />
            </ListItemIcon>
            <ListItemText primary="Weitere Funktionen" />
          </ListItem>
        </StyledNavLink>
      </List>
      <Divider />
      <List>
        <StyledNavLink to="/kvp" onClick={handleNavLinkClick(pathname)}>
          <ListItem button onClick={props.drawer(false)}>
            <ListItemIcon>
              <EmojiObjects className={determineListItemClass("/kvp")} />
            </ListItemIcon>
            <ListItemText primary="KVP" />
          </ListItem>
        </StyledNavLink>
        <ListItem
          button
          onClick={() => {
            props.drawer(false);
            handleLogout();
          }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return sideList(useLocation().pathname);
};

export default MenuDrawer;
