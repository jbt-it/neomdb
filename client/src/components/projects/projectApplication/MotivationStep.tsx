import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { ProjectApplicationDto } from "../../../types/projectTypes";
import useResponsive from "../../../hooks/useResponsive";

/**
 * Props for the motivation step of the project application form
 */
interface MotivationStepProps {
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
  secrecyAgreement: boolean;
  setSecrecyAgreement: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Motivation step of the project application form
 * @returns the respective motivation step of the project application form
 */
const MotivationStep = ({
  applicationData,
  setApplicationData,
  secrecyAgreement,
  setSecrecyAgreement,
}: MotivationStepProps) => {
  const isMobile = useResponsive("down", "sm");
  // Function to handle the change of the motivation
  const onChangeMotivation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setApplicationData((prevState) => {
      return { ...prevState, motivation: value };
    });
  };

  // Function to handle the change of the secrecy agreement
  const onChangeSecrecyAgreement = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSecrecyAgreement(checked);
  };

  return (
    <Box>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
        <Typography fontWeight={"bold"}>Motivation:</Typography>
        <TextField
          variant="outlined"
          multiline
          minRows={10}
          value={applicationData.motivation}
          onChange={onChangeMotivation}
        />
      </Stack>
      <Stack
        sx={{ marginTop: isMobile ? 5 : 3 }}
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"left"}
        flex={1}
        spacing={isMobile ? 3 : 1}
      >
        <FormControlLabel
          control={<Checkbox checked={secrecyAgreement} onChange={onChangeSecrecyAgreement} />}
          label="Ja, ich habe die Geheimhaltungserklärung unterschrieben."
        />
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Hinweis:</strong> Du kannst deine Bewerbung bis zum Bewerbungsschluss beliebig oft bearbeiten.
        </Typography>
      </Stack>
    </Box>
  );
};

export default MotivationStep;
