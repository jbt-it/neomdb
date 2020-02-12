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
    makeStyles
  } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => createStyles({
    list: {
        width: 250
      },
      listItem: {
        color: "black",
        textDecoration: "none"
      },
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
            <NavLink exact to="/" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>
          <ListItem button onClick={handleClick("Mitglieder")}>
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="Mitglieder" />
            {memberOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={memberOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink exact to="/Mitglieder" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
              <ListItem button onClick={props.drawer(false)}>
                  <ListItemText primary={"Gesamtübersicht"} />
              </ListItem>
              </NavLink>
              <NavLink exact to="/Vorstand" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText primary={"Der Vorstand"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/EvHistorie" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText primary={"Ewige EV-Liste"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Expertenwissen" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText primary={"Expertenwissen"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Geburtstage" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText primary={"Geburtstage"} />
                </ListItem>
              </NavLink>
              <NavLink exact to="/Generationenbeauftragte" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                <ListItem button onClick={props.drawer(false)}>
                    <ListItemText primary={"Generationenbeauftragte"} />          
                </ListItem>
              </NavLink>
              <ListItem button onClick={props.drawer(false)}>
                <NavLink exact to="/Traineebereich" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                  <ListItemText primary={"Traineebereich"} />
                </NavLink>
              </ListItem>
              <ListItem button onClick={props.drawer(false)}>
                <NavLink exact to="/Kuratoren" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
                  <ListItemText primary={"Kuratoren"} />
                </NavLink>
              </ListItem>
            </List>
          </Collapse>
          <NavLink exact to="/Projekte" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary={"Projekte"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/Veranstaltungen" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <EventIcon />
                </ListItemIcon>
                <ListItemText primary={"Veranstaltungen"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/Tools" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <BuildIcon />
                </ListItemIcon>
                <ListItemText primary={"Tools"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/MeineFunktionen" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <AppsIcon />
                </ListItemIcon>
                <ListItemText primary={"Meine Funktionen"} />
            </ListItem>
          </NavLink>
          <NavLink exact to="/WeitereFunktionen" className={classes.listItem} activeStyle={{color:"orange", textDecoration:"none"}}>
            <ListItem button onClick={props.drawer(false)}>
                <ListItemIcon>
                <MoreHorizIcon />
                </ListItemIcon>
                <ListItemText primary={"Weitere Funktionen"} />
            </ListItem>
          </NavLink>
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

  export default MenuDrawer;