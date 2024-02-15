import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Stack, Typography, Container } from "@mui/material";

import WorkshopButton from "../../components/events/workshops/WorkshopButton";

import { Workshop } from "../../types/eventTypes";

import useResponsive from "../../hooks/useResponsive";

import { schulung as res } from "../../mock/events/schulung";
import WorkshopsOverviewTable from "../../components/events/workshops/WorkshopsOverviewTable";
import WorkshopsOverviewCard from "../../components/events/workshops/WorkshopsOverviewCard";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";

/**
 * Component to display a table or cards of all workshops
 * @returns Displays all workshops
 */
const DisplayWorkshopsOverview: FunctionComponent = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const { auth } = useContext(AuthContext);
  const { permissions } = auth;
  const hasWorkshopPermission = doesPermissionsHaveSomeOf(permissions, [4]);

  const isMobile = useResponsive("down", "sm");

  // Function to get all workshops
  // TODO: Replace mock with real data
  const getWorkshops = () => {
    setWorkshops(res as Workshop[]);
    return;
  };

  useEffect(() => {
    getWorkshops();
  }, []);

  return (
    <Container sx={{ ml: isMobile ? 0 : 2, mr: isMobile ? 0 : 2 }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        alignContent={"center"}
        sx={{ mb: 2, maxWidth: "98%" }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Alle Workshops
        </Typography>
        {hasWorkshopPermission ? <WorkshopButton /> : null}
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
