import React from "react";
import { Checkbox, FormControlLabel, FormGroup, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";
import { ProjectApplicationDto } from "../../../types/projectTypes";
import { PosionOfMemberDto, WorkshopsHeldByMember } from "../../../types/membersTypes";

/**
 * Props for the commitment step of the project application form
 */
interface CommitmentStepProps {
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
  internalCommitmentSuggestions: PosionOfMemberDto[];
  workshopsHeldByMemberSuggestions: WorkshopsHeldByMember[];
}

/**
 * Commitment step of the project application form
 * @returns the respective commitment step of the project application form
 */
const CommitmentStep = ({
  applicationData,
  setApplicationData,
  internalCommitmentSuggestions,
  workshopsHeldByMemberSuggestions,
}: CommitmentStepProps) => {
  const isMobile = useResponsive("down", "sm");

  // Function to handle the change of the internal commitment
  const onChangeInternalCommitment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as "Vorstandstätigkeit" | "Teamleiter";
    setApplicationData((prevState) => {
      const internalCommitment = (prevState.internalCommitment ?? []).includes(value)
        ? (prevState.internalCommitment ?? []).filter((item) => item !== value)
        : [...(prevState.internalCommitment ?? []), value];
      return { ...prevState, internalCommitment };
    });
  };

  // Function to handle the change of the acquisition commitment
  const onChangeAcquisitionCommitment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as "Herstellung des Erstkontakts" | "Schreiben des Angebots";
    setApplicationData((prevState) => {
      const preliminaryWork = (prevState.preliminaryWork ?? []).includes(value)
        ? (prevState.preliminaryWork ?? []).filter((item) => item !== value)
        : [...(prevState.preliminaryWork ?? []), value];
      return { ...prevState, preliminaryWork };
    });
  };

  // Function to handle the change of the extraordinary commitment
  const onChangeExtraordinaryCommitment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setApplicationData((prevState) => {
      return { ...prevState, extraordinaryCommitment: value };
    });
  };

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={5}>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Internes Vereinsengagement:</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={"Vorstandstätigkeit"}
                  checked={(applicationData.internalCommitment ?? []).includes("Vorstandstätigkeit")}
                  onChange={onChangeInternalCommitment}
                />
              }
              label="Vorstandstätigkeit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={"Teamleiter"}
                  checked={(applicationData.internalCommitment ?? []).includes("Teamleiter")}
                  onChange={onChangeInternalCommitment}
                />
              }
              label="Teamleiter"
            />
          </FormGroup>
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Vorleistungen bei der Akquiset:</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={"Herstellung des Erstkontakts"}
                  checked={(applicationData.preliminaryWork ?? []).includes("Herstellung des Erstkontakts")}
                  onChange={onChangeAcquisitionCommitment}
                />
              }
              label="Herstellung des Erstkontakts"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={"Schreiben des Angebots"}
                  checked={(applicationData.preliminaryWork ?? []).includes("Schreiben des Angebots")}
                  onChange={onChangeAcquisitionCommitment}
                />
              }
              label="Schreiben des Angebots"
            />
          </FormGroup>
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Außerordentliches Vereinsengagement:</Typography>
          <TextField
            variant="outlined"
            size="small"
            multiline
            minRows={3}
            value={applicationData.extraordinaryCommitment}
            onChange={onChangeExtraordinaryCommitment}
          />
        </Stack>
      </Stack>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Typography fontWeight={"bold"}>Vorschläge (werden nicht übermittelt):</Typography>
        <Stack direction={"column"} spacing={0}>
          <Typography fontWeight={"bold"}>Tätigkeiten im JBT:</Typography>
          <List sx={{ listStyleType: "square", pl: 2 }} disablePadding dense>
            {internalCommitmentSuggestions.map((internalCommitment, index) => (
              <ListItem key={index} sx={{ display: "list-item" }} disablePadding>
                <Typography fontSize={14}>
                  <strong>{internalCommitment.designation}</strong> - {internalCommitment.from.toLocaleDateString()} -{" "}
                  {internalCommitment.until.toLocaleDateString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack direction={"column"} spacing={0}>
          <Typography fontWeight={"bold"}>Gehaltene Workshops:</Typography>

          <List sx={{ listStyleType: "square", pl: 2 }} disablePadding dense>
            {workshopsHeldByMemberSuggestions.map((workshop, index) => (
              <ListItem key={index} sx={{ display: "list-item" }} disablePadding>
                <Typography fontSize={14}>{workshop.name}</Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommitmentStep;
