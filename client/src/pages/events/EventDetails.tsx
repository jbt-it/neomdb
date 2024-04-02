import React, { useState, useContext, FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Box,
  Button,
  Typography,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  Container,
  Divider,
} from "@mui/material";
import { AddCircle, Delete, Edit, RemoveCircleOutline } from "@mui/icons-material";
import { AuthContext } from "../../context/auth-context/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/de";
import useResponsive from "../../hooks/useResponsive";

import LoadingTable from "../../components/general/LoadingTable";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EditEventDialog from "../../components/events/EditEventDialog";
import EventChip from "../../components/events/EventChip";
import EventParticipants from "../../components/events/EventParticipants";
import AddMembersField from "../../components/events/AddMembersField";

import { EventParticipant } from "../../types/eventTypes";

import WorkingWeekendSignUp from "../../components/events/workingweekend/WorkingWeekendSignUp";
import WorkingWeekendParticipantsTable from "../../components/events/workingweekend/WorkingWeekendParticipantsTable";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import AddWorkingWeekendParticipant from "../../components/events/workingweekend/AddWorkingWeekendParticipant";
import { Member } from "../../types/membersTypes";
import useEventDetails from "../../hooks/useEventDetails";

type WWRegistrationInfo = {
  anreise: string;
  abreise: string;
  auto: boolean;
  plaetze: number;
  vegetarier: boolean;
  kommentar: string;
};

/**
 * Renders the page for displaying the details of a given event as well as the participants
 * @param props id in URL
 * @returns the page to display the details of an event
 */
const EventDetails: React.FunctionComponent = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  // const [event, setEvent] = useState<CommonEventType | null>();
  const [userIsSignedUp, setUserIsSignedUp] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [wwRegistrationData, setWWRegistrationData] = useState<WWRegistrationInfo | null>(null);
  const hasEventPermission = doesPermissionsHaveSomeOf(auth.permissions, [8]);

  const { eventDetails, eventParticipants, wwParticipants, updateEventDetails } = useEventDetails(Number(id));

  const isRegistrationOpen =
    (!eventDetails?.registrationStart && eventDetails?.registrationEnd && eventDetails.registrationEnd > dayjs()) ||
    (eventDetails?.registrationStart &&
      eventDetails.registrationStart < dayjs() &&
      eventDetails?.registrationEnd &&
      eventDetails.registrationEnd > dayjs());

  const isMobile = useResponsive("down", "md");

  // Fields for the display of event information
  const displayFields: Array<InformationField> = [
    {
      label: "Anmeldefrist",
      value:
        eventDetails && eventDetails.registrationEnd
          ? eventDetails.registrationEnd.locale("de").format("DD.MM.YYYY")
          : null,
      type: "text",
    },
    {
      label: "Beginn",
      value: eventDetails && eventDetails.startDate ? eventDetails.startDate.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
    {
      label: "Ende",
      value: eventDetails && eventDetails.endDate ? eventDetails.endDate.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
    {
      label: "Startzeit",
      value: eventDetails && eventDetails.startTime ? eventDetails.startTime.format("HH:mm").toString() : null,
      type: "text",
    },
    {
      label: "Endzeit",
      value: eventDetails && eventDetails.endTime ? eventDetails.endTime.format("HH:mm").toString() : null,
      type: "text",
    },
    {
      label: "Ort",
      value: eventDetails ? eventDetails.location : null,
      type: "text",
    },
    {
      label: "Beschreibung",
      value: eventDetails ? (eventDetails.description ? eventDetails.description : null) : null,
      type: "multi",
    },
  ];

  // Function to map the arrival and departure of a participant to a string
  const mapAnUndAbreise = (tag: string, anreise: boolean): string => {
    switch (tag) {
      case "FrF":
        return "Freitag früh";
      case "FrM":
        return anreise ? "Freitag vor dem Mittagessen" : "Freitag nach dem Mittagessen";
      case "FrA":
        return anreise ? "Freitag vor dem Abendessen" : "Freitag nach dem Abendessen";
      case "SaF":
        return anreise ? "Samstag vor dem Frühstück" : "Samstag nach dem Frühstück";
      case "SaM":
        return anreise ? "Samstag vor dem Mittagessen" : "Samstag nach dem Mittagessen";
      case "SaA":
        return anreise ? "Samstag vor dem Abendessen" : "Samstag nach dem Abendessen";
      case "So":
        return "Sonntag";
      default:
        return "Fehler";
    }
  };

  // Fields for the registration information
  const wwRegistrationFields: Array<InformationField> = [
    {
      label: "Anreise",
      value:
        userIsSignedUp && wwRegistrationData && eventDetails?.type === "WW"
          ? mapAnUndAbreise(wwRegistrationData.anreise, true)
          : null,
      type: "text",
    },
    {
      label: "Geplante Abreise",
      value:
        userIsSignedUp && wwRegistrationData && eventDetails?.type === "WW"
          ? mapAnUndAbreise(wwRegistrationData.abreise, false)
          : null,
      type: "text",
    },
    {
      label: "Auto",
      value:
        userIsSignedUp && wwRegistrationData && eventDetails?.type === "WW"
          ? wwRegistrationData.auto
            ? "Ja, " + wwRegistrationData.plaetze
            : "Nein"
          : null,
      type: "text",
    },
    {
      label: "Vegetarier",
      value:
        userIsSignedUp && wwRegistrationData && eventDetails?.type === "WW"
          ? wwRegistrationData.vegetarier
            ? "Ja"
            : "Nein"
          : null,
      type: "text",
    },
    {
      label: "Bemerkungen",
      value: userIsSignedUp && wwRegistrationData && eventDetails?.type === "WW" ? wwRegistrationData.kommentar : null,
      type: "text",
    },
  ];

  /**
   * Renders the delete button to delete an event and the dialog to confirm the deletion
   * TODO: Implement delete functionality
   */
  const RenderDeleteButton: FunctionComponent = () => {
    const handleclose = () => {
      setDeleteOpen(false);
    };

    // Function to open the delete confirmation dialog
    const handleDeleteOpen = () => {
      setDeleteOpen(true);
    };

    // Renders the delete confirmation dialog
    // TODO: Implement delete functionality when backend is connected
    const HandleDelete: FunctionComponent = () => {
      return (
        <Dialog onClose={handleclose} open={deleteOpen}>
          <DialogTitle>Dieses Event wirklich löschen?</DialogTitle>
          <Stack direction={"row"} spacing={5} margin={"auto"} pb={2}>
            <Button color="error" variant="outlined" onClick={() => alert("TODO: implement deletion")}>
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
   */
  const RenderEditButton: FunctionComponent = () => {
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

  /**
   * Function is called to add a participant to the event
   * TODO: Implement backend functionality to add a participant to the event
   * @param participant the participant to add
   */
  const addParticipant = (participant: Member) => {
    alert(participant.vorname + " " + participant.nachname + " wurde hinzugefügt");
    // setParticipants((prevParticipants) => [...prevParticipants, { ...participant, anmeldedatum: dayjs() }]);
  };

  /**
   * Function is called to remove a participant to the event
   * TODO: Implement backend functionality to remove a participant to the event
   * @param participant the participant to remove
   */
  const removeParticipant = (participant: EventParticipant) => {
    alert(participant.vorname + " " + participant.nachname + " wurde entfernt");
    // setParticipants(participants.filter((item) => item.mitgliedID !== participant.mitgliedID));
  };

  /**
   * Renders sign up button
   */
  const SignUpButton: FunctionComponent = () => {
    const handleSignUp = () => {
      // here should be a api call to sign up or sign off the user
      setUserIsSignedUp(!userIsSignedUp);
    };

    if (userIsSignedUp) {
      if (isRegistrationOpen) {
        return (
          <Chip
            label="Abmelden"
            color="error"
            variant="outlined"
            icon={<RemoveCircleOutline />}
            onClick={handleSignUp}
          />
        );
      } else {
        return <Chip label="Abmelden" color="error" variant="outlined" disabled icon={<RemoveCircleOutline />} />;
      }
    } else if (eventDetails?.type === "WW") {
      return <WorkingWeekendSignUp ww={eventDetails} size="medium" />;
    } else if (isRegistrationOpen) {
      return <Chip label="Anmelden" color="success" icon={<AddCircle />} onClick={handleSignUp} />;
    } else {
      return null;
    }
  };

  /**
   * Renders the page
   */
  return (
    <Container maxWidth="lg" sx={{ ml: isMobile ? 0 : 1, maxWidth: isMobile ? "95%" : "100%" }}>
      {eventDetails ? (
        <>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ ml: isMobile ? 0 : 3, pb: 1 }}
          >
            <Typography fontWeight={"bold"} variant="h5">
              Termininformationen - {eventDetails ? eventDetails.name : null}
            </Typography>
            {hasEventPermission ? (
              <Stack direction={"row"} spacing={2}>
                <RenderDeleteButton />
                <RenderEditButton />
              </Stack>
            ) : null}
          </Stack>
          <Paper sx={{ ml: isMobile ? 0 : 3 }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ pt: 2, ml: 3, mr: 3 }}
              alignItems={"center"}
            >
              <Typography variant="h6" color="primary" fontWeight={"bold"}>
                Details
              </Typography>
              <EventChip type={eventDetails ? eventDetails.type : "Sonstige"} sx={{ ml: 3 }} size="medium" />
            </Stack>
            <Box sx={{ ml: 3, mr: "auto", pt: 1, pb: 4, maxWidth: 600 }}>
              <InfoSection fields={displayFields} />
            </Box>
            {userIsSignedUp && eventDetails.type === "WW" ? (
              <>
                <Divider light sx={{ width: "95%", margin: "auto", borderColor: "#f6891f" }} />
                <Box sx={{ ml: 3, mb: 3 }}>
                  <Typography variant="h6" color="primary" fontWeight={"bold"} sx={{ pt: 2 }}>
                    Anmeldedaten
                  </Typography>
                  <Typography sx={{ pb: 2 }}>
                    Du bist angemeldet!{" "}
                    {isRegistrationOpen
                      ? null
                      : "Da die Anmeldephase abgelaufen ist, kannst du dich nicht mehr abmelden. "}
                    Deine Anmeldedaten:
                  </Typography>
                  <InfoSection fields={wwRegistrationFields} />
                </Box>
              </>
            ) : null}
            {eventParticipants && eventParticipants.length > 0 ? (
              <>
                <Divider light sx={{ width: "95%", margin: "auto", borderColor: "#f6891f" }} />
                <Typography variant="h6" color="primary" fontWeight={"bold"} sx={{ pt: 2, ml: 3 }}>
                  Teilnehmerliste ({eventParticipants.length})
                </Typography>
                {eventDetails.type === "WW" && wwParticipants ? (
                  <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                    <WorkingWeekendParticipantsTable wwparticipants={wwParticipants} />
                  </Box>
                ) : (
                  <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                    <EventParticipants participants={eventParticipants} removeParticipant={removeParticipant} />
                  </Box>
                )}
              </>
            ) : wwParticipants && wwParticipants.length > 0 ? (
              <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                <WorkingWeekendParticipantsTable wwparticipants={wwParticipants} />
              </Box>
            ) : null}
          </Paper>
          <Stack
            sx={{
              justifyContent: "space-between",
              ml: isMobile ? 0 : 3,
              mt: 2,
            }}
            alignItems={isMobile ? "start" : "center"}
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 2 : 0}
          >
            <SignUpButton />
            <>
              {hasEventPermission && eventParticipants ? (
                eventDetails.type === "WW" ? (
                  <AddWorkingWeekendParticipant participants={eventParticipants} ww={eventDetails} />
                ) : (
                  <AddMembersField participants={eventParticipants} addParticipant={addParticipant} />
                )
              ) : null}
            </>
          </Stack>
          <EditEventDialog
            open={editDialogOpen}
            eventDetails={eventDetails}
            onClose={handleDialogClose}
            onSubmit={updateEventDetails}
          />
        </>
      ) : (
        <LoadingTable />
      )}
    </Container>
  );
};

export default EventDetails;
