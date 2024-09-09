import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { ExpandMore, OpenInNew } from "@mui/icons-material";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import { Link, useParams } from "react-router-dom";
import ProjectApplicationDetails from "../../components/projects/ProjectApplicationDetails";
import { stringAvatar } from "../../utils/stringUtils";

/**
 * Project Applications overview page
 * @returns ProjectApplication page
 */
const ProjectApplications = () => {
  const isMobile = useResponsive("down", "sm");
  const { id } = useParams();
  const { projectApplications, projectDetails } = useProjectDetails(Number(id));
  const [columns, setColumns] = React.useState(12);

  const styles = {
    avatar: {
      fontSize: "0.75rem",
      width: 30,
      height: 30,
    },
    groupedAvatar: {
      fontSize: "0.75rem",
      width: 40,
      height: 40,
    },
  };

  // handles the column count for the project applications
  const handleColumns = (event: React.MouseEvent<HTMLElement>, newAlignment: number) => {
    setColumns(newAlignment);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Stack
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"start"}
        sx={{ mb: 1, flex: 1, width: "100%" }}
        spacing={2}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Projektbewerbungen
        </Typography>
        <Accordion sx={{ flex: 1, width: "100%" }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight={"bold"}>
              Projektdetails
            </Typography>
          </AccordionSummary>
          <Stack direction={"column"} spacing={1} flex={1} sx={{ ml: 2, mr: 2, mb: 2 }}>
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 2}>
              <Typography fontWeight={"bold"} flex={1}>
                Projektname:
              </Typography>
              <Typography flex={3}>{projectDetails?.projectName}</Typography>
            </Stack>
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
        <Stack direction={"row"} spacing={10} alignItems={"center"}>
          <Typography variant="h6" fontWeight={"bold"}>
            Bewerbungen
          </Typography>
          <Stack direction={"row"} spacing={4} alignItems={"center"}>
            <Typography variant="body1">Spaltenanzahl:</Typography>
            <ToggleButtonGroup value={columns} exclusive onChange={handleColumns} size="small" color="primary">
              <ToggleButton value={12}>1</ToggleButton>
              <ToggleButton value={6}>2</ToggleButton>
              <ToggleButton value={4}>3</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
        <Grid container rowGap={2}>
          {projectApplications.map((application) => (
            <Grid item xs={isMobile ? 12 : columns}>
              <Accordion key={application.memberId} sx={{ flex: 1, width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    sx={{ flex: 1 }}
                    alignItems={isMobile ? "start" : "center"}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <Avatar
                        key={`Projektbewerber-Avatar-${application.memberId}`}
                        alt={`${application.firstname} ${application.lastname}`}
                        {...stringAvatar(`${application.firstname} ${application.lastname}`)}
                        style={styles.avatar}
                      />
                      <Typography fontWeight={"bold"} fontSize={18}>
                        {application.firstname} {application.lastname}
                      </Typography>
                    </Stack>
                    {!isMobile && <Typography sx={{ ml: 1, mr: 1 }}>-</Typography>}
                    <Typography>{application.memberStatus.name}</Typography>
                    {!isMobile && (
                      <Link
                        to={`/projekte/${id}/projektbewerbungen/${application.memberId}`}
                        style={{ marginLeft: "auto", marginRight: 30, color: "inherit", textDecoration: "none" }}
                      >
                        <OpenInNew />
                      </Link>
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 3 }} />
                  <ProjectApplicationDetails projectApplication={application} />
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default ProjectApplications;
