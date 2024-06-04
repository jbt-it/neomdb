import React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MyProjects from "../../components/projects/MyProjects";
import ProjectTenders from "../../components/projects/ProjectTenders";
import AllProjects from "../../components/projects/AllProjects";
import useProjects from "../../hooks/useProjects";

/**
 * ProjectOverview component
 * Handles the tabs for project tenders, my projects and all projects
 * @returns ProjectOverview component
 */
const ProjectOverview = () => {
  const [value, setValue] = React.useState("projectTenders");
  const { projects, allProjects, tenderedProjects } = useProjects();

  // Handles the tab change
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChangeTab} variant="scrollable" centered>
          <Tab label="Projektausschreibungen" value="projectTenders" />
          <Tab label="Meine Projekte" value="myProjects" />
          <Tab label="Alle Projekte" value="allProjects" />
        </TabList>
      </Box>
      <TabPanel value="projectTenders">
        <ProjectTenders tenderedProjects={tenderedProjects} />
      </TabPanel>
      <TabPanel value="myProjects">
        <MyProjects projects={projects} />
      </TabPanel>
      <TabPanel value="allProjects">
        <AllProjects projects={allProjects} />
      </TabPanel>
    </TabContext>
  );
};

export default ProjectOverview;
