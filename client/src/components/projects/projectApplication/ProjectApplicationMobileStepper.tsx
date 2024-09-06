import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Paper, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

interface ProjectApplicationMobileStepperProps {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  maxSteps: number;
  renderStep: (step: number) => JSX.Element;
  steps: { label: string; description: string }[];
  isLastStep: () => boolean;
  handleComplete: () => void;
}

/**
 * Mobile stepper for the project application form
 * @param param0
 * @returns the respective mobile stepper for the project application form
 */
const ProjectApplicationMobileStepper = ({
  activeStep,
  handleBack,
  handleNext,
  maxSteps,
  renderStep,
  steps,
  isLastStep,
  handleComplete,
}: ProjectApplicationMobileStepperProps) => {
  const theme = useTheme();

  return (
    <Stack
      direction={"column"}
      justifyContent={"space-between"}
      sx={{
        height: "100%",
        flexGrow: 1,
        flex: 1,
        borderTop: "1px solid",
        borderColor: "divider",
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
      <Box sx={{ marginTop: 3, pl: 2, pr: 2, flex: 1, marginBottom: "10vh" }}>{renderStep(activeStep)}</Box>
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
            <Button size="small" onClick={handleComplete}>
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

export default ProjectApplicationMobileStepper;
