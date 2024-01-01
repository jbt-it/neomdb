import React from "react";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";

const TraineeSectionSkeleton = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={2}>
      <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
      <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
      <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
      <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
    </Stack>
  );
};

export default TraineeSectionSkeleton;
