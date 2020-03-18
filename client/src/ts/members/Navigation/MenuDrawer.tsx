import React, {
  useState,
  useEffect
} from "react";
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
import JBTLogoBlack from "../../../images/jbt-logo-black.png";

 // Contains the main items which should be depicted by the drawer
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

  // Contains the secondary items which should be depicted by the drawer
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
    drawer: (open: boolean) => (
            event: React.KeyboardEvent | React.MouseEvent
            ) => void;
  }

  /**
   * A drawer which enters from the left and depicts various options for navigation
   *
   * @param props
   */
  const MenuDrawer: React.FunctionComponent<DrawerProps> = (props: DrawerProps) => {

    useEffect(() => {
      const url = window.location.href;
      setActiveNavLink(url.slice(url.lastIndexOf("/"),url.length));
    });

    const [activeNavLink, setActiveNavLink] = useState("");
    const [memberOpen, setMemberOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);


    /**
     * Handles the click event on the different extendable list items
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
     * Handles the click Event of the nav links
     *
     * @param value topic of the nav link
     */
    const handleNavLinkClick = (pathname:string) => (event: React.MouseEvent) => {
      setMemberOpen(false);
      setToolsOpen(false);
      setActiveNavLink(pathname);
    };

    /**
     * Determines the class for list items
     *
     * @param value the topic of the list item
     */
    const determineListItemClass = (value:string) => {
        // Special case for the collapseable list items: when a sub list item is clicked the parent list item will be also highlighted for better orientation
        switch (value) {
            case "Mitglieder" : {
              if (activeNavLink === "/Mitglieder" || activeNavLink === "/Vorstand" || activeNavLink === "/EvHistorie"
                || activeNavLink === "/Expertenwissen" || activeNavLink === "/Geburtstage" || activeNavLink === "/Generationenbeauftragte"
                || activeNavLink === "/Traineebereich" || activeNavLink === "/Kuratoren") {
                  return "drawer-list-item-active";
              }
              break;
            }
            case "Tools" : {
              if (activeNavLink === "/MMTracking" || activeNavLink === "/PL-QM-Tool" || activeNavLink === "/Raumreservierung"
                || activeNavLink === "/Innovationsmanagement") {
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

    /**
     * Determines whether a collapsable list item should be collapsed or not
     *
     * @param collapseableListName the name of the collapseable list item
     */
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
            {
                higherDrawerLitItems.map(drawerListItem => {
                    // When there are no sub list items
                    if(drawerListItem.sublist.length === 0){
                        return (<NavLink key={drawerListItem.text} exact to={drawerListItem.path} className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                        <ListItem button onClick={props.drawer(false)}>
                            <ListItemIcon>
                                <MenuDrawerIcon listItemTopic={drawerListItem.text} className={determineListItemClass(drawerListItem.path)} />
                            </ListItemIcon>
                            <ListItemText primary={drawerListItem.text} />
                        </ListItem>
                        </NavLink>);
                    } else { // When there are sub list items
                        return (<div key={drawerListItem.text}>
                                    <ListItem button onClick={handleCollpaseClick(drawerListItem.text)}>
                                        <ListItemIcon>
                                            <MenuDrawerIcon listItemTopic={drawerListItem.text} className={determineListItemClass(drawerListItem.text)}/>
                                        </ListItemIcon>
                                        <ListItemText primary={drawerListItem.text} className={determineListItemClass(drawerListItem.text)} />
                                        {determineCollapseState(drawerListItem.text) ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={determineCollapseState(drawerListItem.text)} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {drawerListItem.sublist.map(subListItem => (
                                                <NavLink key={subListItem.text}exact to={subListItem.path} className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
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
                    return (<NavLink key={drawerListItem.text} exact to={drawerListItem.path} className="list-item-nav-text" activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick(pathname)}>
                    <ListItem button onClick={props.drawer(false)}>
                        <ListItemIcon>
                            <MenuDrawerIcon listItemTopic={drawerListItem.text} className={determineListItemClass(drawerListItem.path)}/>
                        </ListItemIcon>
                        <ListItemText primary={drawerListItem.text} />
                    </ListItem>
                    </NavLink>);
                }
            )
        }
    </List>
    </div>);

    return sideList(useLocation().pathname);

  };

  export default MenuDrawer;