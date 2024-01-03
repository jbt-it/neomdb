import React from "react";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";

const TraineeSectionSkeleton = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Skeleton variant="rectangular" width={"70%"} height={50} sx={{ mt: 1, mb: 3 }} />
      <Stack direction={isMobile ? "column" : "row"} spacing={2}>
        <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
        <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
        <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
        <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={300} />
      </Stack>
    </>
  );
};

export default TraineeSectionSkeleton;
