import { Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";

/**
 * Commitment step of the project application form
 * @returns the respective commitment step of the project application form
 */
const CommitmentStep = () => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={5}>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Internes Vereinsengagement:</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Vorstandstätigkeit" />
            <FormControlLabel control={<Checkbox />} label="Teamleiter" />
          </FormGroup>
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Vorleistungen bei der Akquiset:</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Herstellung des Erstkontakts" />
            <FormControlLabel control={<Checkbox />} label="Schreiben des Angebots" />
          </FormGroup>
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Außerordentliches Vereinsengagement:</Typography>
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

export default CommitmentStep;
