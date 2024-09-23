import { Box, Button, Container, Stack, Tab, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useApplicants from "../../hooks/applications/useApplicants";
import ApplicationPhase from "../../components/application/adminPanel/ApplicationPhase";
import LoadingTable from "../../components/general/LoadingTable";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FeedbackStatistics from "../../components/application/adminPanel/FeedbackStatistics";
import TraineeApplicantsTable from "../../components/application/adminPanel/TraineeApplicantsTable";
import NewGenerationDialog from "../../components/application/adminPanel/NewGenerationDialog";
import EditGenerationDialog from "../../components/application/adminPanel/EditGenerationDialog";
import { GenerationDto, NewGenerationRequestDto } from "../../types/applicationTypes";
import { Edit } from "@mui/icons-material";
import dayjs from "dayjs";

/**
 * The ApplicationAdmin component displays the application phase information for the current generation,
 * the trainee applicants, and the feedback statistics.
 */
const ApplicationAdmin = () => {
  const isMobile = useResponsive("down", "sm");
  const { auth } = useContext(AuthContext);
  const {
    currentGeneration,
    feedbackStatistics,
    applicantsEvaluations,
    createNewGeneration,
    updateGeneration,
    updateTraineeEvaluation,
    deleteApplication,
  } = useApplicants();
  const hasPermission = doesPermissionsHaveSomeOf(auth.permissions, [9]);

  const [value, setValue] = useState("applicants");
  const [newGenerationDialogOpen, setNewGenerationDialogOpen] = useState(false);
  const [editGenerationDialogOpen, setEditGenerationDialogOpen] = useState(false);

  const initialNewGenerationState: NewGenerationRequestDto = {
    description: "",
    applicationStart: null,
    applicationEnd: null,
    wwDateStart: null,
    wwDateEnd: null,
    selectionWeDateStart: null,
    selectionWeDateEnd: null,
  };

  const initialGenerationState: GenerationDto = currentGeneration
    ? { ...currentGeneration }
    : {
        generationId: 0,
        description: "",
        applicationStart: null,
        applicationEnd: null,
        selectionWeDateStart: null,
        selectionWeDateEnd: null,
        wwDateStart: null,
        wwDateEnd: null,
        infoEveningVisitors: null,
        doorCode: null,
        electionStart: null,
        electionEnd: null,
      };

  const [newGeneration, setNewGeneration] = useState(initialNewGenerationState);
  const [generation, setGeneration] = useState(initialGenerationState);

  // Helper functions to handle dialog and state updates
  const resetNewGenerationState = () => setNewGeneration(initialNewGenerationState);
  const resetGenerationState = () => setGeneration(initialGenerationState);

  // Handle tab change
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => setValue(newValue);

  // Open Create New Generation Dialog
  const handleOpenNewGenerationDialog = () => {
    // Populate with current data if available
    if (currentGeneration) {
      setNewGeneration({ ...currentGeneration });
    }
    setNewGenerationDialogOpen(true);
  };

  // Close Create New Generation Dialog and reset state
  const handleCloseNewGenerationDialog = () => {
    setNewGenerationDialogOpen(false);
    resetNewGenerationState();
  };

  // Create new generation
  const handleCreateGeneration = () => {
    createNewGeneration(newGeneration);
    handleCloseNewGenerationDialog();
  };

  // Open Edit Generation Dialog and populate with current generation data
  const handleOpenEditGenerationDialog = () => {
    // Populate with current data if available
    if (currentGeneration) {
      setGeneration({ ...currentGeneration });
    }
    setEditGenerationDialogOpen(true);
  };

  // Close Edit Generation Dialog and reset state
  const handleCloseEditGenerationDialog = () => {
    setEditGenerationDialogOpen(false);
    resetGenerationState();
  };

  // Save generation
  const handleSaveGeneration = () => {
    if (generation) {
      updateGeneration(generation); // Save generation
    }
    handleCloseEditGenerationDialog();
  };

  // Conditional rendering based on permissions and data loading state
  if (!hasPermission) {
    return (
      <Container maxWidth="lg">
        <Stack>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Du hast keine Berechtigung für diese Seite
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!currentGeneration || !feedbackStatistics || !applicantsEvaluations) {
    return <LoadingTable />;
  }

  return (
    <Container maxWidth="lg">
      <NewGenerationDialog
        open={newGenerationDialogOpen}
        onClose={handleCloseNewGenerationDialog}
        handleCreateGeneration={handleCreateGeneration}
        newGeneration={newGeneration}
        setNewGeneration={setNewGeneration}
      />
      <EditGenerationDialog
        open={editGenerationDialogOpen}
        onClose={handleCloseEditGenerationDialog}
        generation={generation}
        setGeneration={setGeneration}
        handleSaveGeneration={handleSaveGeneration}
      />
      <Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "start" : "center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Bewerbungsphase
          </Typography>
          {!dayjs().isAfter(dayjs(currentGeneration.applicationEnd).add(90, "day")) && (
            <Button variant="contained" size="small" onClick={handleOpenEditGenerationDialog}>
              <Edit sx={{ mr: 2 }} />
              Bewerbungsphase bearbeiten
            </Button>
          )}
        </Stack>
        <ApplicationPhase
          currentGeneration={currentGeneration}
          handleOpenCreateNewGenerationDialog={handleOpenNewGenerationDialog}
        />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChangeTab} variant={isMobile ? "scrollable" : "standard"} centered={!isMobile}>
              <Tab label="Traineebewerber" value="applicants" />
              <Tab label="Feedback-Statistik" value="feedback" />
            </TabList>
          </Box>
          <TabPanel value="applicants">
            <TraineeApplicantsTable
              applicantsEvaluations={applicantsEvaluations}
              deleteApplicant={deleteApplication}
              updateTraineeEvaluation={updateTraineeEvaluation}
            />
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
