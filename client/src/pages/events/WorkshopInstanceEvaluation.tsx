import React, { useEffect, useState } from "react";
import { Box, Button, Container, Divider, List, ListItem, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useParams, Link } from "react-router-dom";
import dayjs from "dayjs";
import useResponsive from "../../hooks/useResponsive";

import { Workshop, WorkshopInstance, WorkshopInstanceFeedback } from "../../types/eventTypes";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EventChip from "../../components/event/EventChip";
import WorkshopInstanceEvaluationTable from "../../components/event/WorkshopInstanceEvaluationTable";
import WorkshopInstanceEvaluationAccordions from "../../components/event/WorkshopInstanceEvaluationAccordions";
import WorkshopInstanceTextEvaluation from "../../components/event/WorkshopInstanceTextEvaluation";

import { schulungsInstanzFeedback } from "../../mock/events/schulungsInstanzFeedback";
import { schulungsinstanz } from "../../mock/events/schulungsinstanz";
import { schulung } from "../../mock/events/schulung";

/**
 * This component is responsible for rendering the workshop instance evaluation page.
 * @returns the workshop instance evaluation page
 */
const WorkshopInstanceEvaluation: React.FunctionComponent = () => {
  const { workshopInstanceID } = useParams();
  const [workshopInstance, setWorkshopInstance] = useState<WorkshopInstance | undefined>(undefined);
  const [workshop, setWorkshop] = useState<Workshop | undefined>(undefined);
  const [workshopInstanceFeedback, setWorkshopInstanceFeedback] = useState<WorkshopInstanceFeedback>();

  const isMobile = useResponsive("down", "sm");

  const getWorkshopInstance = () => {
    setWorkshopInstance(
      (schulungsinstanz.find(
        (workshopInstance) => workshopInstance.schulungsinstanzID === Number(workshopInstanceID)
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

  const getWorkshopInstanceFeedback = (workshopInstanceID: number) => {
    const result = schulungsInstanzFeedback.find((feedback) => feedback.schulung_schulungID === workshopInstanceID);
    setWorkshopInstanceFeedback(result);
  };

  const handleFinishFeedback = () => {
    alert("Feedback abgeschlossen");
  };

  useEffect(() => {
    getWorkshopInstance();
  }, []);

  useEffect(() => {
    if (workshopInstance) {
      getWorkshop(workshopInstance.schulungId);
    }
  }, [workshopInstance]);

  useEffect(() => {
    if (workshopInstance) {
      getWorkshopInstanceFeedback(workshopInstance.schulungsinstanzID);
    }
  }, [workshopInstance]);

  const instanceFields: Array<InformationField> = [
    {
      label: "Durchschnitt",
      value: workshopInstanceFeedback ? "Ø " + workshopInstanceFeedback.gesamt.toString() : null,
      type: "text",
    },
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
      label: "Max. Teilnehmeranzahl",
      value: workshopInstance ? workshopInstance.maximaleTeilnehmer.toString() : null,
      type: "text",
    },
  ];

  return workshopInstance === undefined || workshop === undefined || workshopInstanceFeedback === undefined ? (
    <Skeleton />
  ) : (
    <Container sx={{ ml: isMobile ? 0 : 3 }}>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={{ mb: 1 }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Workshop-Termin Feedback
        </Typography>
        {workshopInstanceFeedback.mitgliederOhneFeedback.length === 0 ? (
          <Button
            variant="contained"
            onClick={handleFinishFeedback}
            sx={{ fontWeight: 600, fontSize: isMobile ? 10 : 14 }}
            color="info"
            startIcon={<CheckCircle />}
          >
            Feedbackphase abschließen
          </Button>
        ) : null}
      </Stack>
      <Paper sx={{ pl: 3, pr: 3, pt: 1 }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h6" color="primary" fontWeight={"bold"}>
            Auswertung
          </Typography>
          <EventChip type={workshop ? workshop.art : "Sonstige"} sx={{ ml: 3 }} size="medium" />
        </Stack>

        <Box sx={{ mr: "auto", pt: 1, maxWidth: 800 }}>
          <InfoSection fields={instanceFields} />
        </Box>
        <Divider light sx={{ width: "95%", borderColor: "#f6891f", mt: 2, mb: 2 }} />
        <Box sx={{ maxWidth: 1000 }}>
          <WorkshopInstanceEvaluationAccordions
            workshopInstanceFeedbackFragen={workshopInstanceFeedback.fragen}
            workshopInstanceFeedbackReferenten={workshopInstanceFeedback.referenten}
          />
          <WorkshopInstanceTextEvaluation textFeedback={workshopInstanceFeedback.textFeedback} />
        </Box>
        {/* <WorkshopInstanceEvaluationTable workshopInstance={workshopInstance} /> */}
        {workshopInstanceFeedback.status === "Feedback" ? (
          <>
            <Divider light sx={{ width: "95%", borderColor: "#f6891f", mt: 2, mb: 2 }} />
            <Box sx={{ maxWidth: 1000, pb: 3 }}>
              <Typography fontWeight={"bold"} fontSize={18}>
                Fehlendes Feedback
              </Typography>
              {workshopInstanceFeedback.mitgliederOhneFeedback.length > 0 ? (
                <Box>
                  <Typography>Die folgenden Teilnehmer haben noch kein Feedback abgegeben:</Typography>
                  <List dense sx={{ listStyle: "square", pl: 2 }}>
                    {workshopInstanceFeedback.mitgliederOhneFeedback.map((mitglied) => {
                      return (
                        <ListItem key={mitglied.mitgliedID} sx={{ display: "list-item" }} disablePadding disableGutters>
                          <Link
                            to={`/gesamtuebersicht${mitglied.mitgliedID}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {mitglied.vorname} {mitglied.nachname}
                          </Link>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              ) : (
                <Box>
                  <Typography>Alle anwesenden Teilnehmer haben ihr Feedback abgegeben.</Typography>
                  <Button
                    variant="contained"
                    onClick={handleFinishFeedback}
                    sx={{ fontWeight: 600, fontSize: isMobile ? 10 : 14 }}
                    color="info"
                    startIcon={<CheckCircle />}
                  >
                    {isMobile ? "Feedback" : "Feedback anzeigen"}
                  </Button>
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default WorkshopInstanceEvaluation;
