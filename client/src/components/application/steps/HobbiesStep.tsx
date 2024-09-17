import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { useApplicationContext } from "../../../context/ApplicationContext";

/**
 * The hobbies step of the application form
 * @returns The component to be rendered for the hobbies step
 */
const HobbiesStep = () => {
  const isMobile = useResponsive("down", "sm");
  const { applicationState, updateApplicationState } = useApplicationContext();

  return (
    <Stack width={"100%"} spacing={6}>
      <Stack spacing={1}>
        <Stack spacing={isMobile ? 0 : -1}>
          <Typography variant="h6" fontWeight={"bold"} fontSize={20}>
            Hobbies
          </Typography>
          <Typography variant="caption">Was für Hobbies hast du? Was machst du in deiner Freizeit?</Typography>
        </Stack>
        <TextField
          variant="outlined"
          fullWidth
          value={applicationState.hobbies}
          onChange={(e) => {
            updateApplicationState("hobbies", e.target.value);
          }}
          size="small"
          multiline
          minRows={6}
        />
      </Stack>
      <Stack spacing={1}>
        <Stack>
          <Typography variant="h6" fontWeight={"bold"} fontSize={20}>
            Zeitliche Verfügbarkeit
          </Typography>
          <Typography variant="caption">
            Wie viel Zeit bist du bereit ins JBT zu investieren?
            <br /> Bitte versuche hier möglichst präzise zu sein; eine ungeführe Zahl (z.B. Stunden pro Woche) wäre
            optimal.
          </Typography>
        </Stack>
        <TextField
          variant="outlined"
          fullWidth
          value={applicationState.timeInvestment}
          onChange={(e) => {
            updateApplicationState("timeInvestment", e.target.value);
          }}
          size="small"
          multiline
          minRows={6}
        />
      </Stack>
    </Stack>
  );
};

export default HobbiesStep;
