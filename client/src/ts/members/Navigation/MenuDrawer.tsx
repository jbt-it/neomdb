import React, {
  useState,
  useEffect
} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  NavLink,
  useLocation
} from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
  Avatar,
  Typography
} from "@material-ui/core";
import MenuDrawerIcon from "./MenuDrawerIcon";

 // Contains all information which should be depicted by the drawer
 const higherDrawerLitItems:{
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
          path: "/EvHistorie"
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
    },
    {
      text: "Projekte",
      path: "/Projekte",
      sublist: []
    },
    {
      text: "Veranstaltungen",
      path: "/Veranstaltungen",
      sublist: []
    },
    {
      text: "Tools",
      path: "",
      sublist: [
          {
              text: "MM-Tracking",
              path: "/MMTracking"
            },
            {
              text: "PL-QM-Tool",
              path: "/PL-QM-Tool"
            },
            {
              text: "Raumreservierung",
              path: "/Raumreservierung"
            },
            {
              text: "Innovationsmanagement",
              path: "/Innovationsmanagement"
            }
      ]
    },
    {
      text: "Meine Funktionen",
      path: "/MeineFunktionen",
      sublist: []
    },
    {
      text: "Weitere Funktionen",
      path: "/WeitereFunktionen",
      sublist: []
    }
  ];

  const lowerDrawerLitItems:{
      text: string;
      path: string;
      sublist: {
        text: string;
        path: string;
      }[];
    }[] = [
      {
        text: "KVP",
        path: "/KVP",
        sublist: []
      },
      {
        text: "Logout",
        path: "/Logout",
        sublist: []
      },
    ];

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
     * Determines the color for text and icons
     *
     * @param value the topic of the nav link
     */
    const determineColor = (value:string) => {
        // Special case for the collapseable list items: when a sub list item is clicked the parent list item will be also highlighted for better orientation
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
      // Normal case for list items without collapseable sub list items: When the value and the activeNavLink are equivalent the color should change
      if(value === activeNavLink){
        return {color: "rgb(246,137,31)"};
      }

      return {color: ""};
    };

    const determineCollapseState = (collapseableListName:string) => {
        if (collapseableListName === "Mitglieder"){
            return memberOpen;
        } else if (collapseableListName === "Tools") {
            return toolsOpen;
        }
        return false;
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
            {
                higherDrawerLitItems.map(drawerListItem => {
                    // When there are no sub list items
                    if(drawerListItem.sublist.length === 0){
                        return (<NavLink exact to={drawerListItem.path} className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                        <ListItem button onClick={props.drawer(false)}>
                            <ListItemIcon>
                                <MenuDrawerIcon listItemTopic={drawerListItem.text} styleObj={determineColor(drawerListItem.path)}/>
                            </ListItemIcon>
                            <ListItemText primary={drawerListItem.text} />
                        </ListItem>
                        </NavLink>);
                    } else { // When there are sub list items
                        return (<div>
                                    <ListItem button onClick={handleCollpaseClick(drawerListItem.text)}>
                                        <ListItemIcon>
                                            <MenuDrawerIcon listItemTopic={drawerListItem.text} styleObj={determineColor(drawerListItem.text)}/>
                                        </ListItemIcon>
                                        <ListItemText primary={drawerListItem.text} style={determineColor(drawerListItem.text)}/>
                                        {determineCollapseState(drawerListItem.text) ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={determineCollapseState(drawerListItem.text)} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {drawerListItem.sublist.map(subListItem => (
                                                <NavLink exact to={subListItem.path} className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                                                <ListItem button onClick={props.drawer(false)}>
                                                    <ListItemText className="subListItem" primary={subListItem.text} />
                                                </ListItem>
                                                </NavLink>
                                            ))}
                                        </List>
                                    </Collapse>
                                </div>
                                );
                    }
                })
            }
    </List>
    <Divider/>
    <List>
        {
            lowerDrawerLitItems.map(drawerListItem => {
                    return (<NavLink exact to={drawerListItem.path} className="listItem" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                    <ListItem button onClick={props.drawer(false)}>
                        <ListItemIcon>
                            <MenuDrawerIcon listItemTopic={drawerListItem.text} styleObj={determineColor(drawerListItem.path)}/>
                        </ListItemIcon>
                        <ListItemText primary={drawerListItem.text} />
                    </ListItem>
                    </NavLink>);
                }
            )
        }
    </List>
    </div>);

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