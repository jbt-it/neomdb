import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import React from "react";

/**
 * Motivation step of the project application form
 * @returns the respective motivation step of the project application form
 */
const MotivationStep = () => {
  return (
    <Box>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
        <Typography fontWeight={"bold"}>Motivation:</Typography>
        <TextField variant="outlined" multiline minRows={10} />
      </Stack>
      <FormControlLabel
        sx={{ marginTop: 3 }}
        control={<Checkbox />}
        label="Ja, ich habe die Geheimhaltungserklärung unterschrieben."
      />
    </Box>
  );
};

export default MotivationStep;
