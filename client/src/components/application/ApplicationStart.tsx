import React from "react";
import { Generation } from "../../types/traineesTypes";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import jbtLogo from "../../assets/jbt-logo.png";
import dayjs from "dayjs";

/**
 * Interface for the props of the ApplicationStart component
 */
interface ApplicationStartProps {
  generation: Generation;
  handleSetIsApplying: () => void;
}

/**
 * This component displays the application form for the Junior Business Team
 * @param generation The generation for which the application form is displayed
 * @returns the application form component
 */
const ApplicationStart = ({ generation, handleSetIsApplying }: ApplicationStartProps) => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Paper
      elevation={3}
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
        <Box width={isMobile ? "100%" : "70%"}>
          <Typography variant="body1" textAlign={"start"} fontSize={isMobile ? 16 : 18}>
            Herzlich willkommen zur Online-Bewerbung für das <strong>Junior Business Team</strong>!
            <br />
            <br />
            Nimm dir bitte kurz Zeit, um die Fragen auf den folgenden Seiten auszufüllen.
            <br />
            Überall, wo ein grünes Plus steht (z.B. bei Praktika) kannst du durch einen Klick darauf mehrere Felder
            öffnen. Nach Bewerbungsschluss erhältst du dann von uns eine Rückmeldung bezüglich des Auswahlwochenendes.
            Am Auswahlwochenende findet ein Kennenlerngespräch statt und du hast die Möglichkeit, dein Können in einer
            kleinen Case Study unter Beweis zu stellen. Bei Fragen kannst du dich an{" "}
            <strong>mitglieder@studentische-beratung.de</strong> wenden.
            <br />
            <br />
            Solltest du Probleme beim Hochladen einer Datei haben, sende diese bitte per Email an{" "}
            <strong>bewerbung@studentische-beratung.de</strong>.
            <br />
            <br />
            Viel Erfolg beim Ausfüllen!
            <br />
            <br />
            Die Bewerbungsphase endet am <strong>
              {dayjs(generation.applicationEnd).format("DD.MM.YYYY")}
            </strong> um <strong>{dayjs(generation.applicationEnd).format("hh:mm")}</strong>.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handleSetIsApplying}>
          Jetzt bewerben
        </Button>
      </Stack>
    </Paper>
  );
};

export default ApplicationStart;
