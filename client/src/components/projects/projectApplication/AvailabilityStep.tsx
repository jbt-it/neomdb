import { FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { ProjectApplicationDto } from "../../../types/projectTypes";

/**
 * Props for the availability step of the project application form
 */
interface AvailabilityStepProps {
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
}

/**
 * Availability step of the project application form
 * @returns the respective availability step of the project application form
 */
const AvailabilityStep = ({ applicationData, setApplicationData }: AvailabilityStepProps) => {
  // Function to handle the change of the availability
  const onChangeAvailability = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as "Ohne Einschränkung" | "Mit Einschränkung";
    setApplicationData((prevState) => {
      return { ...prevState, availability: value };
    });
  };

  // Function to handle the change of the availability reason
  const onChangeAvailabilityReason = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setApplicationData((prevState) => {
      return { ...prevState, restriction: value };
    });
  };

  return (
    <Stack direction={"column"} spacing={3} flex={1}>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
        <Typography fontWeight={"bold"}>Zeitliche Verfügbarkeit:</Typography>
        <RadioGroup value={applicationData.availability ?? ""} onChange={onChangeAvailability}>
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
        <TextField
          variant="outlined"
          size="small"
          multiline
          minRows={3}
          value={applicationData.restriction}
          onChange={onChangeAvailabilityReason}
        />
      </Stack>
    </Stack>
  );
};

export default AvailabilityStep;
