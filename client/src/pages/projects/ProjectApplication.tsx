import { Box, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import WorkExperienceStep from "../../components/projects/projectApplication/WorkExperienceStep";
import ProjectApplicationMobileStepper from "../../components/projects/projectApplication/ProjectApplicationMobileStepper";
import ProjectApplicationStepper from "../../components/projects/projectApplication/ProjectApplicationStepper";
import TheoryStep from "../../components/projects/projectApplication/TheoryStep";
import CommitmentStep from "../../components/projects/projectApplication/CommitmentStep";
import AvailabilityStep from "../../components/projects/projectApplication/AvailabilityStep";
import MotivationStep from "../../components/projects/projectApplication/MotivationStep";

// Steps for the project application form
const steps = [
  {
    label: "Berufserfahrung",
    description: "Relevante praktische Berufserfahrung",
  },
  {
    label: "Theoriekenntnisse",
    description: "Relevante Theoriekenntnisse",
  },
  {
    label: "Vereinsengagement",
    description: "Vereinsengagement",
  },
  {
    label: "Verfügbarkeit",
    description: "Verfügbarkeit",
  },
  {
    label: "Motivation",
    description: "Motivation für das Projekt",
  },
];

/**
 * Project application form
 * @returns the respective stepper for the project application form
 */
const ProjectApplication = () => {
  const isMobile = useResponsive("down", "sm");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isApplicationCompleted, setIsApplicationCompleted] = React.useState(false);
  const maxSteps = steps.length;

  // Get the total number of steps
  const totalSteps = () => {
    return steps.length;
  };

  // Check if the current step is the last step
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  // Handles the next step
  const handleNext = () => {
    isLastStep() ? setActiveStep(0) : setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handles the previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle click on step
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleCompleteApplication = () => {
    setIsApplicationCompleted(true);
  };

  // Renders the respective step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <WorkExperienceStep />;
      case 1:
        return <TheoryStep />;
      case 2:
        return <CommitmentStep />;
      case 3:
        return <AvailabilityStep />;
      case 4:
        return <MotivationStep />;
      default:
        return <div>Step {step}</div>;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100%", flex: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
        Bewerbung auf externes Projekt
      </Typography>
      {!isApplicationCompleted ? (
        isMobile ? (
          <ProjectApplicationMobileStepper
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            maxSteps={maxSteps}
            renderStep={renderStep}
            steps={steps}
            isLastStep={isLastStep}
            handleComplete={handleCompleteApplication}
          />
        ) : (
          <ProjectApplicationStepper
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleStep={handleStep}
            renderStep={renderStep}
            steps={steps}
            isLastStep={isLastStep}
            handleComplete={handleCompleteApplication}
          />
        )
      ) : (
        <Typography variant="h6" component="h2" gutterBottom>
          Vielen Dank für Ihre Bewerbung!
        </Typography>
      )}
    </Box>
  );
};

export default ProjectApplication;
