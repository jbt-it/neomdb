import React from "react";
import { TenderedProjectDto } from "../../../types/projectTypes";
import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import ProjectChip from "./ProjectChip";

/**
 * Component for a tendered project card
 * @param projectID - ID of the project
 * @param projectName - Name of the project
 * @param projectStatus - Status of the project
 * @param projectText - Description of the project
 * @param applicationDeadline - Deadline for applications
 * @returns - A card component for a tendered project
 */
const TenderedProjectCard = ({
  projectId,
  projectName,
  status,
  situation,
  applicationDeadline,
}: TenderedProjectDto) => {
  return (
    <Card sx={{ maxWidth: 350 }} key={`Projekt-${projectId}`}>
      <CardContent sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ mb: 1 }}>
          <ProjectChip status={status} />
        </Box>
        <Box>
          <Typography fontWeight="bold">{projectName}</Typography>
        </Box>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography>{situation}</Typography>
        <Box
          sx={{
            backgroundColor: "#aeb0b2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 1.5,
            marginTop: 4,
            padding: 0.5,
          }}
        >
          <Typography color="#000" fontSize={14}>
            Bewirb dich jetzt bis zum:{" "}
            <span style={{ fontWeight: "bold" }}>{applicationDeadline.format("DD.MM.YYYY")}</span>
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button variant="contained">Bewerben</Button>
        <Button variant="outlined">Mehr Informationen</Button>
      </CardActions>
    </Card>
  );
};

export default TenderedProjectCard;
