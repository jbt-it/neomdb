import React, { useState, useEffect } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
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
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import {NavLink, useLocation} from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { Avatar, Typography } from "@material-ui/core";

   // Interface for the drawer props
   interface DrawerProps {
    open: boolean;
    drawer: Function;
  }

  /**
   * A drawer which enters from the left and depicts various options for navigation
   *
   * @param props
   */
  const MenuDrawer:React.FunctionComponent<DrawerProps> = (props: DrawerProps) => {

    useEffect(() => {
      const url = window.location.href;
      setActiveNavLink(url.slice(url.lastIndexOf("/"),url.length));
  });

    const [activeNavLink, setActiveNavLink] = useState();
    const [memberOpen, setMemberOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);

    const drawerLitItems:{
      text: string;
      path: string;
      sublist: {
        text: string;
        path: string;
      }[];
    }[] = [
      {
        text: "Dashboard",
        path: "/",
        sublist: []
      },
      {
        text: "Mitglieder",
        path: "",
        sublist: [
          {
            text: "Gesamtübersicht",
            path: "/Mitglieder"
          },
          {
            text: "Der Vorstand",
            path: "/Vorstand"
          },
          {
            text: "Ewige EV-Liste",
            path: "/EVHistorie"
          },
          {
            text: "Expertenwissen",
            path: "/Expertenwissen"
          },
          {
            text: "Geburtstage",
            path: "/Geburtstage"
          },
          {
            text: "Generationenbeauftragte",
            path: "/Generationenbeauftragte"
          },
          {
            text: "Traineebereich",
            path: "/Traineebereich"
          },
          {
            text: "Kuratoren",
            path: "/Kuratoren"
          }
        ]
      }
    ];

    /**
     * handles the click event on the different extendable list items
     *
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
     * handles the click Event of the nav links
     *
     * @param value topic of the nav link
     */
    const handleNavLinkClick = (pathname:string) => (event: React.MouseEvent) => {
      setMemberOpen(false);
      setToolsOpen(false);
      setActiveNavLink(pathname);
    };

    /**
     * determines the color for text and icons
     *
     * @param value the topic of the nav link
     */
    const determineIconColor = (value:string) => {
        // Special case for the collapseable menu entries: when a sub menu entry is clicked the parent menu entry will be also highlighted for better orientation
        switch (value) {
            case "Mitglieder" : {
                if (activeNavLink === "/Mitglieder" || activeNavLink === "/Vorstand" || activeNavLink === "/EvHistorie"
                  || activeNavLink === "/Expertenwissen" || activeNavLink === "/Geburtstage" || activeNavLink === "/Generationenbeauftragte"
                  || activeNavLink === "/Traineebereich" || activeNavLink === "/Kuratoren") {
                    return {color: "rgb(246,137,31)"};
                }
                break;
            }
            case "Tools" : {
              if (activeNavLink === "/MMTracking" || activeNavLink === "/PL-QM-Tool" || activeNavLink === "/Raumreservierung"
                || activeNavLink === "/Innovationsmanagement") {
                return {color: "rgb(246,137,31)"};
              }
              break;
            }
        }
      // When the value and the activeNavLink are equivalent the color should change
      if(value === activeNavLink){
        return {color: "rgb(246,137,31)"};
      }
    };

    // The side list, which containts all navigational options
    const sideList = (pathname:string) => (
      <div className="menuDrawer">
        <div className="avatar-section">
          <Avatar/>
          <div className="avatar-info">
            <Typography className="avatar-name">Lennart Rukower</Typography>
            <Typography className="avatar-mail">l.rukower@studentische-bartung.de</Typography>
          </div>
        </div>
        <Divider/>
        <List>
            <NavLink exact to="/" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <DashboardIcon style={determineIconColor("/")}/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>
          <ListItem button onClick={handleCollpaseClick("Mitglieder")}>
            <ListItemIcon>
              <PeopleAltIcon style={determineIconColor("Mitglieder")}/>
            </ListItemIcon>
            <ListItemText primary="Mitglieder" style={determineIconColor("Mitglieder")}/>
            {memberOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={memberOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink exact to="/Mitglieder" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                  <ListItemText className="subListItem" primary={"Gesamtübersicht"} />
              </ListItem>
              </NavLink>
              <NavLink exact to="/Vorstand" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Der Vorstand"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/EvHistorie" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Ewige EV-Liste"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Expertenwissen" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Expertenwissen"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Geburtstage" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Geburtstage"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Generationenbeauftragte" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Generationenbeauftragte"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Traineebereich" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Traineebereich"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Kuratoren" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Kuratoren"} />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
          <NavLink exact to="/Projekte" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <TrendingUpIcon style={determineIconColor("/Projekte")}/>
                </ListItemIcon>
                <ListItemText primary={"Projekte"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/Veranstaltungen" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <EventIcon style={determineIconColor("/Veranstaltungen")}/>
                </ListItemIcon>
                <ListItemText primary={"Veranstaltungen"} />
            </ListItem>
          </NavLink>

          <ListItem button onClick={handleCollpaseClick("Tools")}>
            <ListItemIcon>
             <BuildIcon style={determineIconColor("Tools")}/>
            </ListItemIcon>
            <ListItemText primary="Tools" style={determineIconColor("Tools")}/>
            {memberOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink exact to="/MMTracking" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
              <ListItem button onClick={props.drawer(false)}>
                  <ListItemText className="subListItem" primary={"MM-Tracking"} />
              </ListItem>
              </NavLink>
              <NavLink exact to="/PL-QM-Tool" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"PL-/QM-Tool"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Raumreservierung" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Raumreservierung"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Innovationsmanagement" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className="subListItem" primary={"Innovationsmanagement"} />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
          <NavLink exact to="/MeineFunktionen" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <AppsIcon style={determineIconColor("/MeineFunktionen")}/>
                </ListItemIcon>
                <ListItemText primary={"Meine Funktionen"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/WeitereFunktionen" className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <MoreHorizIcon style={determineIconColor("/WeitereFunktionen")}/>
                </ListItemIcon>
                <ListItemText primary={"Weitere Funktionen"} />
            </ListItem>
          </NavLink>
        </List>
        <Divider />
        <List>
          <NavLink exact to="/KVP" className="listItem" activeStyle={{color: "rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
            <ListItem button onClick={props.drawer(false)}>
              <ListItemIcon>
                <EmojiObjectsIcon style={determineIconColor("/KVP")}/>
              </ListItemIcon>
              <ListItemText primary={"KVP"} />
            </ListItem>
          </NavLink>
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
          {sideList(useLocation().pathname)}
        </SwipeableDrawer>
      </div>
    );
  };

  export default MenuDrawer;