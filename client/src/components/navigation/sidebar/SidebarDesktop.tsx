import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import NavItem from "./NavItem";
import navConfig from "./navConfig";

const SidebarDesktop = () => {
  const [openMitglieder, setOpenMitglieder] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const [openKvp, setOpenKvp] = useState(false);

  const handleOpenMitglieder = () => {
    setOpenMitglieder(!openMitglieder);
    if (openTools) {
      setOpenTools(false);
    }
    if (openEvents) {
      setOpenEvents(false);
    }
    if (openProjects) {
      setOpenProjects(false);
    }
    if (openKvp) {
      setOpenKvp(false);
    }
  };

  const handleOpenTools = () => {
    setOpenTools(!openTools);
    if (openMitglieder) {
      setOpenMitglieder(false);
    }
    if (openEvents) {
      setOpenEvents(false);
    }
    if (openProjects) {
      setOpenProjects(false);
    }
    if (openKvp) {
      setOpenKvp(false);
    }
  };

  const handleOpenEvents = () => {
    setOpenEvents(!openEvents);
    if (openMitglieder) {
      setOpenMitglieder(false);
    }
    if (openTools) {
      setOpenTools(false);
    }
    if (openProjects) {
      setOpenProjects(false);
    }
    if (openKvp) {
      setOpenKvp(false);
    }
  };

  const handleOpenProjects = () => {
    setOpenProjects(!openProjects);
    if (openKvp) {
      setOpenKvp(false);
    }
    if (openMitglieder) {
      setOpenMitglieder(false);
    }
    if (openTools) {
      setOpenTools(false);
    }
    if (openEvents) {
      setOpenEvents(false);
    }
  };

  const handleOpenKvp = () => {
    setOpenKvp(!openKvp);
    if (openProjects) {
      setOpenProjects(false);
    }
    if (openMitglieder) {
      setOpenMitglieder(false);
    }
    if (openTools) {
      setOpenTools(false);
    }
    if (openEvents) {
      setOpenEvents(false);
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: "100%",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        position: "fixed",
        overflowY: "auto",
      }}
    >
      <Stack component="nav" spacing={0.5} sx={{ px: 2, mt: 2 }}>
        {navConfig.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            openItem={
              item.title === "Mitglieder"
                ? openMitglieder
                : item.title === "Tools"
                ? openTools
                : item.title === "Veranstaltungen"
                ? openEvents
                : item.title === "Projekte"
                ? openProjects
                : item.title === "KVP"
                ? openKvp
                : undefined
            }
            setOpenItem={
              item.title === "Mitglieder"
                ? handleOpenMitglieder
                : item.title === "Tools"
                ? handleOpenTools
                : item.title === "Veranstaltungen"
                ? handleOpenEvents
                : item.title === "Projekte"
                ? handleOpenProjects
                : item.title === "KVP"
                ? handleOpenKvp
                : undefined
            }
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SidebarDesktop;
