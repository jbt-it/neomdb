import React from "react";
import { Breadcrumbs, Typography, Box, Stack, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useLocation } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import { Info } from "@mui/icons-material";

/**
 * Static path to name mapping
 */
const staticPathToNameMap: { [key: string]: string } = {
  gesamtuebersicht: "Mitgliederübersicht",
  veranstaltungen: "Veranstaltungen",
  workshops: "Alle Workshops",
  traineebereich: "Traineebereich",
  "internes-projekt": "Internes Projekt",
  ressorts: "Ressorts",
  ewigervorstand: "Ewiger Vorstand",
  berechtigungen: "Berechtigungen",
  vorstand: "Vorstand",
  geburtstage: "Geburtstage",
  kuratoren: "Kuratoren",
  projekte: "Projekte",
  "mm-tracking": "MM-Tracking",
  "pl-qm-tool": "PL-QM-Tool",
  innovationsmanagement: "Innovationsmanagement",
  kvp: "KVP",
  "passwort-aendern": "Passwort ändern",
  feedbackauswertung: "Feedbackauswertung",
  projektausschreibung: "Projektausschreibung",
  finanzuebersicht: "Finanzübersicht",
  jahresbeitrag: "Jahresbeitrag",
  sonstigereinzug: "Sonstiger Einzug",
  wwbeitrag: "Working Weekend Beitrag",
  projektbewerbung: "Projektbewerbung",
  projektbewerbungen: "Projektbewerbungen",
};

/**
 * The PageBreadCrumbs component
 */
const PageBreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isMobile = useResponsive("down", "lg");

  /**
   * Generate the breadcrumb items depending on the pathnames
   * @returns The breadcrumb items
   */
  const breadcrumbItems = pathnames.map((value, index, array) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

    let displayName;
    if (array[0] === "workshops" && value.match(/^\d+$/)) {
      displayName = index === 1 ? "Workshopübersicht" : "Workshopdetails";
    } else if (value.match(/^\d+$/) && array[index - 1] === "gesamtuebersicht") {
      displayName = "Profilseite"; // For dynamic profile pages under Gesamtübersicht
    } else if (value.match(/^\d+$/) && array[index - 1] === "veranstaltungen") {
      displayName = "Veranstaltungsdetails"; // For dynamic event pages under Veranstaltungen
    } else if (value.match(/^\d+$/) && array[index - 1] === "internes-projekt") {
      displayName = "Details Internes Projekt"; // For dynamic ip pages under Internes Projekt
    } else if (value.match(/^\d+$/) && array[index - 1] === "projektbewerbung") {
      displayName = "Externes Projekt"; // For dynamic project pages under Projektbewerbung
    } else if (value.match(/^\d+$/) && array[index - 1] === "projekte") {
      displayName = "Projektdetails"; // For dynamic project pages under Projekte
    } else if (value.match(/^\d+$/) && array[index - 1] === "projektbewerbungen") {
      displayName = "Projektbewerbungsdetails"; // For dynamic project pages under Projektbewerbungen
    } else {
      displayName = staticPathToNameMap[value] || value; // Use mapped name or raw value
    }

    // Return link or text element based on whether it's the last element
    return last ? (
      <Stack direction={"row"} alignItems={"center"}>
        <Typography color="textPrimary" key={to} fontWeight={"bold"} fontSize={16}>
          {displayName}
        </Typography>
        <IconButton sx={{ width: 20, height: 20 }}>
          <Info sx={{ width: 16, height: 16 }} />
        </IconButton>
      </Stack>
    ) : (
      <Link key={to} to={to} style={{ color: "inherit", fontSize: 16, textDecoration: "none" }}>
        {displayName}
      </Link>
    );
  });

  return (
    <Box sx={{ ml: isMobile ? 3 : 1, paddingTop: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        maxItems={isMobile ? 2 : 4}
      >
        <Link color="inherit" to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Typography fontSize={16} color="inherit">
            Dashboard
          </Typography>
        </Link>
        {breadcrumbItems}
      </Breadcrumbs>
    </Box>
  );
};

export default PageBreadCrumbs;
