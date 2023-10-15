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
export default function LayoutTest() {
  const [openDrawer, setOpenDrawer] = useState(false);

  //render pagebar outside of the main content but instead at the bottom of the page
  return (
    <>
      <Navbar onOpenDrawer={() => setOpenDrawer(true)} />
      <Grid
        container
        spacing={1}
        direction={"row"}
        wrap="nowrap"
        sx={{
          mt: 9,
        }}
      >
        <Grid item>
          <Sidebar
            openDrawer={openDrawer}
            onCloseDrawer={() => setOpenDrawer(false)}
            onOpenDrawer={() => setOpenDrawer(true)}
          />
        </Grid>
        <Grid item xs>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minHeight: 1,
              display: "flex",
              flexDirection: "column",
              pl: 1,
              pr: 3,
            }}
          >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
      <ScrollTopBtn />
    </>
  );
}
