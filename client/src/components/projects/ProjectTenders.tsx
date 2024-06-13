import { Button, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import TenderedProjectCard from "./projectCard/TenderedProjectCard";
import { TenderedProjectDto } from "../../types/projectTypes";
import { AddCircle } from "@mui/icons-material";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useResponsive from "../../hooks/useResponsive";

interface ProjectTendersProps {
  tenderedProjects: TenderedProjectDto[];
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
        <Button
          variant="outlined"
          color={"info"}
          startIcon={<AddCircle />}
          sx={{ height: 40, marginBottom: 4 }}
          href="/projekte/projektausschreibung"
        >
          <Typography fontSize={isMobile ? 12 : 14}>Projekt ausschreiben</Typography>
        </Button>
      ) : null}
      <Grid container>
        {tenderedProjects.map((project) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={project.projectId}>
            <TenderedProjectCard {...project} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProjectTenders;
