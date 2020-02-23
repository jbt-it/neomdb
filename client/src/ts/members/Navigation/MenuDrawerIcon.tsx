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
    styleObj: {
        color: string;
    };
}

/**
 * Returns the icon corresponding to the list item topic
 *
 * @param props
 */
const MenuDrawerIcon:React.FunctionComponent<MenuDrawerIconProps> = (props:MenuDrawerIconProps) => {
    switch (props.listItemTopic){
        case "Dashboard" : {
            return <DashboardIcon style={props.styleObj}/>;
            break;
        }
        case "Mitglieder" : {
            return <PeopleAltIcon style={props.styleObj}/>;
            break;
        }
        case "Projekte" : {
            return <TrendingUpIcon style={props.styleObj}/>;
            break;
        }
        case "Veranstaltungen" : {
            return <EventIcon style={props.styleObj}/>;
            break;
        }
        case "Tools" : {
            return <BuildIcon style={props.styleObj}/>;
            break;
        }
        case "Meine Funktionen" : {
            return <AppsIcon style={props.styleObj}/>;
            break;
        }
        case "Weitere Funktionen" : {
            return <MoreHorizIcon style={props.styleObj}/>;
            break;
        }
        case "KVP" : {
            return <EmojiObjectsIcon style={props.styleObj}/>;
            break;
        }
        case "Logout" : {
            return <ExitToAppIcon/>;
        }
    }
    return null;
};

export default MenuDrawerIcon;