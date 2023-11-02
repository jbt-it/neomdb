import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

function LoadingTable() {
  return (
    <Box sx={{ ml: 1 }}>
      <Skeleton sx={{ width: "97%", margin: "auto", height: 100 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
      <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
    </Box>
  );
}

export default LoadingTable;
