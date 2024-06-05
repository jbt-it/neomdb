import React from "react";
import { Box, Button, Container, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";
import { CustomerData, ProjectKeyData } from "../../types/projectTypes";
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

  const [customerData, setCustomerData] = React.useState<CustomerData>({
    customerName: undefined,
    shortDescription: undefined,
    newCustomer: undefined,
    acquisitor: undefined,
    acquisitionMethod: undefined,
    contactChannels: undefined,
  });

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

  // Handle the next step
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
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

  // Render the current step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <KeyDataStep projectKeyData={projectKeyData} setProjectKeyData={setProjectKeyData} />;
      case 1:
        return <CustomerStep customerData={customerData} setCustomerData={setCustomerData} />;
      case 2:
        return <ProjectDescriptionStep />;
      default:
        return <KeyDataStep projectKeyData={projectKeyData} setProjectKeyData={setProjectKeyData} />;
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
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext} sx={{ mr: 1 }} variant="outlined">
                  Next
                </Button>
                {activeStep !== steps.length &&
                  (completed[activeStep] ? (
                    <Typography variant="caption" sx={{ display: "inline-block" }}>
                      Step {activeStep + 1} already completed
                    </Typography>
                  ) : (
                    <Button onClick={handleComplete} variant="outlined">
                      {completedSteps() === totalSteps() - 1 ? "Finish" : "Complete Step"}
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
