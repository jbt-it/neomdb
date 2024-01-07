import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Divider, Paper, Stack, Chip, Button } from "@mui/material";

import { Workshop, WorkshopInstance, EventParticipant } from "../../types/eventTypes";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EventParticipants from "../../components/event/EventParticipants";
import EventChip from "../../components/event/EventChip";
import AddMembersField from "../../components/event/AddMembersField";
import WorkshopInstanceButton from "../../components/event/WorkshopInstanceButton";
import { useAuth } from "../../hooks/useAuth";

import { schulung } from "../../mock/events/schulung";
import { schulungsinstanz } from "../../mock/events/schulungsinstanz";
import { eventParticipants } from "../../mock/events/eventParticipants";
import useResponsive from "../../hooks/useResponsive";
import { AddCircle, CheckCircle, RemoveCircleOutline, Group, Grade } from "@mui/icons-material";
import api from "../../utils/api";
import { Member } from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import dayjs from "dayjs";
import WorkshopInstanceAdmissionClosingTable from "../../components/event/WorkshopInstanceAdmissionClosingTable";
import WorkshopInstanceAttendanceTable from "../../components/event/WorkshopInstanceAttendanceTable";

/**
 * Displays the details of a workshop instance
 * @returns Displays the details of a workshop instance
 */
const WorkshopInstanceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [workshopInstance, setWorkshopInstance] = useState<WorkshopInstance | undefined>(undefined);
  const [workshop, setWorkshop] = useState<Workshop | undefined>(undefined);
  const [participants, setParticipants] = useState<EventParticipant[]>(
    eventParticipants
      ? eventParticipants.map((participant) => ({ ...participant, anmeldedatum: dayjs(participant.anmeldedatum) }))
      : []
  );
  const [members, setMembers] = useState<EventParticipant[]>([]);
  const [userIsSignedUp, setUserIsSignedUp] = useState<boolean>(false);
  const { auth, dispatchAuth } = useAuth();
  const [isRegistraionClosing, setIsRegistrationClosing] = useState<boolean>(false);
  const [isEditingParticipants, setIsEditingParticipants] = useState<boolean>(false);

  // Berücksichtigen: is referent
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(auth.permissions, [4]);

  const isMobile = useResponsive("down", "sm");

  const getWorkshopInstance = () => {
    setWorkshopInstance(
      (schulungsinstanz.find(
        (workshopInstance) => workshopInstance.schulungsinstanzID === Number(id)
      ) as WorkshopInstance) || null
    );
  };

  const getWorkshop = (idWorkshop: number) => {
    const foundWorkshop = schulung.find((workshop) => workshop.schulungId === Number(idWorkshop)) as Workshop;
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    } else {
      alert(`No workshop found with id ${idWorkshop}`);
    }
  };

  // Retrieves all members
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

  useEffect(() => {
    getWorkshopInstance();
  }, []);

  useEffect(() => {
    if (workshopInstance) {
      getWorkshop(workshopInstance.schulungId);
    }
  }, [workshopInstance]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

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
   * function is called to add a participant to the event
   * TODO: Implement backend functionality to add a participant to the event
   * @param participant the participant to add
   */
  const addParticipant = (participant: EventParticipant) => {
    alert(participant.vorname + " " + participant.nachname + " wurde hinzugefügt");
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  /**
   * function is called to close the admission
   */
  const handleCloseAdmission = () => {
    setIsRegistrationClosing(true);
  };

  /**
   * function is called to edit the attendance list
   */
  const handleAttendanceList = () => {
    setIsEditingParticipants(true);
  };

  /**
   * Renders sign up button
   */
  const SignUpButton: React.FunctionComponent = () => {
    const handleSignUp = () => {
      // here should be a api call to sign up or sign off the user
      setUserIsSignedUp(!userIsSignedUp);
    };

    if (userIsSignedUp) {
      return (
        <Chip label="Abmelden" color="error" variant="outlined" icon={<RemoveCircleOutline />} onClick={handleSignUp} />
      );
    } else {
      return workshopInstance?.status === "Anmeldung" ? (
        <Chip label="Anmelden" color="success" icon={<AddCircle />} onClick={handleSignUp} />
      ) : null;
    }
  };

  const WorkshopInstanceAdditionalButtons: React.FunctionComponent<WorkshopInstance> = (props: WorkshopInstance) => {
    const workshopInstance = props;
    const isMobile = useResponsive("down", "sm");

    return workshopInstance.status === "Anmeldung" ? (
      <Button
        variant={"contained"}
        onClick={handleCloseAdmission}
        sx={{ fontWeight: 600, fontSize: isMobile ? 10 : 14 }}
        color="info"
        startIcon={<CheckCircle />}
      >
        {isMobile ? "abschließen" : "Anmeldung schließen"}
      </Button>
    ) : workshopInstance.status === "Anmeldung abgeschlossen" ? (
      <Button
        variant="contained"
        sx={{ fontWeight: 600, fontSize: isMobile ? 10 : 14 }}
        color="info"
        onClick={handleAttendanceList}
        startIcon={<Group />}
      >
        {isMobile ? "Anwesenheit" : "Anwesenheitsliste eingeben"}
      </Button>
    ) : workshopInstance.status === "Feedback" || workshopInstance.status === "Abgeschlossen" ? (
      <Button
        variant="contained"
        href={`/#/workshops/${workshopInstance.schulungId}/${workshopInstance.schulungsinstanzID}/feedbackauswertung`}
        sx={{ fontWeight: 600, fontSize: isMobile ? 10 : 14 }}
        color="info"
        startIcon={<Grade />}
      >
        {isMobile ? "Feedback" : "Feedback anzeigen"}
      </Button>
    ) : null;
  };

  const instanceFields: Array<InformationField> = [
    {
      label: "Workshop",
      value: workshop ? workshop.schulungsName : null,
      type: "text",
    },
    {
      label: "Status",
      value: workshopInstance ? workshopInstance.status : null,
      type: "text",
    },
    {
      label: "Datum",
      value: workshopInstance ? dayjs(workshopInstance.datum).format("DD.MM.YYYY") : null,
      type: "text",
    },
    {
      label: "Startzeit",
      value: workshopInstance ? workshopInstance.startzeit : null,
      type: "text",
    },
    {
      label: "Endzeit",
      value: workshopInstance ? workshopInstance.endzeit : null,
      type: "text",
    },
    {
      label: "Ort",
      value: workshopInstance ? workshopInstance.ort : null,
      type: "text",
    },
    {
      label: "Referent",
      value: workshopInstance ? workshopInstance.referenten : null,
      type: "text",
    },
    {
      label: "Max. Teilnehmerzahle",
      value: workshopInstance ? workshopInstance.maximaleTeilnehmer.toString() : null,
      type: "text",
    },
  ];

  return (
    <Container sx={{ ml: isMobile ? 0 : 3 }}>
      {isRegistraionClosing ? (
        <WorkshopInstanceAdmissionClosingTable
          participants={participants}
          setIsRegistrationClosing={setIsRegistrationClosing}
        />
      ) : isEditingParticipants ? (
        <WorkshopInstanceAttendanceTable
          participants={participants}
          setIsEditingParticipants={setIsEditingParticipants}
        />
      ) : workshop && workshopInstance ? (
        <>
          <Stack direction={"column"} justifyContent={"space-between"} alignItems={"flex-start"} sx={{ mb: 1 }}>
            <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
              Informationen zum Workshop-Termin
            </Typography>
            {hasWorkshopPermission ? (
              <Stack direction={"row"} spacing={isMobile ? 2 : 2}>
                <WorkshopInstanceButton workshop={workshop} workshopInstance={workshopInstance} edit />
                <WorkshopInstanceAdditionalButtons {...workshopInstance} />
                <WorkshopInstanceButton deletion />
              </Stack>
            ) : null}
          </Stack>
          <Paper>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ pt: 2, ml: 3, mr: 3 }}
              alignItems={"center"}
            >
              <Typography variant="h6" color="primary" fontWeight={"bold"}>
                Details
              </Typography>
              <EventChip type={workshop ? workshop.art : "Sonstige"} sx={{ ml: 3 }} size="medium" />
            </Stack>
            <Box sx={{ ml: 3, mr: "auto", pt: 1, pb: 4, maxWidth: 600 }}>
              <InfoSection fields={instanceFields} />
            </Box>
            {participants.length > 0 ? (
              <>
                <Divider light sx={{ width: "95%", margin: "auto", borderColor: "#f6891f" }} />
                <Typography variant="h6" color="primary" fontWeight={"bold"} sx={{ pt: 2, ml: 3 }}>
                  Teilnehmerliste ({participants.length})
                </Typography>
                <Box sx={{ ml: 3, mr: 3, pb: 3, pt: 1 }}>
                  <EventParticipants participants={participants} removeParticipant={removeParticipant} />
                </Box>
              </>
            ) : null}
          </Paper>
          <Stack
            sx={{
              justifyContent: "space-between",
              mt: 2,
            }}
            alignItems={isMobile ? "start" : "center"}
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 2 : 0}
          >
            {participants.length > 0 ? (
              <>
                <SignUpButton />
                {hasWorkshopPermission ? (
                  <AddMembersField members={members} participants={participants} addParticipant={addParticipant} />
                ) : null}
              </>
            ) : null}
          </Stack>
        </>
      ) : null}
    </Container>
  );
};

export default WorkshopInstanceDetails;
