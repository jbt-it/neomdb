import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { ExpandMore } from "@mui/icons-material";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import { useParams } from "react-router-dom";
import ProjectApplicationDetails from "../../components/projects/ProjectApplicationDetails";

const ProjectApplications = () => {
  const isMobile = useResponsive("down", "sm");
  const { id } = useParams();
  const { projectApplications, projectDetails } = useProjectDetails(Number(id));

  return (
    <Container maxWidth="lg" sx={{ flex: 1 }}>
      <Stack
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"start"}
        sx={{ mb: 1, flex: 1, width: "100%" }}
        spacing={2}
      >
        <Stack alignContent={"center"} sx={{ flex: 1, width: "100%" }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
            Projektbewerbungen
          </Typography>
          <Typography fontSize={16}>{projectDetails?.projectName}</Typography>
        </Stack>
        <Accordion sx={{ flex: 1, width: "100%" }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight={"bold"}>
              Projektdetails
            </Typography>
          </AccordionSummary>
          <Stack direction={"column"} spacing={1} flex={1} sx={{ ml: 2, mr: 2, mb: 2 }}>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Einsatzort:
              </Typography>
              <Typography flex={3}>{projectDetails?.jobSite}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Dauer:
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectDuration}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Konditionen:
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectEuroPerBT} € / BT</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Konditionen (Bereich):
              </Typography>
              <Typography flex={3}>
                {projectDetails?.estimatedProjectEuroPerBTrange}{" "}
                {projectDetails?.estimatedProjectEuroPerBTrange ? "€ / BT" : null}
              </Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Beratertage (Min):
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectBTmin}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Beratertage (Max):
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectBTmax}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Projektmitglieder (Min):
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectMemberMin}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Projektmitglieder (Max):
              </Typography>
              <Typography flex={3}>{projectDetails?.estimatedProjectMemberMax}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Ausgangssituation/Zielsetzung:
              </Typography>
              <Typography flex={3}>{projectDetails?.situation}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Besonderheiten:
              </Typography>
              <Typography flex={3}>{projectDetails?.peculiarities}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Kernkompetenzen:
              </Typography>
              <Typography flex={3}>{projectDetails?.coreCompetencies.map((c) => c.designation).join(", ")}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Anforderungsprofil:
              </Typography>
              <Typography flex={3}>{projectDetails?.requirementProfile}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Referenzprojekte:
              </Typography>
              <Typography flex={3}>{projectDetails?.referenceProjects}</Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Bemerkungen:
              </Typography>
              <Typography flex={3}>{projectDetails?.notes}</Typography>
            </Stack>
          </Stack>
        </Accordion>
        <Typography variant="h6" fontWeight={"bold"}>
          Bewerbungen
        </Typography>
        <Box>
          {projectApplications.map((application) => (
            <Accordion key={application.memberId} sx={{ flex: 1, width: "100%" }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction={isMobile ? "column" : "row"} alignItems={"start"} sx={{ flex: 1 }}>
                  <Typography fontWeight={"bold"} sx={{ mr: 1 }}>
                    {application.firstname} {application.lastname}
                  </Typography>
                  {!isMobile && <Typography sx={{ mr: 1 }}>-</Typography>}
                  <Typography>{application.memberStatus.name}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Divider />
                <ProjectApplicationDetails projectApplication={application} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Stack>
    </Container>
  );
};

export default ProjectApplications;
