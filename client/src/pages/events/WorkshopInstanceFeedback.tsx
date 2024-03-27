import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { NumericFeedback, Workshop, WorkshopInstance } from "../../types/eventTypes";

import InfoSection, { InformationField } from "../../components/general/InfoSection";
import WorkshopInstanceFeedbackForm from "../../components/events/workshops/WorkshopInstanceFeedbackForm";

import { schulung } from "../../mock/events/schulung";
import { schulungsinstanz } from "../../mock/events/schulungsinstanz";
import { mitglied_has_schulungsinstanz } from "../../mock/events/mitglied_has_schulungsinstanz";
import useResponsive from "../../hooks/useResponsive";

/**
 * Displays the feedback form for a workshop instance
 * @returns The WorkshopInstanceFeedback component
 */
const WorkshopInstanceFeedback = () => {
  const { workshopInstanceID } = useParams<{
    workshopInstanceID: string;
  }>();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [workshopInstance, setWorkshopInstance] = useState<WorkshopInstance | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  const isMobile = useResponsive("down", "sm");

  // Function to get the workshop instance
  const getWorkshopInstance = () => {
    setWorkshopInstance(
      (schulungsinstanz.find(
        (workshopInstance) => workshopInstance.schulungsinstanzID === Number(workshopInstanceID)
      ) as WorkshopInstance) || null
    );
  };

  // Function to get the workshop
  const getWorkshop = (idWorkshop: number) => {
    const foundWorkshop = schulung.find((workshop) => workshop.schulungId === Number(idWorkshop)) as Workshop;
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    } else {
      alert(`No workshop found with id ${idWorkshop}`);
    }
  };

  // Checks if the user is participating in the workshop instance
  const checkParticipation = () => {
    if (workshopInstance) {
      const participatsList = mitglied_has_schulungsinstanz.filter(
        (workshopInstance) =>
          workshopInstance.schulungsinstanz_schulungsinstanzID === Number(workshopInstanceID) &&
          workshopInstance.anwesend === 1
      );
      if (participatsList.find((participant) => participant.mitglied_mitgliedID === Number(auth.userID))) {
        return true;
      } else {
        return false;
      }
    }
  };

  // Checks if the user has already given feedback for the workshop instance
  const checkFeedbackGiven = () => {
    if (checkParticipation()) {
      const participatsList = mitglied_has_schulungsinstanz.filter(
        (workshopInstance) =>
          workshopInstance.schulungsinstanz_schulungsinstanzID === Number(workshopInstanceID) &&
          workshopInstance.feedbackAbgegeben === 0
      );
      if (participatsList.find((participant) => participant.mitglied_mitgliedID === Number(auth.userID))) {
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    getWorkshopInstance();
  }, [dispatchAuth]);

  useEffect(() => {
    if (workshopInstance) {
      getWorkshop(workshopInstance.schulungId);
    }
  }, [workshopInstance]);

  const WorkshopInstanceDetailsFields: Array<InformationField> = [
    { label: "Name", value: workshop?.schulungsName || "", type: "text" },
    { label: "Datum", value: dayjs(workshopInstance?.datum).format("DD.MM.YYYY") || "", type: "text" },
    { label: "Ort", value: workshopInstance?.ort || "", type: "text" },
  ];

  // Function to submit the feedback to the DB, the feedback id will be generated in the backend
  const submitFeedback = (numericFeedback: NumericFeedback[], textFeedback: { [key: number]: string }) => {
    alert(
      "Feedback submitted " +
        "\n " +
        numericFeedback
          .map((numericFeedback) => `${numericFeedback.feedbackfrageID}: ${numericFeedback.bewertung}`)
          .join("\n") +
        "\n" +
        Object.entries(textFeedback)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
    );
  };

  return checkParticipation() ? (
    checkFeedbackGiven() ? (
      <Container sx={{ ml: isMobile ? 0 : 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Feedback für {workshop?.schulungsName}
        </Typography>
        <Typography>Vielen Dank, dein Feedback wurde bereits abgegeben!</Typography>
      </Container>
    ) : workshopInstance && workshop ? (
      <Container sx={{ ml: isMobile ? 0 : 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Feedback für {workshop?.schulungsName}
        </Typography>
        <Stack
          component={Paper}
          direction="column"
          sx={{ mt: 2, pt: isMobile ? 1 : 2, pb: isMobile ? 1 : 2, pl: isMobile ? 1 : 3, pr: isMobile ? 1 : 3 }}
          maxWidth={850}
        >
          <Typography variant="h6" color="primary" fontWeight={"bold"}>
            Workshopdetails
          </Typography>
          <InfoSection fields={WorkshopInstanceDetailsFields} />
          <Divider light sx={{ width: "95%", borderColor: "#f6891f", mt: 2, mb: 2 }} />
          <Typography variant="h6" fontWeight={"bold"} sx={{ mb: 3 }}>
            Bitte gib Dein Feedback ab:
          </Typography>
          <WorkshopInstanceFeedbackForm
            onSumbit={submitFeedback}
            workshopInstance={workshopInstance}
            workshopType={workshop.art}
          />
        </Stack>
      </Container>
    ) : (
      <Container sx={{ ml: isMobile ? 0 : 3 }}>
        <Skeleton variant="text" width="100%" height={60} />
        <Skeleton variant="rounded" width="100%" height={500} />
      </Container>
    )
  ) : (
    <Container sx={{ ml: isMobile ? 0 : 3 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
        Keine Berechtigung
      </Typography>
    </Container>
  );
};

export default WorkshopInstanceFeedback;
