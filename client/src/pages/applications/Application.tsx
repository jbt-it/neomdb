import React from "react";
import { Generation } from "../../types/traineesTypes";
import { Box, Container, Stack } from "@mui/system";
import { Paper, Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import jbtLogo from "../../assets/jbt-logo.png";
import dayjs from "dayjs";
import ApplicationForm from "../../components/application/ApplicationForm";

// Current generation data
const CurrentGeneration = {
  generationId: 1,
  description: "Wintersemester 24/25",
  applicationStart: new Date("2024-01-01"),
  applicationEnd: new Date("2024-12-01"),
  selectionWeDateStart: new Date("2024-03-01"),
  selectionWeDateEnd: new Date("2024-03-15"),
  wwDateStart: new Date("2024-04-01"),
  wwDateEnd: new Date("2024-04-15"),
  infoEveningVisitors: null,
  doorCode: null,
  electionStart: null,
  electionEnd: null,
} as Generation;

/**
 * This component displays the application phase for the Junior Business Team
 * @returns the application component
 */
const Application = () => {
  const currentGeneration = CurrentGeneration;
  const isMobile = useResponsive("down", "sm");

  // Check if the application phase has not yet started
  if (currentGeneration.applicationStart !== null && currentGeneration.applicationStart > new Date()) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          background: "#f1f1f1",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            minHeight: "50vh",
            minWidth: isMobile ? "80vw" : "55vw",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Stack justifyContent={"center"} alignItems={"center"} spacing={6}>
            <Box
              sx={{ maxHeight: isMobile ? "40vh" : "25vh", maxWidth: isMobile ? "40vw" : "25vw" }}
              component="img"
              src={jbtLogo}
            />
            <Typography variant="body1" textAlign={"center"} fontSize={20}>
              Die Bewerbungsphase für das <strong>{currentGeneration.description}</strong> {isMobile ? " " : <br />}
              beginnt erst am <strong>{dayjs(currentGeneration.applicationStart).format("DD.MM.YYYY")}</strong> um{" "}
              <strong>{dayjs(currentGeneration.applicationStart).format("hh:mm")} Uhr</strong>.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Check if the application phase is currently running
  if (
    currentGeneration.applicationStart !== null &&
    currentGeneration.applicationEnd !== null &&
    currentGeneration.applicationStart < new Date() &&
    currentGeneration.applicationEnd > new Date()
  ) {
    return <ApplicationForm generation={currentGeneration} />;
  }

  // Else the application phase has ended
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#f1f1f1",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          minHeight: "50vh",
          minWidth: isMobile ? "80vw" : "55vw",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Stack justifyContent={"center"} alignItems={"center"} spacing={6}>
          <Box
            sx={{ maxHeight: isMobile ? "40vh" : "25vh", maxWidth: isMobile ? "40vw" : "25vw" }}
            component="img"
            src={jbtLogo}
          />
          <Typography variant="body1" textAlign={"center"} fontSize={20}>
            Die Bewerbungsphase für das <strong>{currentGeneration.description}</strong> ist beendet.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Application;
