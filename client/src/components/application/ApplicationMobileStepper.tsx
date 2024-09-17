import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import React from "react";
import { Box, Button, MobileStepper, Paper, Stack, Typography, useTheme } from "@mui/material";

/**
 * The interface for the application mobile stepper
 */
interface ApplicationMobileStepperProps {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  maxSteps: number;
  renderStep: (step: number) => JSX.Element;
  steps: { label: string; description: string }[];
  isLastStep: () => boolean;
  handleApply: () => void;
}

/**
 * Mobile stepper for the application form
 * @param activeStep The current active step
 * @param handleBack The function to handle the back button
 * @param handleNext The function to handle the next button
 * @param maxSteps The maximum number of steps
 * @param renderStep The function to render the step
 * @param steps The steps of the stepper
 * @param isLastStep The function to check if the current step is the last step
 * @param handleApply The function to handle the completion of the form
 * @returns the respective mobile stepper for the application form
 */
const ApplicationMobileStepper = ({
  activeStep,
  handleBack,
  handleNext,
  maxSteps,
  renderStep,
  steps,
  isLastStep,
  handleApply,
}: ApplicationMobileStepperProps) => {
  const theme = useTheme();

  return (
    <Stack
      direction={"column"}
      justifyContent={"space-between"}
      sx={{
        height: "100%",
        width: "100%",
        minWidth: "100vw",
        flexGrow: 1,
        flex: 1,
        borderColor: "divider",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Box>
        <Paper
          elevation={0}
          square
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            backgroundColor: "primary.main",
          }}
        >
          <Typography fontSize={18} fontWeight={"bold"} color={"white"}>
            {steps[activeStep].description}
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ marginTop: 3, marginRight: 2, marginLeft: 2, flex: 1, marginBottom: "10vh" }}>
        {renderStep(activeStep)}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        activeStep={activeStep}
        position="bottom"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
        }}
        nextButton={
          isLastStep() ? (
            <Button size="small" onClick={handleApply}>
              Bewebern
            </Button>
          ) : (
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              Weiter
              {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          )
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Zurück
          </Button>
        }
      />
    </Stack>
  );
};

export default ApplicationMobileStepper;
