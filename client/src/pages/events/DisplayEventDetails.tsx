import React, { useState, useEffect, useContext, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Paper,
  Box,
  Button,
  Typography,
  Chip,
  Autocomplete,
  TextField,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  Container,
  Grid,
  Divider,
} from "@mui/material";
import { AddCircle, Delete, Edit, RemoveCircleOutline, RemoveCircle } from "@mui/icons-material";
import { AuthContext } from "../../context/auth-context/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/de";

import LoadingTable from "../../components/general/LoadingTable";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EditEventDialog from "./EditEventDialog";

import { events as mockEvents } from "../../mock/events/events";
import { schulungen as mockWorkshops } from "../../mock/events/Workshops";
import { mitglied_has_event } from "../../mock/events/mitglied_has_event";
import EventChip from "../../components/event/EventChip";

interface RouterMatch {
  id: string;
}

type commonEventType = {
  ID: number;
  name: string;
  description: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationDeadline: string | null;
  type: "ww" | "netzwerk" | "jbtGoes" | "sonstige" | "workshop" | "pflichtworkshop";
};

/**
 * Renders the page for displaying the details of a given event as well as the participants
 * TODO: Implement the functionality to add and remove participants
 * TODO: hide remove button from participants if user is not admin / organizer and generally only display the remove button if hovered over the participant
 * TODO: Change participants to be a list of clickable members instead of a list of strings
 * TODO: Check use for floating action button
 * @param props id in URL
 * @returns the page to display the details of an event
 */
const DisplayEventDetails: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (
  props: RouteComponentProps<RouterMatch>
) => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [event, setEvent] = useState<commonEventType | null>();
  const [userIsSignedUp, setUserIsSignedUp] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  /**
   * Gets the event or workshop from the database
   */
  const getEvent = useCallback(
    (type: string, id: number) => {
      // api.get("/events").then((response) => {
      //   console.log(response.data);
      // });

      let event: commonEventType | null = null;

      if (type === "event") {
        mitglied_has_event
          .filter((event) => event.event_eventID === id)
          .some((event) => event.mitglied_mitgliedID === auth.userID)
          ? setUserIsSignedUp(true)
          : null;

        const res = mockEvents.find((event) => event.eventID === id);
        res
          ? (event = {
              ID: res.eventID,
              name: res.eventName,
              description: res.beschreibung,
              date: dayjs(res.datum).locale("de").format("DD.MM.YYYY").toString(),
              endDate: dayjs(res.ende).locale("de").format("DD.MM.YYYY").toString(),
              startTime: dayjs(res.startZeit).locale("de").format("HH:mm").toString(),
              endTime: dayjs(res.endZeit).locale("de").format("HH:mm").toString(),
              location: res.ort,
              registrationDeadline: res.anmeldungbis
                ? dayjs(res.anmeldungbis).locale("de").format("DD.MM.YYYY").toString()
                : null,
              type: res.ww ? "ww" : res.netzwerk ? "netzwerk" : res.jbtgoes ? "jbtGoes" : "sonstige",
            })
          : null;
      } else if (type === "workshop") {
        const res = mockWorkshops.find((workshop) => workshop.schulungsinstanzID === id);
        res
          ? (event = {
              ID: res.schulungsinstanzID,
              name: res.schulungsname,
              description: res.beschreibung,
              date: dayjs(res.datum).locale("de").format("DD.MM.YYYY").toString(),
              endDate: dayjs(res.datum).locale("de").format("DD.MM.YYYY").toString(),
              startTime: dayjs(res.startzeit).locale("de").format("HH:mm").toString(),
              endTime: dayjs(res.endzeit).locale("de").format("HH:mm").toString(),
              location: res.ort,
              registrationDeadline: null,
              type: res.art === "Pflichtschulung" ? "pflichtworkshop" : "workshop",
            })
          : null;
      }
      setEvent(event);
    },
    [dispatchAuth]
  );

  //* calls the getEvent function */
  useEffect(() => {
    getEvent("event", Number(props.match.params.id));
  }, [props.match.params.id, getEvent]);

  //mock participants since backend is not connected yet
  const participants = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Julia",
    "Kevin",
    "Linda",
    "Mallory",
    "Nancy",
    "Oliver",
    "Peggy",
    "Quentin",
    "Ralph",
    "Sara",
    "Trudy",
    "Ursula",
    "Victor",
    "Wendy",
    "Xander",
    "Yvonne",
    "Zoe",
  ];

  // empty participants for testing
  const participantsLeer: string[] = [];

  const displayFields: Array<InformationField> = [
    {
      label: "Anmeldefrist",
      value: event ? event.registrationDeadline : null,
      type: "text",
    },
    {
      label: "Beginn",
      value: event ? event.date : null,
      type: "text",
    },
    {
      label: "Ende",
      value: event ? event.endDate : null,
      type: "text",
    },
    {
      label: "Startzeit",
      value: event ? event.startTime : null,
      type: "text",
    },
    {
      label: "Endzeit",
      value: event ? event.endTime : null,
      type: "text",
    },
    {
      label: "Ort",
      value: event ? event.location : null,
      type: "text",
    },
    {
      label: "Beschreibung",
      value: event ? event.description : null,
      type: "multi",
    },
  ];

  /**
   * Renders the details of the event
   */
  const renderDetails = () => {
    return (
      <Box sx={{ ml: 3, mr: "auto", pt: 1, pb: 4 }}>
        <InfoSection fields={displayFields} />
      </Box>
    );
  };

  /**
   * Renders the members who are participating in the event
   */
  const renderParticipants = () => {
    return (
      <Grid container columns={{ xs: 2, sm: 5, xl: 6 }}>
        {participants.map((item, index) => (
          <Grid item xs={1} sx={{ display: "flex", direction: "row", alignItems: "center" }}>
            <Typography key={index} variant="subtitle1">
              {item}
            </Typography>
            {auth.permissions.length > 0 ? (
              <IconButton sx={{ width: 20, height: 20 }} onClick={() => console.log("TODO: implement delete user")}>
                <RemoveCircle sx={{ fontSize: 15, "&:hover": { color: "#d32f2f" } }} />
              </IconButton>
            ) : null}
          </Grid>
        ))}
      </Grid>
    );
  };

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  /**
   * Renders the delete button to delete an event and the dialog to confirm the deletion
   * TODO: Implement deletion functionality
   */
  const renderDeleteButton = () => {
    const handleclose = () => {
      setDeleteOpen(false);
    };

    const handleDeleteOpen = () => {
      setDeleteOpen(true);
    };

    /** Renders the delete confirmation dialog */
    const HandleDelete = () => {
      return (
        <Dialog onClose={handleclose} open={deleteOpen}>
          <DialogTitle>Dieses Event wirklich löschen?</DialogTitle>
          <Stack direction={"row"} spacing={5} margin={"auto"} pb={2}>
            <Button color="error" variant="outlined" onClick={() => console.log("TODO: implement deletion")}>
              Ja
            </Button>
            <Button color="error" variant="contained" onClick={handleclose}>
              Nein
            </Button>
          </Stack>
        </Dialog>
      );
    };

    return (
      <>
        <IconButton sx={{ mt: 0.5 }} onClick={handleDeleteOpen}>
          <Delete />
        </IconButton>
        <HandleDelete />
      </>
    );
  };

  /**
   * Renders the edit button for the event
   * When clicked the dialog to edit the event will open
   * TODO: Implement edit functionality
   */
  const renderEditButton = () => {
    return (
      <IconButton sx={{ mt: 0.5 }} onClick={() => setEditDialogOpen(true)}>
        <Edit />
      </IconButton>
    );
  };

  /**
   * Handles the onClose event of the edit dialog
   */
  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  const members = ["Thomas", "Brigitte", "Hans", "Peter", "Marc", "Lukas", "Johannes", "Karl", "Hans"];

  /**
   * Renders the autocomplete field and button for adding new members to the event
   */
  const renderAddMembersField = () => {
    return (
      <Box sx={{ display: "flex", direction: "row", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          Teilnehmer hinzufügen:
        </Typography>
        <Autocomplete
          renderInput={(params) => <TextField variant="outlined" {...params} label="Mitglieder" />}
          options={members.filter((member) => !participants.includes(member))}
          sx={{ width: 200 }}
          size="small"
        />
        <Button variant="contained" color="primary" size="medium" sx={{ ml: 2 }}>
          Hinzufügen
        </Button>
      </Box>
    );
  };

  /**
   * Renders sign up button
   */
  const renderSignUpButton = () => {
    const handleSignUp = () => {
      // here should be a api call to sign up or sign off the user
      setUserIsSignedUp(!userIsSignedUp);
    };

    if (userIsSignedUp) {
      return (
        <Chip label="Abmelden" color="error" variant="outlined" icon={<RemoveCircleOutline />} onClick={handleSignUp} />
      );
    } else {
      return <Chip label="Anmelden" color="success" icon={<AddCircle />} onClick={handleSignUp} />;
    }
  };

  /**
   * Renders the page
   */
  return (
    <Container className="content-page" maxWidth="md" sx={{ ml: 3 }}>
      {event ? (
        <>
          <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ ml: 3, pb: 1 }}>
            <Typography fontWeight={"bold"} variant="h5">
              Termininformationen - {event ? event.name : null}
            </Typography>
            {auth.permissions.length > 0 ? (
              <Stack direction={"row"} spacing={2}>
                {renderDeleteButton()}
                {renderEditButton()}
              </Stack>
            ) : null}
          </Stack>
          <Paper sx={{ ml: 3 }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ pt: 2, ml: 3, mr: 3 }}
              alignItems={"center"}
            >
              <Typography variant="h6" color="primary" fontWeight={"bold"}>
                Details
              </Typography>
              <EventChip type={event ? event.type : "sonstige"} sx={{ ml: 3 }} size="medium" />
            </Stack>
            {renderDetails()}
            {participants.length > 0 ? (
              <>
                <Divider light sx={{ width: "95%", margin: "auto", borderColor: "#f6891f" }} />
                <Typography variant="h6" color="primary" fontWeight={"bold"} sx={{ pt: 2, ml: 3 }}>
                  Teilnehmerliste
                </Typography>
                <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>{renderParticipants()}</Box>
              </>
            ) : null}
          </Paper>
          <Box
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "space-between",
              alignItems: "center",
              ml: 3,
              mt: 2,
            }}
          >
            {participants.length > 0 ? (
              <>
                {renderSignUpButton()} {auth.permissions.length > 0 ? renderAddMembersField() : null}
              </>
            ) : null}
          </Box>
          <EditEventDialog
            open={editDialogOpen}
            onClose={handleDialogClose}
            title={event.name}
            description={event.description}
          />
        </>
      ) : (
        <LoadingTable />
      )}
    </Container>
  );
};

export default DisplayEventDetails;
