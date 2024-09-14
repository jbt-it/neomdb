import React from "react";
import { Generation } from "../../types/traineesTypes";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import jbtLogo from "../../assets/jbt-logo.png";
import dayjs from "dayjs";

/**
 * Interface for the props of the ApplicationForm component
 */
interface ApplicationFormProps {
  generation: Generation;
}

/**
 * This component displays the application form for the Junior Business Team
 * @param generation The generation for which the application form is displayed
 * @returns the application form component
 */
const ApplicationForm = ({ generation }: ApplicationFormProps) => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Paper
      elevation={10}
      sx={{
        minHeight: "50vh",
        minWidth: isMobile ? "80vw" : "55vw",
        maxWidth: "70vw",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        p: 5,
        m: 4,
      }}
    >
      <Stack justifyContent={"center"} alignItems={"center"} spacing={6}>
        <Box
          sx={{ maxHeight: isMobile ? "50vh" : "25vh", maxWidth: isMobile ? "50vw" : "25vw" }}
          component="img"
          src={jbtLogo}
        />
        <Typography variant="body1" textAlign={isMobile ? "start" : "center"} fontSize={isMobile ? 14 : 18}>
          Herzlich willkommen zur Online-Bewerbung für das <strong>Junior Business Team</strong>! Nimm dir bitte kurz
          Zeit, um die Fragen auf den folgenden Seiten auszufüllen. Überall, wo ein grünes Plus steht (z.B. bei
          Praktika) kannst du durch einen Klick darauf mehrere Felder öffnen. Nach Bewerbungsschluss erhältst du dann
          von uns eine Rückmeldung bezüglich des Auswahlwochenendes. Am Auswahlwochenende findet ein Kennenlerngespräch
          statt und du hast die Möglichkeit, dein Können in einer kleinen Case Study unter Beweis zu stellen. Bei Fragen
          kannst du dich an <strong>mitglieder@studentische-beratung.de</strong> wenden. Solltest du Probleme beim
          Hochladen einer Datei haben, sende diese bitte per Email an{" "}
          <strong>bewerbung@studentische-beratung.de</strong>. Viel Erfolg beim Ausfüllen! Die Bewerbungsphase endet am{" "}
          <strong>{dayjs(generation.applicationEnd).format("DD.MM.YYYY")}</strong> um{" "}
          <strong>{dayjs(generation.applicationEnd).format("hh:mm")}</strong>.
        </Typography>
        <Button variant="contained" color="primary" fullWidth>
          Jetzt bewerben
        </Button>
      </Stack>
    </Paper>
  );
};

export default ApplicationForm;
