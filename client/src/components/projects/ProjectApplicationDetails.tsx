import React from "react";
import { ProjectApplicantDto } from "../../types/projectTypes";
import { List, ListItem, Stack, Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { Link } from "react-router-dom";

/**
 * Props for the ProjectApplicationDetails component
 */
interface ProjectApplicationDetailsProps {
  projectApplication: ProjectApplicantDto;
}

/**
 * Displays the details of a project application
 * @param projectApplication the project application to display
 * @returns the project application details
 */
const ProjectApplicationDetails = ({ projectApplication }: ProjectApplicationDetailsProps) => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Stack direction={"column"} spacing={1} width={"100%"} flex={1}>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Hochschule:
        </Typography>
        <Typography flex={3}>{projectApplication.university}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Studiengang:
        </Typography>
        <Typography flex={3}>{projectApplication.courseOfStudy}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Vertiefungen:
        </Typography>
        <Typography flex={3}>{projectApplication.specializations}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Praktika:
        </Typography>
        <Typography flex={3}>{projectApplication.internship}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Ausbildung:
        </Typography>
        <Typography flex={3}>{projectApplication.apprenticeship}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Werkstudenten-Tätigkeit:
        </Typography>
        <Typography flex={3}>{projectApplication.studentJob}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Seminararbeiten:
        </Typography>
        <Typography flex={3}>{projectApplication.seminarPapers}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Schulungen/Workshops:
        </Typography>
        <Typography flex={3}>
          {projectApplication.workshops.map((workshop) => workshop.schulungsName).join(", ")}
        </Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Internes Engagement:
        </Typography>
        <Typography flex={3}>{projectApplication.internalCommitment?.join(", ")}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Externe Projekterfahrung:
        </Typography>
        <List sx={{ listStyleType: "square", pl: 2, flex: 3 }} disablePadding dense>
          {projectApplication.externalProjects.map((project) => {
            return (
              <ListItem key={project.projectId} sx={{ display: "list-item" }} disablePadding>
                <Typography>
                  <Link to={`/projekte/${project.projectId}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {project.projectName} ({project.projectStart.toLocaleDateString()} bis{" "}
                    {project.projectEnd ? project.projectEnd.toLocaleDateString() : "(noch offen)"} als {project.type}{" "}
                    mit {project.btAllocation})
                  </Link>
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Akquise-Vorleistungen:
        </Typography>
        <Typography flex={3}>{projectApplication.preliminaryWork?.join(", ")}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Zeitliche Verfügbarkeit:
        </Typography>
        <Typography flex={3}>{projectApplication.availability}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Gründe und Dauer der Einschränkung:
        </Typography>
        <Typography flex={3}>{projectApplication.restriction}</Typography>
      </Stack>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
        <Typography fontWeight={"bold"} flex={1}>
          Motivation:
        </Typography>
        <Typography flex={3}>{projectApplication.motivation}</Typography>
      </Stack>
    </Stack>
  );
};

export default ProjectApplicationDetails;
