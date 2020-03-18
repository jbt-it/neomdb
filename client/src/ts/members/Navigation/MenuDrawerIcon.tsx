import React from "react";
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
            return <Dashboard className={props.className}/>;
        }
        case "Mitglieder" : {
            return <PeopleAlt className={props.className}/>;
        }
        case "Projekte" : {
            return <TrendingUp className={props.className}/>;
        }
        case "Veranstaltungen" : {
            return <Event className={props.className}/>;
        }
        case "Tools" : {
            return <Build className={props.className}/>;
        }
        case "Meine Funktionen" : {
            return <Apps className={props.className}/>;
        }
        case "Weitere Funktionen" : {
            return <MoreHoriz className={props.className}/>;
        }
        case "KVP" : {
            return <EmojiObjects className={props.className}/>;
        }
        case "Logout" : {
            return <ExitToApp className={props.className}/>;
        }
    }
    return null;
};

export default MenuDrawerIcon;