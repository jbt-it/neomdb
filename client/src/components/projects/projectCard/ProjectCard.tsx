import { Box, Card, CardActionArea, CardContent, Divider, Typography } from "@mui/material";
import React, { MouseEvent } from "react";
import ProjectChip from "./ProjectChip";
import { useNavigate } from "react-router-dom";
import { ProjectShortDto } from "../../../types/projectTypes";
import ProjectMemberList from "../projectCard/ProjectMemberList";

/**
 * ProjectCard component to display a project card
 * @param param - ProjectID, ProjectName, ProjectStatus and ProjectMembers
 * @returns - A card component with the project details
 */
const ProjectCard = ({ projectId, projectName, status, projectMembers }: ProjectShortDto) => {
  const navigate = useNavigate();

  // Navigate to the project details page
  const handleNavigate = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/projekt/${projectId}`);
  };

  return (
    <Card sx={{ maxWidth: 345 }} key={`Projekt-${projectId}`}>
      <CardActionArea onClick={handleNavigate}>
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
    </Card>
  );
};

export default ProjectCard;
