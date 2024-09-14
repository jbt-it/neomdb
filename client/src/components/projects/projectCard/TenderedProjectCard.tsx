import React from "react";
import { TenderedProjectDto } from "../../../types/projectTypes";
import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import ProjectChip from "./ProjectChip";
import { Link } from "react-router-dom";

/**
 * Component for a tendered project card
 * @param projectID - ID of the project
 * @param projectName - Name of the project
 * @param projectStatus - Status of the project
 * @param projectText - Description of the project
 * @param applicationEnd1 - First Deadline for applications
 * @param applicationEnd2 - Second Deadline for applications
 * @returns - A card component for a tendered project
 */
const TenderedProjectCard = ({
  projectId,
  projectName,
  status,
  situation,
  applicationEnd1,
  applicationEnd2,
}: TenderedProjectDto) => {
  return (
    <Card sx={{ maxWidth: 350 }} key={`Projekt-${projectId}`}>
      <CardContent sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ mb: 1 }}>
          <ProjectChip status={status} />
        </Box>
        <Link to={`/projekte/${projectId}`} style={{ textDecoration: "none", color: "black" }}>
          <Typography fontWeight="bold">{projectName}</Typography>
        </Link>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography>{situation}</Typography>
        {applicationEnd1 ? (
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
              <span style={{ fontWeight: "bold" }}>
                {applicationEnd2 ? applicationEnd2.format("DD.MM.YYYY") : applicationEnd1.format("DD.MM.YYYY")}
              </span>
            </Typography>
          </Box>
        ) : null}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Link to={`/projekte/projektbewerbung/${projectId}`} style={{ textDecoration: "none" }}>
          <Button variant="contained">Bewerben</Button>
        </Link>
        <Button variant="outlined">Mehr Informationen</Button>
      </CardActions>
    </Card>
  );
};

export default TenderedProjectCard;
