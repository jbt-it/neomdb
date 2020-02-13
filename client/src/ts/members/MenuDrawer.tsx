import React, { useState } from "react";
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
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import {NavLink} from 'react-router-dom';
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
    createStyles,
    Theme,
    makeStyles,
    } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => createStyles({
    list: {
        width: 300
      },
      listItem: {
        color: "black",
        textDecoration: "none"
      },
      subListItemText: {
        marginLeft: 65,
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
  const MenuDrawer:React.FunctionComponent<DrawerProps> = (props: DrawerProps) => {
    const classes = useStyles();
  
    const [activeNavLink, setActiveNavLink] = useState("");
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
    }
  
    /**
     * handles the click Event of the nav links 
     * 
     * @param value topic of the nav link
     */
    const handleNavLinkClick = (value:string) => (event: React.MouseEvent) => {
      setMemberOpen(false);
      setToolsOpen(false);
      setActiveNavLink(value);
    }

    /**
     * determines the color for text and icons 
     * 
     * @param value the topic of the nav link
     */
    const determineIconColor = (value:string) => {
      // when the value and the activeNavLink are equivalent then the color of should change
      if(value === activeNavLink){
        return {color: "rgb(246,137,31)"};
      }
    }

    // the side list, which containts all navigational options
    const sideList = () => (
      <div className={classes.list}>
        <List>
            <NavLink exact to="/" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Dashboard")}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                  <DashboardIcon style={determineIconColor("Dashboard")}/>
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
            <NavLink exact to="/Mitglieder" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
              <ListItem button onClick={props.drawer(false)}>
                  <ListItemText className={classes.subListItemText} primary={"Gesamtübersicht"} />
              </ListItem>
              </NavLink>
              <NavLink exact to="/Vorstand" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Der Vorstand"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/EvHistorie" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Ewige EV-Liste"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Expertenwissen" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Expertenwissen"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Geburtstage" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Geburtstage"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Generationenbeauftragte" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Generationenbeauftragte"} />          
                </ListItem>
              </NavLink>
              <NavLink exact to="/Traineebereich" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Mitglieder")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Traineebereich"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Kuratoren" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Kuratoren")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Kuratoren"} />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
          <NavLink exact to="/Projekte" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Projekte")}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <TrendingUpIcon style={determineIconColor("Projekte")}/>
                </ListItemIcon>
                <ListItemText primary={"Projekte"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/Veranstaltungen" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Veranstaltungen")}> 
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <EventIcon style={determineIconColor("Veranstaltungen")}/>
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
            <NavLink exact to="/MMTracking" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Tools")}>
              <ListItem button onClick={props.drawer(false)}>
                  <ListItemText className={classes.subListItemText} primary={"MM-Tracking"} />
              </ListItem>
              </NavLink>
              <NavLink exact to="/PL-QM-Tool" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Tools")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"PL-/QM-Tool"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Raumreservierung" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Tools")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Raumreservierung"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Innovationsmanagement" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("Tools")}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText className={classes.subListItemText} primary={"Innovationsmanagement"} />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
          <NavLink exact to="/MeineFunktionen" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("MeineFunktionen")}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <AppsIcon style={determineIconColor("MeineFunktionen")}/>
                </ListItemIcon>
                <ListItemText primary={"Meine Funktionen"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/WeitereFunktionen" className={classes.listItem} activeStyle={{color:"rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("WeitereFunktionen")}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <MoreHorizIcon style={determineIconColor("WeitereFunktionen")}/>
                </ListItemIcon>
                <ListItemText primary={"Weitere Funktionen"} />
            </ListItem>
          </NavLink>
        </List>
        <Divider />
        <List>
          <NavLink exact to="/KVP" className={classes.listItem} activeStyle={{color: "rgb(246,137,31)", textDecoration:"none"}} onClick={handleNavLinkClick("KVP")}>
            <ListItem button onClick={props.drawer(false)}>
              <ListItemIcon>
                <EmojiObjectsIcon style={determineIconColor("KVP")}/>
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
          {sideList()}
        </SwipeableDrawer>
      </div>
    );
  }

  export default MenuDrawer;