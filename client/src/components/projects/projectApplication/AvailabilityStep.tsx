import { FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import React from "react";

/**
 * Availability step of the project application form
 * @returns the respective availability step of the project application form
 */
const AvailabilityStep = () => {
  return (
    <Stack direction={"column"} spacing={3} flex={1}>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
        <Typography fontWeight={"bold"}>Zeitliche Verfügbarkeit:</Typography>
        <RadioGroup>
          <FormControlLabel
            value="Ohne Einschränkung"
            control={<Radio />}
            label="Volle Anzahl an BT (ohne Einschränkung)"
          />
          <FormControlLabel
            value="Mit Einschränkung"
            control={<Radio />}
            label="Volle Anzahl an BT (mit Einschränkung)"
          />
        </RadioGroup>
      </Stack>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
        <Typography fontWeight={"bold"}>Gründe für und Dauer der zeitlichen Einschränkung:</Typography>
        <TextField variant="outlined" size="small" multiline minRows={3} />
      </Stack>
    </Stack>
  );
};

export default AvailabilityStep;
