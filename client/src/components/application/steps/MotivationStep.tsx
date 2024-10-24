import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useApplicationContext } from "../../../context/ApplicationContext";
/**
 * The motivation step of the application form
 * @returns The component to be rendered for the motivation step
 */
const MotivationStep = () => {
  const { applicationState, applicationErrorState, updateApplicationState } = useApplicationContext();

  return (
    <Stack spacing={1}>
      <Stack>
        <Typography variant="h6" fontWeight={"bold"} fontSize={20}>
          Motivation
        </Typography>
        <Typography variant="caption">
          Dieser Teil soll uns einen ersten Eindruck von deiner Person und deiner Motivation vermitteln. Bitte erzähle
          uns hier in 4-8 Sätzen, was dich motiviert, ein Teil vom Junior Business Team zu werden, und was du von einer
          Mitgliedschaft bei uns erwartest.
        </Typography>
      </Stack>
      <TextField
        variant="outlined"
        fullWidth
        value={applicationState.motivation}
        onChange={(e) => {
          updateApplicationState("motivation", e.target.value);
        }}
        size="small"
        multiline
        minRows={15}
        error={applicationErrorState.motivation}
        helperText={applicationErrorState.motivation ? "Bitte gib deine Motivation an." : ""}
      />
    </Stack>
  );
};

export default MotivationStep;
