import React, { FunctionComponent, useEffect, useState } from "react";
import { Stack, Typography, Container } from "@mui/material";

import NewWorkshopButton from "../../components/event/NewWorkshopButton";

import { Workshop } from "../../types/eventTypes";

import { useAuth } from "../../hooks/useAuth";
import useResponsive from "../../hooks/useResponsive";

import { schulung as res } from "../../mock/events/schulung";
import WorkshopsOverviewTable from "../../components/event/WorkshopsOverviewTable";
import WorkshopsOverviewCard from "../../components/event/WorkshopsOverviewCard";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";

/**
 * Component to display a table or cards of all workshops
 * @returns Displays all workshops
 */
const DisplayWorkshopsOverview: FunctionComponent = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const { auth } = useAuth();
  const { permissions } = auth;
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(permissions, [4]);

  const isMobile = useResponsive("down", "sm");

  // Function to get all workshops
  // TODO: Replace mock with real data
  const getWorkshops = () => {
    const transformedRes: Workshop[] = [];
    res.forEach((workshop) => {
      transformedRes.push({
        workshopID: workshop.schulungId,
        workshopName: workshop.schulungsName,
        workshopType: workshop.art as "Pflichtworkshop" | "Workshop" | "Externer Workshop",
        workshopDescription: workshop.beschreibung,
      });
    });
    setWorkshops(transformedRes);
    return;
  };

  useEffect(() => {
    getWorkshops();
  }, []);

  return (
    <Container sx={{ ml: isMobile ? 0 : 1, mr: isMobile ? 0 : 1 }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        alignContent={"center"}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Alle Workshops
        </Typography>
        {hasWorkshopPermission ? <NewWorkshopButton /> : null}
      </Stack>
      {isMobile ? (
        <Stack direction={"column"} spacing={2}>
          {workshops.map((workshop, index) => {
            return <WorkshopsOverviewCard workshop={workshop} key={index} />;
          })}
        </Stack>
      ) : (
        <WorkshopsOverviewTable workshops={workshops} />
      )}
    </Container>
  );
};

export default DisplayWorkshopsOverview;
