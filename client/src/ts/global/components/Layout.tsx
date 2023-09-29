import React from "react";
import Nav from "./navigation/Nav";
import { Outlet } from "react-router-dom";
import { Stack, Box } from "@mui/material";

export default function Layout() {
  return (
    <>
      <Stack direction="row" spacing={1} className={"content-page"}>
        <Box flex={1}>
          <Nav />
        </Box>
        <Box flex={4}>
          <Outlet />
        </Box>
      </Stack>
    </>
  );
}
