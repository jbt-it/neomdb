import { Button, Grid, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import TenderedProjectCard from "./projectCard/TenderedProjectCard";
import { TenderedProject } from "../../types/projectTypes";
import { AddCircle } from "@mui/icons-material";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useResponsive from "../../hooks/useResponsive";

interface ProjectTendersProps {
  tenderedProjects: TenderedProject[];
}

/**
 * Component to display all tendered projects in a grid
 * @param param - List of tendered projects
 * @returns - A grid with all tendered projects
 */
const ProjectTenders = ({ tenderedProjects }: ProjectTendersProps) => {
  const { auth } = useContext(AuthContext);
  const hasPermissionExternalProject = doesPermissionsHaveSomeOf(auth.permissions, [19]);
  const isMobile = useResponsive("down", "sm");

  return (
    <>
      {hasPermissionExternalProject ? (
        <Stack direction={"row"} spacing={3} sx={{ marginBottom: 2 }}>
          <Button variant="contained" startIcon={<AddCircle />} sx={{ height: 40 }}>
            <Typography fontSize={isMobile ? 12 : 14}>Projekt ausschreiben</Typography>
          </Button>
          <Button variant="contained" startIcon={<AddCircle />} sx={{ height: 40 }}>
            <Typography fontSize={isMobile ? 12 : 14}> Projekt nachtragen</Typography>
          </Button>
        </Stack>
      ) : null}
      <Grid container>
        {tenderedProjects.map((project) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={project.projectID}>
            <TenderedProjectCard {...project} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProjectTenders;
