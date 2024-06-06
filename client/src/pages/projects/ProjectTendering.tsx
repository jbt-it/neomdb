import React from "react";
import { Box, Button, Container, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";
import { CustomerData, ProjectDescriptionData, ProjectKeyData } from "../../types/projectTypes";
import KeyDataStep from "../../components/projects/projectTendering/KeyDataStep";
import CustomerStep from "../../components/projects/projectTendering/CustomerStep";
import ProjectDescriptionStep from "../../components/projects/projectTendering/ProjectDescriptionStep";

// Steps for the project tendering form
const steps = ["Rahmendaten", "Kundendaten", "Projektbeschreibung"];

/**
 * Component to create a new project tendering
 * @returns - A form to create a new project tendering
 */
const ProjectTendering = () => {
  // Project key data
  const [projectKeyData, setProjectKeyData] = React.useState<ProjectKeyData>({
    projectName: undefined,
    location: undefined,
    tenderingDate: undefined,
    start: undefined,
    duration: undefined,
    conditions: undefined,
    conditionsRange: undefined,
    btMin: undefined,
    btMax: undefined,
    amountProjectMembersMin: undefined,
    amountProjectMembersMax: undefined,
    applicationDeadline: undefined,
  });

  const [projectKeyDataErrors, setProjectKeyDataErrors] = React.useState<{ [key: string]: boolean }>({
    projectName: false,
    location: false,
    tenderingDate: false,
    start: false,
    duration: false,
    conditions: false,
    conditionsRange: false,
    btMin: false,
    btMax: false,
    amountProjectMembersMin: false,
    amountProjectMembersMax: false,
    applicationDeadline: false,
  });

  // Customer data
  const [customerData, setCustomerData] = React.useState<CustomerData>({
    customerName: undefined,
    shortDescription: undefined,
    newCustomer: undefined,
    acquisitor: undefined,
    acquisitionMethod: undefined,
    contactChannels: [],
  });

  // Project Description data
  const [projectDescriptionData, setProjectDescriptionData] = React.useState<ProjectDescriptionData>({
    situation: "",
    peculiarities: "",
    coreCompetencies: [],
    requirementProfile: "",
    referenceProjects: "",
    notes: "",
  });

  // Validate the project key data
  const validateProjectKeyData = () => {
    let hasErrors = false;
    const newErrors = { ...projectKeyDataErrors };
    if (!projectKeyData.projectName) {
      newErrors.projectName = true;
      hasErrors = true;
    } else {
      newErrors.projectName = false;
    }
    if (!projectKeyData.location) {
      newErrors.location = true;
      hasErrors = true;
    } else {
      newErrors.location = false;
    }
    if (!projectKeyData.tenderingDate) {
      newErrors.tenderingDate = true;
      hasErrors = true;
    } else {
      newErrors.tenderingDate = false;
    }
    if (!projectKeyData.start) {
      newErrors.start = true;
      hasErrors = true;
    } else {
      newErrors.start = false;
    }
    if (!projectKeyData.duration) {
      newErrors.duration = true;
      hasErrors = true;
    } else {
      newErrors.duration = false;
    }
    if (!projectKeyData.conditions) {
      newErrors.conditions = true;
      hasErrors = true;
    } else {
      newErrors.conditions = false;
    }
    if (!projectKeyData.conditionsRange) {
      newErrors.conditionsRange = true;
      hasErrors = true;
    } else {
      newErrors.conditionsRange = false;
    }
    if (!projectKeyData.btMin) {
      newErrors.btMin = true;
      hasErrors = true;
    } else {
      newErrors.btMin = false;
    }
    if (!projectKeyData.btMax) {
      newErrors.btMax = true;
      hasErrors = true;
    } else {
      newErrors.btMax = false;
    }
    if (!projectKeyData.amountProjectMembersMin) {
      newErrors.amountProjectMembersMin = true;
      hasErrors = true;
    } else {
      newErrors.amountProjectMembersMin = false;
    }
    if (!projectKeyData.amountProjectMembersMax) {
      newErrors.amountProjectMembersMax = true;
      hasErrors = true;
    } else {
      newErrors.amountProjectMembersMax = false;
    }
    if (!projectKeyData.applicationDeadline) {
      newErrors.applicationDeadline = true;
      hasErrors = true;
    } else {
      newErrors.applicationDeadline = false;
    }
    setProjectKeyDataErrors(newErrors);
    return hasErrors;
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  // Get the total number of steps
  const totalSteps = () => {
    return steps.length;
  };

  // Get the number of completed steps
  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  // Check if the current step is the last step
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  // Check if all steps are completed
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  // Handle the tendering of the project
  const handleTenderProject = () => {
    alert("Tender project");
  };

  // Handle the next step
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    // Check if all steps are completed and tender the project
    if (allStepsCompleted()) {
      handleTenderProject();
    }
  };

  // Handle the going back a step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle click on step
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  // Handle the completion of a step
  const handleComplete = () => {
    if (activeStep === 0) {
      if (validateProjectKeyData()) {
        return;
      }
    }
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  // Handle the reset of the steps
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // Handle the editing of a step
  const handleEdit = () => {
    const newCompleted = { ...completed };
    delete newCompleted[activeStep];
    setCompleted(newCompleted);
  };

  // Render the current step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <KeyDataStep
            projectKeyData={projectKeyData}
            setProjectKeyData={setProjectKeyData}
            isCompleted={completed[0]}
            errors={projectKeyDataErrors}
          />
        );
      case 1:
        return (
          <CustomerStep customerData={customerData} setCustomerData={setCustomerData} isCompleted={completed[1]} />
        );
      case 2:
        return (
          <ProjectDescriptionStep
            projectDescriptionData={projectDescriptionData}
            setProjectDescriptionData={setProjectDescriptionData}
            isCompleted={completed[2]}
          />
        );
      default:
        return (
          <KeyDataStep
            projectKeyData={projectKeyData}
            setProjectKeyData={setProjectKeyData}
            isCompleted={completed[0]}
            errors={projectKeyDataErrors}
          />
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
        Neue Projektausschreibung
      </Typography>
      <Paper sx={{ paddingX: 4, paddingY: 2 }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ marginLeft: -1 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)} sx={{ maxHeight: 2, borderRadius: 5 }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset} variant="outlined">
                  Reset
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ marginTop: 3 }}>{renderStep(activeStep)}</Box>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2, ml: -1 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  variant="outlined"
                >
                  Zurück
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext} sx={{ mr: 1 }} variant="outlined">
                  Weiter
                </Button>
                {activeStep !== steps.length &&
                  (completed[activeStep] ? (
                    <Button onClick={handleEdit} variant="outlined" color="info">
                      Bearbeiten
                    </Button>
                  ) : (
                    <Button onClick={handleComplete} variant="outlined">
                      {completedSteps() === totalSteps() - 1 ? "Ausschreiben" : "Abschließen"}
                    </Button>
                  ))}
              </Box>
            </React.Fragment>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default ProjectTendering;
