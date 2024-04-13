import React from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { EventParticipant } from "../../types/eventTypes";
import { Link } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

interface EventParticipantsProps {
  participants: EventParticipant[];
  removeParticipant: (participant: EventParticipant) => void;
}

/**
 * Displays the participants of an event
 * displays a remove button if the user is logged in and has permissions
 * @param participants - the participants of the event
 * @param removeParticipant - function to remove a participant from the event
 * @returns - the participants component
 */
const EventParticipants: React.FunctionComponent<EventParticipantsProps> = ({
  participants,
  removeParticipant,
}: EventParticipantsProps) => {
  const { auth } = useAuth();
  const hasEventPermissions = doesPermissionsHaveSomeOf(auth.permissions, [14]);
  const isMobile = useResponsive("down", "md");

  // function to handle the remove participant button
  const handleRemoveParticipant = (participant: EventParticipant) => {
    removeParticipant(participant);
  };

  return (
    <Grid container columns={{ xs: 2, sm: 5, xl: 6 }}>
      {participants.map((item, index) => (
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center",
            position: "relative",
            "&:hover button": { opacity: 1 },
          }}
          key={index}
        >
          <Link to={`/gesamtuebersicht/${item.mitgliedID}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography key={index} variant="subtitle1" fontSize={14}>
              {item.vorname} {item.nachname}
            </Typography>
          </Link>
          {hasEventPermissions && (
            <IconButton
              sx={{
                width: 20,
                height: 20,
                opacity: isMobile ? 1 : 0,
                "&:hover": { opacity: 1 },
              }}
              onClick={() => {
                handleRemoveParticipant(item);
              }}
            >
              <RemoveCircle sx={{ fontSize: 15, "&:hover": { color: "#d32f2f" } }} />
            </IconButton>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default EventParticipants;
