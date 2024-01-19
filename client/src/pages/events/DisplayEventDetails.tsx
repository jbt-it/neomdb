import React, { useState, useEffect, useContext, useCallback, FunctionComponent } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import api from "../../utils/api";
import useResponsive from "../../hooks/useResponsive";

import LoadingTable from "../../components/general/LoadingTable";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EditEventDialog from "./EditEventDialog";
import EventChip from "../../components/event/EventChip";
import EventParticipants from "../../components/event/EventParticipants";
import AddMembersField from "../../components/event/AddMembersField";

import { CommonEventType, EventParticipant } from "../../types/eventTypes";
import { Member } from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";

import { events as mockEvents } from "../../mock/events/events";
import { mitglied_has_event } from "../../mock/events/mitglied_has_event";
import { eventParticipants } from "../../mock/events/eventParticipants";
import WorkingWeekendSignUp from "../../components/event/WorkingWeekendSignUp";
import WorkingWeekendParticipantsTable from "../../components/event/WorkingWeekendParticipantsTable";

/**
 * Renders the page for displaying the details of a given event as well as the participants
 * @param props id in URL
 * @returns the page to display the details of an event
 */
const DisplayEventDetails: React.FunctionComponent = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CommonEventType | null>();
  const [members, setMembers] = useState<EventParticipant[]>([]);
  const [userIsSignedUp, setUserIsSignedUp] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const isRegistrationOpen =
    event?.registrationStart &&
    event.registrationStart < dayjs() &&
    event?.registrationDeadline &&
    event.registrationDeadline > dayjs();

  const isMobile = useResponsive("down", "md");

  // Mock participants since backend is not connected yet
  const [participants, setParticipants] = useState<EventParticipant[]>(eventParticipants || []);

  /**
   * Gets the event or workshop from the database
   */
  const getEvent = useCallback(
    (id: number) => {
      // api.get("/events").then((response) => {
      //   console.log(response.data);
      // });

      let event: CommonEventType | null = null;

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
            date: dayjs(res.datum).locale("de"),
            endDate: dayjs(res.ende).locale("de"),
            startTime: dayjs(res.startZeit).locale("de"),
            endTime: dayjs(res.endZeit).locale("de"),
            location: res.ort,
            registrationStart: res.anmeldungvon ? dayjs(res.anmeldungvon).locale("de") : null,
            registrationDeadline: res.anmeldungbis ? dayjs(res.anmeldungbis).locale("de") : null,
            participantsCount: res.teilnehmerZahl,
            maximumParticipants: res.maximaleTeilnehmer,
            type: res.ww ? "WW" : res.netzwerk ? "Netzwerk" : res.jbtgoes ? "JBT goes" : "Sonstige",
          })
        : null;
      setEvent(event);
    },
    [dispatchAuth]
  );

  // Retrieves the members
  const getMembers: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(
              res.data.map((member: Member) => ({
                mitgliedID: member.mitgliedID,
                vorname: member.vorname,
                nachname: member.nachname,
                mitgliedstatus: member.mitgliedstatus,
              }))
            );
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  // Function to update the event
  const updateEvent = (
    title: string,
    location: string | null,
    startDate: Dayjs,
    endDate: Dayjs,
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    registrationStart: Dayjs | null,
    registrationEnd: Dayjs | null,
    maxParticipants: number | null,
    organizers: string[],
    description: string,
    type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop"
  ) => {
    setEvent((prevEvent) => {
      if (prevEvent) {
        return {
          ...prevEvent,
          name: title,
          location: location,
          date: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          registrationStart: registrationStart,
          registrationDeadline: registrationEnd,
          maximumParticipants: maxParticipants,
          organizers: organizers,
          description: description,
          type: type,
        };
      }
      return null;
    });
  };

  // Calls the getEvent and getMembers function
  useEffect(() => {
    getEvent(Number(id));
  }, [id, getEvent]);
  useEffect(() => getMembers(), [getMembers]);

  const displayFields: Array<InformationField> = [
    {
      label: "Anmeldefrist",
      value: event && event.registrationDeadline ? event.registrationDeadline.locale("de").format("DD.MM.YYYY") : null,
      type: "text",
    },
    {
      label: "Beginn",
      value: event && event.date ? event.date.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
    {
      label: "Ende",
      value: event && event.endDate ? event.endDate.format("DD.MM.YYYY").toString() : null,
      type: "text",
    },
    {
      label: "Startzeit",
      value: event && event.startTime ? event.startTime.format("HH:mm").toString() : null,
      type: "text",
    },
    {
      label: "Endzeit",
      value: event && event.endTime ? event.endTime.format("HH:mm").toString() : null,
      type: "text",
    },
    {
      label: "Ort",
      value: event ? event.location : null,
      type: "text",
    },
    {
      label: "Beschreibung",
      value: event ? (event.description ? event.description : null) : null,
      type: "multi",
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
   * function is called to add a participant to the event
   * TODO: Implement backend functionality to add a participant to the event
   * @param participant the participant to add
   */
  const addParticipant = (participant: EventParticipant) => {
    alert(participant.vorname + " " + participant.nachname + " wurde hinzugefügt");
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  /**
   * function is called to remove a participant to the event
   * TODO: Implement backend functionality to remove a participant to the event
   * @param participant the participant to remove
   */
  const removeParticipant = (participant: EventParticipant) => {
    alert(participant.vorname + " " + participant.nachname + " wurde entfernt");
    setParticipants(participants.filter((item) => item.mitgliedID !== participant.mitgliedID));
  };

  /**
   * Renders sign up button
   */
  const RenderSignUpButton: FunctionComponent = () => {
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
    } else if (event?.type === "WW") {
      return <WorkingWeekendSignUp ww={event} size="medium" />;
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
      {event ? (
        <>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ ml: isMobile ? 0 : 3, pb: 1 }}
          >
            <Typography fontWeight={"bold"} variant="h5">
              Termininformationen - {event ? event.name : null}
            </Typography>
            {auth.permissions.length > 0 ? (
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
              <EventChip type={event ? event.type : "Sonstige"} sx={{ ml: 3 }} size="medium" />
            </Stack>
            <Box sx={{ ml: 3, mr: "auto", pt: 1, pb: 4, maxWidth: 600 }}>
              <InfoSection fields={displayFields} />
            </Box>
            {participants.length > 0 ? (
              <>
                <Divider light sx={{ width: "95%", margin: "auto", borderColor: "#f6891f" }} />
                <Typography variant="h6" color="primary" fontWeight={"bold"} sx={{ pt: 2, ml: 3 }}>
                  Teilnehmerliste
                </Typography>
                {event.type === "WW" ? (
                  <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                    <WorkingWeekendParticipantsTable />
                  </Box>
                ) : (
                  <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                    <EventParticipants participants={participants} removeParticipant={removeParticipant} />
                  </Box>
                )}
              </>
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
            {participants.length > 0 ? (
              <>
                <RenderSignUpButton />
                {auth.permissions.length > 0 ? (
                  <AddMembersField members={members} participants={participants} addParticipant={addParticipant} />
                ) : null}
              </>
            ) : null}
          </Stack>
          <EditEventDialog
            open={editDialogOpen}
            onClose={handleDialogClose}
            type={event.type}
            title={event.name}
            location={event.location}
            startDate={event.date}
            endDate={event.endDate}
            startTime={event.startTime}
            endTime={event.endTime}
            registrationStart={event.registrationStart}
            registrationEnd={event.registrationDeadline}
            maxParticipants={10}
            organizers={["Thomas", "Brigitte"]}
            description={event.description}
            onSubmit={(
              title: string,
              location: string | null,
              startDate: Dayjs,
              endDate: Dayjs,
              startTime: Dayjs | null,
              endTime: Dayjs | null,
              registrationStart: Dayjs | null,
              registrationEnd: Dayjs | null,
              maxParticipants: number | null,
              organizers: string[],
              description: string,
              type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop"
            ) => {
              updateEvent(
                title,
                location,
                startDate,
                endDate,
                startTime,
                endTime,
                registrationStart,
                registrationEnd,
                maxParticipants,
                organizers,
                description,
                type
              );
            }}
          />
        </>
      ) : (
        <LoadingTable />
      )}
    </Container>
  );
};

export default DisplayEventDetails;
