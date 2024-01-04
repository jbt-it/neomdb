import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Divider, Paper, Typography } from "@mui/material";

import InfoSection, { InformationField } from "../../components/general/InfoSection";

import { Workshop, WorkshopInstance } from "../../types/eventTypes";

import { schulung as res } from "../../mock/events/schulung";
import useResponsive from "../../hooks/useResponsive";
import { Stack } from "@mui/system";
import NewWorkshopButton from "../../components/event/NewWorkshopButton";
import { useAuth } from "../../hooks/useAuth";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

const DisplayWorkshopDetails = () => {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [workshopInstances, setWorkshopInstances] = useState<WorkshopInstance[]>([]);
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const { permissions } = auth;
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(permissions, [4]);

  const isMobile = useResponsive("down", "sm");

  const getWorkshop = (id: number) => {
    const foundWorkshop = res.find((workshop) => workshop.schulungId === id) as Workshop;
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    } else {
      alert(`No workshop found with id ${id}`);
    }
  };

  useEffect(() => {
    getWorkshop(Number(id));
  }, []);

  const displayFields: Array<InformationField> = [
    {
      label: "Workshopname",
      value: workshop ? workshop.schulungsName : null,
      type: "text",
    },
    {
      label: "Beschreibung",
      value: workshop ? workshop.beschreibung : null,
      type: "text",
    },
    {
      label: "Art",
      value: workshop ? workshop.art : null,
      type: "text",
    },
  ];
  return (
    <Container component={Paper} sx={{ m: 2, p: 2 }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"} sx={{ mb: 2 }}>
          {isMobile ? "Details" : "Informationen zum Workshop"}
        </Typography>
        {hasWorkshopPermission ? (
          <NewWorkshopButton
            edit
            workshopName={workshop?.schulungsName}
            workshopDescription={workshop?.beschreibung}
            workshopType={workshop?.art}
          />
        ) : null}
      </Stack>
      <InfoSection fields={displayFields} />
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Container>
  );
};

export default DisplayWorkshopDetails;
