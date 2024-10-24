import React from "react";
import { Box, Button, Paper, Stack, Step, StepButton, Stepper } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

/**
 * The interface for the application stepper
 */
interface ApplicationStepperProps {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  handleStep: (step: number) => () => void;
  steps: string[];
  isLastStep: () => boolean;
  completed: boolean[];
  renderStep: (step: number) => JSX.Element;
  handleComplete: () => void;
}

/**
 * Stepper for the application form
 * @param activeStep The current active step
 * @param handleBack The function to handle the back button
 * @param handleNext The function to handle the next button
 * @param handleStep The function to handle the step
 * @param steps The steps of the stepper
 * @param isLastStep The function to check if the current step is the last step
 * @param completed The completed steps
 * @param renderStep The function to render the step
 * @returns the respective stepper for the application form
 */
const ApplicationStepper = ({
  activeStep,
  handleBack,
  handleNext,
  handleStep,
  steps,
  isLastStep,
  completed,
  renderStep,
  handleComplete,
}: ApplicationStepperProps) => {
  const useAlternativeLabel = useResponsive("between", "md", "lg") || undefined;

  return (
    <Paper
      sx={{
        paddingX: 4,
        paddingY: 2,
        borderRadius: 10,
        minHeight: "70vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: 5,
      }}
    >
      <Stack direction={"column"} justifyContent={"space-evenly"} sx={{ flex: 1, height: "100%" }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ flex: 0 }} alternativeLabel={useAlternativeLabel}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)} sx={{ borderRadius: 5, maxHeight: "50%" }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ flex: 1, overflow: "auto", mt: 2 }}>{renderStep(activeStep)}</Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
            Zurück
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {isLastStep() ? (
            <Button onClick={handleComplete} sx={{ mr: 1 }} variant="outlined">
              Bewerben
            </Button>
          ) : (
            <Button onClick={handleNext} sx={{ mr: 1 }} variant="outlined">
              Weiter
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default ApplicationStepper;
