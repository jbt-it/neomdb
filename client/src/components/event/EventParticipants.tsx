import React from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { EventParticipant } from "../../types/eventTypes";
import { Link } from "react-router-dom";

interface EventParticipantsProps {
  participants: EventParticipant[];
  removeParticipant: (participant: EventParticipant) => void;
}

const EventParticipants: React.FunctionComponent<EventParticipantsProps> = ({
  participants,
  removeParticipant,
}: EventParticipantsProps) => {
  const { auth } = useAuth();

  const handleRemoveParticipant = (participant: EventParticipant) => {
    removeParticipant(participant);
  };

  return (
    <Grid container columns={{ xs: 2, sm: 5, xl: 6 }}>
      {participants.map((item, index) => (
        <Grid item xs={1} sx={{ display: "flex", direction: "row", alignItems: "center" }} key={index}>
          <Link to={`/gesamtuebersicht/${item.mitgliedID}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography key={index} variant="subtitle1" fontSize={14}>
              {item.vorname} {item.nachname}
            </Typography>
          </Link>
          {auth.permissions.length > 0 ? (
            <IconButton
              sx={{ width: 20, height: 20 }}
              onClick={() => {
                handleRemoveParticipant(item);
              }}
            >
              <RemoveCircle sx={{ fontSize: 15, "&:hover": { color: "#d32f2f" } }} />
            </IconButton>
          ) : null}
        </Grid>
      ))}
    </Grid>
  );
};

export default EventParticipants;
