import { Box, Card, CardActionArea, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
import ProjectChip from "./ProjectChip";
import { ProjectShortDto } from "../../../types/projectTypes";
import ProjectMemberList from "../projectCard/ProjectMemberList";
import { Link } from "react-router-dom";

/**
 * ProjectCard component to display a project card
 * @param projectId - The ID of the project
 * @param projectName - The name of the project
 * @param status - The status of the project
 * @param projectMembers - The members of the project
 * @returns - A card component with the project details
 */
const ProjectCard = ({ projectId, projectName, status, projectMembers }: ProjectShortDto) => {
  return (
    <Card sx={{ maxWidth: 345 }} key={`Projekt-${projectId}`}>
      <Link to={`/projekte/${projectId}`} style={{ textDecoration: "none", color: "black" }}>
        <CardActionArea>
          <CardContent>
            <Box sx={{ mb: 1 }}>
              <ProjectChip status={status} />
            </Box>
            <Box>
              <Typography fontWeight="bold">{projectName}</Typography>
            </Box>
            <Divider sx={{ marginBottom: 3 }} />
            <ProjectMemberList projectMembers={projectMembers} />
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ProjectCard;
