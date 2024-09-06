import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";

/**
 * Theoretical knowledge step of the project application form
 * @returns the respective theoretical knowledge step of the project application form
 */
const WorkExperienceStep = () => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={5} flex={1}>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Praktika:</Typography>
          <TextField variant="outlined" size="small" multiline minRows={3} />
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Ausbildung:</Typography>
          <TextField variant="outlined" size="small" multiline minRows={3} />
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Werkstudententätigkeit:</Typography>
          <TextField variant="outlined" size="small" multiline minRows={3} />
        </Stack>
      </Stack>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Typography fontWeight={"bold"}>Vorschläge:</Typography>
        <Typography fontWeight={"bold"}>Vorschläge</Typography>
      </Stack>
    </Stack>
  );
};

export default WorkExperienceStep;
