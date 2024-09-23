import { Box, Container, Stack, Tab, Typography } from "@mui/material";
import React, { useContext } from "react";
import useResponsive from "../../hooks/useResponsive";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useApplicants from "../../hooks/applications/useApplicants";
import ApplicationPhase from "../../components/application/adminPanel/ApplicationPhase";
import LoadingTable from "../../components/general/LoadingTable";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FeedbackStatistics from "../../components/application/adminPanel/FeedbackStatistics";
import TraineeApplicantsTable from "../../components/application/adminPanel/TraineeApplicantsTable";

/**
 * The ApplicationAdmin component displays the application phase information for the current generation, the trainee applicants and the feedback statistics
 * @returns The ApplicationAdmin component
 */
const ApplicationAdmin = () => {
  const isMobile = useResponsive("down", "sm");
  const { auth } = useContext(AuthContext);
  const { currentGeneration, feedbackStatistics } = useApplicants();
  const hasPermission = doesPermissionsHaveSomeOf(auth.permissions, [9]);
  const [value, setValue] = React.useState("applicants");

  // If the user does not have the permission to view this page, display a message
  if (!hasPermission) {
    return (
      <Container maxWidth="lg">
        <Stack>
          <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
            Du hast keine Berechtigung für diese Seite
          </Typography>
        </Stack>
      </Container>
    );
  }

  // If the current generation is not loaded yet, display the loading table
  if (!currentGeneration || !feedbackStatistics) {
    return <LoadingTable />;
  }

  // Handles the tab change
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          alignItems={isMobile ? "start" : "center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
            Bewerbungsphase
          </Typography>
        </Stack>
        <ApplicationPhase currentGeneration={currentGeneration} />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChangeTab}
              variant={isMobile ? "scrollable" : "standard"}
              centered={isMobile ? false : true}
            >
              <Tab label="Traineebewerber" value="applicants" />
              <Tab label="Feedback-Statistik" value="feedback" />
            </TabList>
          </Box>
          <TabPanel value="applicants">
            <TraineeApplicantsTable />
          </TabPanel>
          <TabPanel value="feedback">
            <FeedbackStatistics feedbackStatistics={feedbackStatistics} />
          </TabPanel>
        </TabContext>
      </Stack>
    </Container>
  );
};

export default ApplicationAdmin;
