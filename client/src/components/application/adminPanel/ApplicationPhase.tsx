import React from "react";
import { GenerationDto } from "../../../types/applicationTypes";
import { Paper, Stack, Typography } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";
import dayjs from "dayjs";

/**
 * The interface for the ApplicationPhase component props
 */
interface ApplicationPhaseProps {
  currentGeneration: GenerationDto;
}

/**
 * The ApplicationPhase component displays the current generation's application phase information
 * @param currentGeneration The current generation
 * @returns The ApplicationPhase component
 */
const ApplicationPhase = ({ currentGeneration }: ApplicationPhaseProps) => {
  const isMobile = useResponsive("down", "sm");

  const applicationPhaseText =
    dayjs().isAfter(dayjs(currentGeneration.applicationStart)) &&
    dayjs().isBefore(dayjs(currentGeneration.applicationEnd))
      ? "Die Bewerbungsphase läuft."
      : dayjs().isAfter(dayjs(currentGeneration.applicationEnd))
      ? "Die Bewerbungsphase ist beendet."
      : "Die Bewerbungsphase hat noch nicht begonnen. Hier kannst du den Zeitrahmen ändern:";

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography sx={{ mb: 2 }}>{applicationPhaseText}</Typography>
      <Typography sx={{ mb: 3 }}>
        <strong>Hinweis:</strong> Die Termine für das Auswahlwochenende und das WW werden benötigt, weil sie auf der
        Bewerbermaske angezeigt werden. Der Türcode wird den erfolgreichen Bewerbern bei der Trainee-Aufnahme in der
        Willkommens-Mail zugeschickt.
      </Typography>
      <Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Generation:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {currentGeneration.description}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Bewerbung Start:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {dayjs(currentGeneration.applicationStart).format("DD.MM.YYYY")}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Bewerbung Ende:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {dayjs(currentGeneration.applicationEnd).format("DD.MM.YYYY")}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            WW Termin:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {dayjs(currentGeneration.wwDateStart).format("DD.MM.YYYY")} -{" "}
            {dayjs(currentGeneration.wwDateEnd).format("DD.MM.YYYY")}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Auswahl-WE Termin:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {dayjs(currentGeneration.selectionWeDateStart).format("DD.MM.YYYY")} -{" "}
            {dayjs(currentGeneration.selectionWeDateEnd).format("DD.MM.YYYY")}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Infoabend-Besucher:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {currentGeneration.infoEveningVisitors}
          </Typography>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"}>
          <Typography gutterBottom fontWeight={"bold"} flex={1}>
            Türcode:
          </Typography>
          <Typography textAlign={"start"} flex={3}>
            {currentGeneration.doorCode}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ApplicationPhase;
