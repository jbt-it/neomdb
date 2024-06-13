import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Paper, Typography, useMediaQuery } from "@mui/material";

import InfoSection, { InformationField } from "../../components/general/InfoSection";

import { Workshop, WorkshopInstance } from "../../types/eventTypes";

import useResponsive from "../../hooks/useResponsive";
import { Stack } from "@mui/system";
import WorkshopButton from "../../components/events/workshops/WorkshopButton";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import WorkshopInstanceButton from "../../components/events/workshops/WorkshopInstanceButton";
import WorkshopInstanceTable from "../../components/events/workshops/WorkshopInstanceTable";

import { schulung as res } from "../../mock/events/schulung";
import { schulungsinstanz as res2 } from "../../mock/events/schulungsinstanz";
import { AuthContext } from "../../context/auth-context/AuthContext";

/**
 * Displays the details of a workshop.
 * @returns The details of a workshop and a table of all workshop instances.
 */
const WorkshopDetails = () => {
  const [workshop, setWorkshop] = useState<Workshop | undefined>(undefined);
  const [workshopInstances, setWorkshopInstances] = useState<WorkshopInstance[]>([]);
  const { id } = useParams<{ id: string }>();
  const { auth } = useContext(AuthContext);
  const { permissions } = auth;
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(permissions, [4]);

  const isMobile = useResponsive("down", "sm");
  const isSmall = useMediaQuery("(max-width: 1330px)"); // Used for better display on smaller screens

  // Retrieve the workshop information with the given id
  const getWorkshop = (id: number) => {
    const foundWorkshop = res.find((workshop) => workshop.schulungId === id) as Workshop;
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    } else {
      alert(`No workshop found with id ${id}`);
    }
  };

  // Retrieve all workshop instances with the given workshop id
  const getWorkshopInstances = (id: number) => {
    const foundWorkshopInstances = res2.filter((workshop) => workshop.schulungId === id) as WorkshopInstance[];
    setWorkshopInstances(foundWorkshopInstances);
  };

  useEffect(() => {
    getWorkshop(Number(id));
  }, []);

  useEffect(() => {
    if (workshop) {
      getWorkshopInstances(workshop.schulungId);
    }
  }, [workshop]);

  // Fields to display in the info section
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
      <Stack
        direction={isSmall && !isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        sx={{ mb: 5 }}
        alignItems={isSmall ? "start" : "center"}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"} sx={{ mr: 3 }}>
          {isMobile ? "Details" : "Informationen zum Workshop"}
        </Typography>
        {hasWorkshopPermission ? (
          <Stack direction={"row"} spacing={2}>
            <WorkshopButton
              edit
              workshopName={workshop?.schulungsName}
              workshopDescription={workshop?.beschreibung}
              workshopType={workshop?.art}
            />
            <WorkshopInstanceButton workshop={workshop} />
            <WorkshopButton deletion />
          </Stack>
        ) : null}
      </Stack>
      <InfoSection fields={displayFields} />
      {workshopInstances.length > 0 && <WorkshopInstanceTable workshopInstances={workshopInstances.reverse()} />}
    </Container>
  );
};

export default WorkshopDetails;
