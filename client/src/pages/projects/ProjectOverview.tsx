import React, { useContext } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MyProjects from "../../components/projects/MyProjects";
import ProjectTenders from "../../components/projects/ProjectTenders";
import AllProjects from "../../components/projects/allProjectsOverview/AllProjects";
import useProjects from "../../hooks/projects/useProjects";
import useResponsive from "../../hooks/useResponsive";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import ProjectBillingOverview from "../../components/projects/ProjectBillingOverview";

/**
 * ProjectOverview component
 * Handles the tabs for project tenders, my projects and all projects
 * @returns ProjectOverview component
 */
const ProjectOverview = () => {
  const [value, setValue] = React.useState("projectTenders");
  const { projects, allProjects, tenderedProjects } = useProjects();
  const isMobile = useResponsive("down", "sm");
  const { auth } = useContext(AuthContext);
  const hasBillingPermission = doesPermissionsHaveSomeOf(auth.permissions, [7]);

  // Handles the tab change
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList
          onChange={handleChangeTab}
          variant={isMobile ? "scrollable" : "standard"}
          centered={isMobile ? false : true}
        >
          <Tab label="Projektausschreibungen" value="projectTenders" />
          <Tab label="Meine Projekte" value="myProjects" />
          <Tab label="Alle Projekte" value="allProjects" />
          {hasBillingPermission ? <Tab label="Abrechnung" value="billing" /> : null}
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
      <TabPanel value="billing">
        <ProjectBillingOverview />
      </TabPanel>
    </TabContext>
  );
};

export default ProjectOverview;
