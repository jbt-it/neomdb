import React, { FunctionComponent, useState } from "react";
import { EventParticipant } from "../../types/eventTypes";
import { Stack, Typography, TextField, Button, Autocomplete } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

interface AddMembersFieldProps {
  members: EventParticipant[];
  participants: EventParticipant[];
  addParticipant: (participant: EventParticipant) => void;
}

/**
 * The AddMembersField component is used to add members to an event.
 * It displays a text field with an autocomplete function and a button.
 * @param members: all members of the club, participants: all participants of the event
 * @param participants: all participants of the event
 * @param addParticipant: function to add a participant to the event
 * @returns AddMembersField component
 */
const AddMembersField: FunctionComponent<AddMembersFieldProps> = ({
  members,
  participants,
  addParticipant,
}: AddMembersFieldProps) => {
  const isMobile = useResponsive("down", "sm");
  const [participant, setParticipant] = useState<EventParticipant | null>(null);

  // function to handle the add participant button if a participant is selected
  const handleAddParticipant = () => {
    if (participant) {
      addParticipant(participant);
      setParticipant(null);
    }
  };

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      alignItems={isMobile ? "start" : "center"}
      spacing={isMobile ? 1 : 0}
    >
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        Teilnehmer hinzufügen:
      </Typography>
      <Autocomplete
        renderInput={(params) => <TextField variant="outlined" {...params} label="Mitglieder" />}
        options={members.filter((member) => !participants.includes(member))}
        getOptionLabel={(option) => `${option.vorname} ${option.nachname}`}
        sx={{ width: 230 }}
        size="small"
        value={participant}
        onChange={(event, newValue) => {
          setParticipant(newValue);
        }}
      />
      <Button
        variant="contained"
        color="primary"
        size="medium"
        sx={{ ml: isMobile ? 0 : 2 }}
        onClick={handleAddParticipant}
      >
        Hinzufügen
      </Button>
    </Stack>
  );
};

export default AddMembersField;
