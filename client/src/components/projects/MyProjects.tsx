import React from "react";
import { Grid } from "@mui/material";
import { Project } from "../../types/projectTypes";
import ProjectCard from "./projectCard/ProjectCard";

interface MyProjectsProps {
  projects: Project[];
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
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={project.projectID}>
          <ProjectCard {...project} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MyProjects;
