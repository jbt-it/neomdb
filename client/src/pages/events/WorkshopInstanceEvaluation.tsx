import React, { useEffect, useState } from "react";
import { Box, Container, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { useParams } from "react-router-dom";

import { schulung } from "../../mock/events/schulung";
import { schulungsinstanz } from "../../mock/events/schulungsinstanz";
import { Workshop, WorkshopInstance } from "../../types/eventTypes";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EventChip from "../../components/event/EventChip";
import dayjs from "dayjs";
import WorkshopInstanceQuestions from "../../components/event/WorkshopInstanceQuestions";
import WorkshopInstanceEvaluationTable from "../../components/event/WorkshopInstanceEvaluationTable";

/**
 * This component is responsible for rendering the workshop instance evaluation page.
 * @returns the workshop instance evaluation page
 */
const WorkshopInstanceEvaluation: React.FunctionComponent = () => {
  const { workshopInstanceID } = useParams();
  const [workshopInstance, setWorkshopInstance] = useState<WorkshopInstance | undefined>(undefined);
  const [workshop, setWorkshop] = useState<Workshop | undefined>(undefined);

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

  useEffect(() => {
    getWorkshopInstance();
  }, []);

  useEffect(() => {
    if (workshopInstance) {
      getWorkshop(workshopInstance.schulungId);
    }
  }, [workshopInstance]);

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

  return workshopInstance === undefined || workshop === undefined ? (
    <Skeleton />
  ) : (
    <Container sx={{ ml: isMobile ? 0 : 3 }}>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"flex-start"} sx={{ mb: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Workshop-Termin Auswertung
        </Typography>
      </Stack>
      <Paper sx={{ pl: 3, pr: 3, pt: 1 }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h6" color="primary" fontWeight={"bold"}>
            Details
          </Typography>
          <EventChip type={workshop ? workshop.art : "Sonstige"} sx={{ ml: 3 }} size="medium" />
        </Stack>
        <Box sx={{ mr: "auto", pt: 1, maxWidth: 600 }}>
          <InfoSection fields={instanceFields} />
        </Box>
        <Divider light sx={{ width: "95%", borderColor: "#f6891f", mt: 2, mb: 2 }} />
        <Typography variant="h6" color="primary" fontWeight={"bold"}>
          Auswertung
        </Typography>
        <WorkshopInstanceQuestions workshopInstance={workshopInstance} />
        <WorkshopInstanceEvaluationTable workshopInstance={workshopInstance} />
      </Paper>
    </Container>
  );
};

export default WorkshopInstanceEvaluation;
