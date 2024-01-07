import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import useResponsive from "../../hooks/useResponsive";
import { redirect, useParams } from "react-router-dom";

import { schulung } from "../../mock/events/schulung";
import { schulungsinstanz } from "../../mock/events/schulungsinstanz";
import { Workshop, WorkshopInstance } from "../../types/eventTypes";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import EventChip from "../../components/event/EventChip";
import dayjs from "dayjs";

const WorkshopInstanceEvaluation: React.FunctionComponent = () => {
  const { auth, dispatchAuth } = useAuth();
  const { permissions } = auth;
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(permissions, [4]);
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
    if (workshopInstance) {
      getWorkshop(workshopInstance.schulungId);
    }
  }, [dispatchAuth]);

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
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"flex-start"} sx={{ mb: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Informationen zum Workshop-Termin
        </Typography>
      </Stack>
      <Paper>
        <Stack direction={"row"} justifyContent={"space-between"} sx={{ pt: 2, ml: 3, mr: 3 }} alignItems={"center"}>
          <Typography variant="h6" color="primary" fontWeight={"bold"}>
            Details
          </Typography>
          <EventChip type={workshop ? workshop.art : "Sonstige"} sx={{ ml: 3 }} size="medium" />
        </Stack>
        <Box sx={{ ml: 3, mr: "auto", pt: 1, pb: 4, maxWidth: 600 }}>
          <InfoSection fields={instanceFields} />
        </Box>
      </Paper>
      <Stack
        sx={{
          justifyContent: "space-between",
          mt: 2,
        }}
        alignItems={isMobile ? "start" : "center"}
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 2 : 0}
      ></Stack>
    </Container>
  );
};

export default WorkshopInstanceEvaluation;
