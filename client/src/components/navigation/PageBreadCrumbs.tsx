import React from "react";
import { Breadcrumbs, Link, Typography, Box, Stack, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import { Info } from "@mui/icons-material";

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
};

const PageBreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isMobile = useResponsive("down", "lg");

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
      displayName = "Details Internes Projekt"; // For dynamic event pages under Internes Projekt
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
      <Link key={to} color="inherit" href={to} fontSize={16} style={{ textDecoration: "none" }}>
        {displayName}
      </Link>
    );
  });

  return (
    <Box sx={{ ml: isMobile ? 3 : 1 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" style={{ textDecoration: "none" }}>
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
