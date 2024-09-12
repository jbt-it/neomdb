import { Box, Button, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";
import React from "react";

interface ProjectApplicationStepperProps {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  handleStep: (step: number) => () => void;
  isLastStep: () => boolean;
  renderStep: (step: number) => JSX.Element;
  steps: { label: string; description: string }[];
  handleComplete: () => void;
  checkRequiredFields: () => boolean;
}

/**
 * Stepper for the project application form for desktop view
 * @param param0
 * @returns Stepper for the project application form for desktop view
 */
const ProjectApplicationStepper = ({
  activeStep,
  handleBack,
  handleNext,
  renderStep,
  handleStep,
  steps,
  isLastStep,
  handleComplete,
  checkRequiredFields,
}: ProjectApplicationStepperProps) => {
  return (
    <Paper sx={{ paddingX: 4, paddingY: 2 }}>
      <Stepper nonLinear activeStep={activeStep} sx={{ marginLeft: -1 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton color="inherit" onClick={handleStep(index)} sx={{ maxHeight: 2, borderRadius: 5 }}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        <Box sx={{ marginTop: 3 }}>
          <Typography fontSize={18} fontWeight={"bold"}>
            {steps[activeStep].description}
          </Typography>
        </Box>
        <Box sx={{ marginTop: 1, minHeight: "50vh" }}>{renderStep(activeStep)}</Box>

        <Box sx={{ display: "flex", flexDirection: "row", pt: 2, ml: -1 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
            Zurück
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext} sx={{ mr: 1 }} variant="outlined">
            Weiter
          </Button>
          {isLastStep() && (
            <Button onClick={handleComplete} variant="outlined" disabled={checkRequiredFields()}>
              Bewerben
            </Button>
          )}
        </Box>
      </React.Fragment>
    </Paper>
  );
};

export default ProjectApplicationStepper;
