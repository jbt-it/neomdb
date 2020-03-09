import React from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import EventIcon from "@material-ui/icons/Event";
import BuildIcon from "@material-ui/icons/Build";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AppsIcon from "@material-ui/icons/Apps";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

// Interface for the drawer icon props
interface MenuDrawerIconProps {
    listItemTopic: string;
    className: string;
}

/**
 * Returns the icon corresponding to the list item topic
 *
 * @param props
 */
const MenuDrawerIcon: React.FunctionComponent<MenuDrawerIconProps> = (props:MenuDrawerIconProps) => {
    switch (props.listItemTopic){
        case "Dashboard" : {
            return <DashboardIcon className={props.className}/>;
        }
        case "Mitglieder" : {
            return <PeopleAltIcon className={props.className}/>;
        }
        case "Projekte" : {
            return <TrendingUpIcon className={props.className}/>;
        }
        case "Veranstaltungen" : {
            return <EventIcon className={props.className}/>;
        }
        case "Tools" : {
            return <BuildIcon className={props.className}/>;
        }
        case "Meine Funktionen" : {
            return <AppsIcon className={props.className}/>;
        }
        case "Weitere Funktionen" : {
            return <MoreHorizIcon className={props.className}/>;
        }
        case "KVP" : {
            return <EmojiObjectsIcon className={props.className}/>;
        }
        case "Logout" : {
            return <ExitToAppIcon className={props.className}/>;
        }
    }
    return null;
};

export default MenuDrawerIcon;