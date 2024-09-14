import React, { useState } from "react";
import { SwipeableDrawer, Box, Avatar, Typography, Divider } from "@mui/material";
import JBTLogo from "../../../assets/jbt-logo.svg";
import navConfig from "./navConfig";
import NavItem from "./NavItem";

interface SidebarMobileProps {
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

const SidebarMobile = ({ openDrawer, onCloseDrawer, onOpenDrawer }: SidebarMobileProps) => {
  const [openMitglieder, setOpenMitglieder] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openEvents, setOpenEvents] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

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
  };
  const handleOpenProjects = () => {
    setOpenProjects(!openProjects);
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
    <SwipeableDrawer
      open={openDrawer}
      onClose={onCloseDrawer}
      onOpen={onOpenDrawer}
      PaperProps={{
        sx: { width: 280 },
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 2.5,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Avatar src={JBTLogo} alt="JBT Logo" />
        <Typography ml={2} variant="h6" color={"text.secondary"}>
          neoMDB
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2 }}>
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
                : undefined
            }
          />
        ))}
      </Box>
    </SwipeableDrawer>
  );
};

export default SidebarMobile;
