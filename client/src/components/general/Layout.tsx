import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../navigation/Navbar";
import ScrollTopBtn from "../navigation/ScrollTopBtn";
import PageBreadCrumbs from "../navigation/PageBreadCrumbs";
import useResponsive from "../../hooks/useResponsive";
import SidebarMobile from "../navigation/sidebar/SidebarMobile";
import SidebarDesktop from "../navigation/sidebar/SidebarDesktop";
import usePathname from "../../hooks/usePathname";

/**
 * This component is responsible for rendering the app.
 * It displays the navbar on top and the sidebar on the left.
 * The main content is rendered in the middle which contains the page breadcrumbs and the page content.
 * @returns the app components
 */
const Layout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useResponsive("down", "lg");
  const isDashboard = usePathname() === "/";

  return (
    <>
      <Navbar onOpenDrawer={() => setOpenDrawer(true)} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          height: "100%",
          width: "100%",
          mt: 8,
          zIndex: 1200,
        }}
      >
        {isMobile ? (
          <SidebarMobile
            openDrawer={openDrawer}
            onCloseDrawer={() => setOpenDrawer(false)}
            onOpenDrawer={() => setOpenDrawer(true)}
          />
        ) : (
          <SidebarDesktop />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 1,
            display: "flex",
            flexDirection: "column",
            ml: { xs: 0, lg: "280px" },
            pr: { xs: 0, lg: 2 },
            pl: { xs: 0, lg: 2 },
          }}
        >
          {isDashboard ? null : (
            <Box
              sx={{
                position: "fixed",
                bgcolor: "white",
                zIndex: 800,
                width: 1,
                ml: isMobile ? -1 : -1.9,
                pl: isMobile ? 0 : 2,
                mt: isMobile ? -1 : 0,
              }}
            >
              <PageBreadCrumbs />
            </Box>
          )}
          <Box sx={{ ml: isMobile ? 0 : 1, mr: isMobile ? 0 : 1, paddingTop: isDashboard ? 0 : isMobile ? 7 : 5 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <ScrollTopBtn />
    </>
  );
};

export default Layout;
