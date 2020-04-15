// The MenuDrawer-Component displays a drawer with navigation-options.

import React, {
  useState,
  useEffect
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
import JBTLogoBlack from "../../../images/jbt-logo-black.png";

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
      const location = useLocation();
      const history = useHistory();

      useEffect(() => {
        setActiveNavLink(location.pathname);
      }, [location.pathname]);

      const [activeNavLink, setActiveNavLink] = useState("");
      const [memberOpen, setMemberOpen] = useState(false);
      const [toolsOpen, setToolsOpen] = useState(false);


      /**
       * Handles the click event on the different extendable list items
       * @param value topic of the extendable list item
       */
      const handleCollpaseClick = (value: string) => (event: React.MouseEvent) =>  {
        switch (value){
          case "Mitglieder" : {
            setMemberOpen(!memberOpen);
            setToolsOpen(false);
            break;
          }
          case "Tools" : {
            setToolsOpen(!toolsOpen);
            setMemberOpen(false);
            break;
          }
        }
      };

      /**
       * Handles the click Event of the nav links
       * @param value topic of the nav link
       */
      const handleNavLinkClick = (pathname:string) => (event: React.MouseEvent) => {
        setMemberOpen(false);
        setToolsOpen(false);
        setActiveNavLink(pathname);
      };

      /**
       * Handles click on logout link
       */
      const handleLogout: VoidFunction = () => {
        localStorage.clear();
        history.push("/login");
      };

      /**
       * Determines the class for list items
       * @param value the topic of the list item
       */
      const determineListItemClass = (value:string) => {
        // Special case for the collapseable list items: when a sub list item is clicked the parent list item will be also highlighted for better orientation
        switch (value) {
          case "Mitglieder" : {
            if (activeNavLink === "/gesamtuebersicht" || activeNavLink === "/vorstand" || activeNavLink === "/geburtstage"
              || activeNavLink === "/traineebereich" || activeNavLink === "/kuratoren") {
                return "drawer-list-item-active";
            }
            break;
          }
          case "Tools" : {
            if (activeNavLink === "/mm-tracking" || activeNavLink === "/pl-qm-tool" || activeNavLink === "/raumreservierung"
              || activeNavLink === "/innovationsmanagement") {
                return "drawer-list-item-active";
            }
            break;
          }
        }
        // Normal case for list items without collapseable sub list items: When the value and the activeNavLink are equivalent the class of the list item should change
        if(value === activeNavLink){
          return "drawer-list-item-active";
        }
        return "drawer-list-item";
      };

      // The side list, which containts all navigational options
      const sideList = (pathname:string) => (
        <div className="menu-drawer">
          <div className="avatar-section">
            {/* Default avatar */}
            <Avatar src={JBTLogoBlack}/>
            <div className="avatar-info">
              <Typography className="avatar-name">Lennart Rukower</Typography>
            </div>
          </div>
          <Divider/>
          <List>
            <NavLink exact to="/" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                    <Dashboard className={determineListItemClass("/")} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </NavLink>
            <ListItem button onClick={handleCollpaseClick("Mitglieder")}>
              <ListItemIcon>
                <PeopleAlt className={determineListItemClass("Mitglieder")}/>
              </ListItemIcon>
              <ListItemText primary="Mitglieder" className={determineListItemClass("Mitglieder")} />
              {memberOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={memberOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavLink exact to="/gesamtuebersicht" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Gesamtübersicht" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/vorstand" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Der Vorstand" />
                      </ListItem>
                </NavLink>
                <NavLink exact to="/geburtstage" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Geburtstage" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/traineebereich" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Traineebereich" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/kuratoren" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Kuratoren" />
                  </ListItem>
                </NavLink>
              </List>
            </Collapse>
            <NavLink exact to="/projekte" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <TrendingUp className={determineListItemClass("/projekte")} />
                </ListItemIcon>
                <ListItemText primary="Projekte" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/veranstaltungen" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <Event className={determineListItemClass("/veranstaltungen")} />
                </ListItemIcon>
                <ListItemText primary="Veranstaltungen" />
              </ListItem>
            </NavLink>
            <ListItem button onClick={handleCollpaseClick("Tools")}>
              <ListItemIcon>
                <Build className={determineListItemClass("Tools")}/>
              </ListItemIcon>
              <ListItemText primary="Tools" className={determineListItemClass("Tools")} />
              {toolsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavLink exact to="/mm-tracking" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="MM-Tracking" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/pl-qm-tool" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="PL-QM-Tool" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/raumreservierung" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Raumreservierung" />
                  </ListItem>
                </NavLink>
                <NavLink exact to="/innovationsmanagement" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                  <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary="Innovationsmanagement" />
                  </ListItem>
                </NavLink>
              </List>
            </Collapse>
            <NavLink exact to="/meine-funktionen" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <Apps className={determineListItemClass("/meine-funktionen")} />
                </ListItemIcon>
                <ListItemText primary="Meine Funktionen" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/weitere-funktionen" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <MoreHoriz className={determineListItemClass("/weitere-funktionen")} />
                </ListItemIcon>
                <ListItemText primary="Weitere Funktionen" />
              </ListItem>
            </NavLink>
          </List>
          <Divider/>
          <List>
            <NavLink exact to="/kvp" className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <EmojiObjects className={determineListItemClass("/kvp")}/>
                </ListItemIcon>
                <ListItemText primary="KVP" />
              </ListItem>
            </NavLink>
            <ListItem button onClick={() => {props.drawer(false); handleLogout();}}>
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