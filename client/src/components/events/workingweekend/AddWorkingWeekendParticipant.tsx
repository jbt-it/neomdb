import React, { useState } from "react";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import { EventParticipant, CommonEventType } from "../../../types/eventTypes";
import useResponsive from "../../../hooks/useResponsive";
import WorkingWeekendSignUpDialog from "./WorkingWeekendSignUpDialog";

interface AddWorkingWeekendParticipant {
  ww: CommonEventType;
  members: EventParticipant[];
  participants: EventParticipant[];
}

const AddWorkingWeekendParticipant: React.FunctionComponent<AddWorkingWeekendParticipant> = ({
  ww,
  members,
  participants,
}: AddWorkingWeekendParticipant) => {
  const isMobile = useResponsive("down", "sm");
  const [participant, setParticipant] = useState<EventParticipant | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signUpForWW = (
    arrival: string,
    departure: string,
    car: boolean,
    vegetarian: boolean,
    remarks: string,
    debitNotice: boolean,
    seats?: number
  ) => {
    if (participant) {
      alert(
        participant?.vorname +
          " " +
          participant?.nachname +
          "\n" +
          "Anmeldung für " +
          ww.name +
          ww.ID +
          " erfolgreich!" +
          "\n" +
          "Ankunft: " +
          arrival +
          "\n" +
          "Abfahrt: " +
          departure +
          "\n" +
          "Auto: " +
          car +
          "\n" +
          "Sitzplätze: " +
          seats +
          "\n" +
          "Vegetarisch: " +
          vegetarian +
          "\n" +
          "Bemerkungen: " +
          remarks +
          "\n" +
          "Lastschrift: " +
          debitNotice
      );
    }
  };

  return (
    <>
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "start" : "center"}
        spacing={isMobile ? 1 : 0}
      >
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          Teilnehmer hinzufügen:
        </Typography>
        <Autocomplete
          renderInput={(params) => <TextField variant="outlined" {...params} label="Mitglied" />}
          options={members.filter((member) => !participants.includes(member))}
          getOptionLabel={(option) => `${option.vorname} ${option.nachname}`}
          sx={{ width: 230 }}
          size="small"
          value={participant}
          onChange={(event, newValue) => {
            setParticipant(newValue);
          }}
        />
        <Button color="primary" size="medium" sx={{ ml: isMobile ? 0 : 2 }} onClick={handleOpen} variant="contained">
          Hinzufügen
        </Button>
      </Stack>
      <WorkingWeekendSignUpDialog open={open} handleClose={handleClose} ww={ww} onSubmit={signUpForWW} />
    </>
  );
};

export default AddWorkingWeekendParticipant;
