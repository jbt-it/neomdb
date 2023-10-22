import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";
import ScrollTopBtn from "../navigation/ScrollTopBtn";

/**
 * This component is responsible for rendering the app.
 * It displays the navbar on top and the sidebar on the left.
 * The main content is rendered in the middle.
 * @returns the app components
 */
const Layout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  //render pagebar outside of the main content but instead at the bottom of the page
  return (
    <>
      <Navbar onOpenDrawer={() => setOpenDrawer(true)} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          height: "100%",
          width: "100%",
          mt: 9,
        }}
      >
        <Sidebar
          openDrawer={openDrawer}
          onCloseDrawer={() => setOpenDrawer(false)}
          onOpenDrawer={() => setOpenDrawer(true)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 1,
            display: "flex",
            flexDirection: "column",
            pl: { xs: 0, lg: 1 },
            pr: { xs: 2, lg: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <ScrollTopBtn />
    </>
  );
};

export default Layout;
