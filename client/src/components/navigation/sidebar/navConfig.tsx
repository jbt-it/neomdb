import {
  Build,
  Dashboard,
  EmojiObjects,
  Event,
  MoreHoriz,
  PeopleAlt,
  SvgIconComponent,
  TrendingUp,
  SmsFailed,
} from "@mui/icons-material";

interface NavItem {
  title: string;
  path?: string;
  icon: SvgIconComponent;
  children?: {
    title: string;
    path: string;
    permissions?: number[];
  }[];
}

export const getIconByName = (name: string) => {
  switch (name) {
    case "Dashboard":
      return Dashboard;
    case "PeopleAlt":
      return PeopleAlt;
    case "Event":
      return Event;
    case "Build":
      return Build;
    case "MoreHoriz":
      return MoreHoriz;
    case "EmojiObjects":
      return EmojiObjects;
    case "SmsFailed":
      return SmsFailed;
    case "TrendingUp":
      return TrendingUp;
    default:
      throw new Error(`Invalid icon name: ${name}`);
  }
};

/**
 * This config provides the navigation structure for the sidebar.
 * Each item has a title, a path, an icon and optionally children.
 * The children are rendered as a collapsible list.
 * The permissions are used to determine whether the user has access to the item.
 * @returns the navigation config
 */
const navConfig: NavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: getIconByName("Dashboard"),
  },
  {
    title: "Mitglieder",
    path: "/gesamtuebersicht",
    icon: getIconByName("PeopleAlt"),
    children: [
      {
        title: "Gesamtübersicht",
        path: "/gesamtuebersicht",
      },
      {
        title: "Der Vorstand",
        path: "/vorstand",
      },
      {
        title: "Ressorts",
        path: "/ressorts",
      },
      {
        title: "Ewiger Vorstand",
        path: "/ewigervorstand",
      },
      {
        title: "Geburtstage",
        path: "/geburtstage",
      },
      {
        title: "Traineebereich",
        path: "/traineebereich",
      },
      {
        title: "Kuratoren",
        path: "/kuratoren",
      },
      {
        title: "Berechtigungen",
        path: "/berechtigungen",
        permissions: [],
      },
    ],
  },
  {
    title: "Projekte",
    path: "/projekte",
    icon: getIconByName("TrendingUp"),
  },
  {
    title: "Veranstaltungen",
    path: "/veranstaltungen",
    icon: getIconByName("Event"),
    children: [
      {
        title: "Veranstatlungen",
        path: "/veranstaltungen",
      },
      {
        title: "Workshops",
        path: "/workshops",
      },
    ],
  },

  {
    title: "Tools",
    icon: getIconByName("Build"),
    children: [
      {
        title: "MM-Tracking",
        path: "/mm-tracking",
      },
      {
        title: "PL-QM-Tool",
        path: "/pl-qm-tool",
      },
      {
        title: "Innovationsmanagement",
        path: "/innovationsmanagement",
      },
      {
        title: "Finanzen",
        path: "/finanzuebersicht",
        permissions: [6],
      },
    ],
  },
  {
    title: "KVP",
    icon: getIconByName("EmojiObjects"),
    children: [
      {
        title: "Inhaltlichen Fehler melden",
        path: "/kvp",
      },
      {
        title: "Technischen Fehler melden",
        path: "https://forms.office.com/pages/responsepage.aspx?id=_7TXIgm-7kCaERenSbp0P_I7vsEb5hhMl2MPDUYXP5FUN0NWNDRERjZTWlA4WlRMNzhXTVYxODFMMSQlQCN0PWcu&route=shorturl",
      },
    ],
  },
  {
    title: "Compliance",
    path: "/compliance",
    icon: getIconByName("SmsFailed"),
  },
];

export default navConfig;
