import React from "react";
import { Grid } from "@mui/material";
import { ProjectShortDto } from "../../types/projectTypes";
import ProjectCard from "./projectCard/ProjectCard";

interface MyProjectsProps {
  projects: ProjectShortDto[];
}

/**
 * Renders a grid of project cards
 * @param projects List of projects as Project[]
 * @returns MyProjects component
 */
const MyProjects = ({ projects }: MyProjectsProps) => {
  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={project.projectId}>
          <ProjectCard {...project} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MyProjects;
