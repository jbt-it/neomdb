import { Divider, Paper, Typography } from "@mui/material";
import React from "react";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import { useParams } from "react-router-dom";
import ProjectApplicationDetails from "../../components/projects/ProjectApplicationDetails";

/**
 * Project Application Details Page
 * @returns Project Application Details Page
 */
const ProjectApplicationDetailsPage = () => {
  const { id, memberId } = useParams();
  const { projectApplications } = useProjectDetails(Number(id));
  const projectapplicant = projectApplications.filter((applicant) => applicant.memberId === Number(memberId))[0];

  if (!projectapplicant) {
    return <div>Projektbewerbung nicht gefunden</div>;
  }
  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" fontWeight={"bold"}>
        {projectapplicant.firstname} {projectapplicant.lastname} - {projectapplicant.memberStatus.name}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <ProjectApplicationDetails projectApplication={projectapplicant} />
    </Paper>
  );
};

export default ProjectApplicationDetailsPage;
