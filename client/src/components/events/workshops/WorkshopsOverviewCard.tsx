import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import { Workshop } from "../../../types/eventTypes";
import EventChip from "../EventChip";
import { Link } from "react-router-dom";

interface WorkshopsOverviewCardProps {
  workshop: Workshop;
}

/**
 * Component to display a card of a workshop
 * @param workshop - the workshop to display
 * @returns the workshop in a card
 */
const WorkshopsOverviewCard = ({ workshop }: WorkshopsOverviewCardProps) => {
  return (
    <Card sx={{ minHeight: 100 }} key={workshop.schulungId}>
      <Link to={`/workshops/${workshop.schulungId}`} style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent>
          <EventChip type={workshop.art} size="small" sx={{ ml: -0.5 }} />
          <Typography variant="body1" fontWeight={"bold"}>
            {workshop.schulungsName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {workshop.beschreibung}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default WorkshopsOverviewCard;
