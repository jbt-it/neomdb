import React from "react";
import ApplicationStart from "./ApplicationStart";
import useResponsive from "../../hooks/useResponsive";
import ApplicationMobileStepper from "./ApplicationMobileStepper";
import { Generation } from "../../types/traineesTypes";
import { Container } from "@mui/material";
import ApplicationStepper from "./ApplicationStepper";
import PersonalDataStep from "./PersonalDataStep";
import StudyStep from "./StudyStep";
import WorkExperienceStep from "./WorkExperienceStep";
import LanguagesStep from "./LanguagesStep";
import HobbiesStep from "./HobbiesStep";
import MotivationStep from "./MotivationStep";
import SelfEvaluationStep from "./SelfEvaluationStep";
import FeedbackStep from "./FeedbackStep";
import { useApplicationContext } from "../../context/ApplicationContext";

const steps = [
  {
    label: "Persönliche Daten",
    description: "Persönliche Daten",
  },
  {
    label: "Studium/Ausbildung",
    description: "Studium/Ausbildung",
  },
  {
    label: "Praxiserfahrung",
    description: "Praxiserfahrung",
  },
  {
    label: "Sprachen / IT",
    description: "Sprachen / IT-Kenntnisse",
  },
  {
    label: "Freizeit",
    description: "Angaben zur Freizeit",
  },
  {
    label: "Motivation",
    description: "Motivation",
  },
  {
    label: "Selbsteinschätzung",
    description: "Selbsteinschätzung",
  },
  {
    label: "Feedback",
    description: "Feedback",
  },
];

/**
 * The interface for the application form
 */
interface ApplicationFormProps {
  generation: Generation;
}

/**
 * The application form as a stepper or the welcome page
 * @param generation The current generation
 * @returns The application form as a stepper or the welcome page
 */
const ApplicationForm = ({ generation }: ApplicationFormProps) => {
  const [isApplying, setIsApplying] = React.useState(false);
  const isMobile = useResponsive("down", "md");
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;
  const { applicationState } = useApplicationContext();

  // Check if the current step is the last step
  const isLastStep = () => {
    return activeStep === maxSteps - 1;
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

  // Handles the application start
  const handleSetIsApplying = () => {
    setIsApplying(true);
  };

  // Handles the application completion
  const handleApply = () => {
    console.log(applicationState);
    alert("Bewerbung abgeschickt");
  };

  // Renders the current step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <PersonalDataStep />;
      case 1:
        return <StudyStep />;
      case 2:
        return <WorkExperienceStep />;
      case 3:
        return <LanguagesStep />;
      case 4:
        return <HobbiesStep />;
      case 5:
        return <MotivationStep />;
      case 6:
        return <SelfEvaluationStep />;
      case 7:
        return <FeedbackStep />;
      default:
        return <PersonalDataStep />;
    }
  };

  if (isApplying) {
    return isMobile ? (
      <Container
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: "#f1f1f1",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <ApplicationMobileStepper
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          maxSteps={maxSteps}
          renderStep={renderStep}
          steps={steps}
          isLastStep={isLastStep}
          handleComplete={handleApply}
          checkRequiredFields={() => false}
        />
      </Container>
    ) : (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          background: "#f1f1f1",
        }}
      >
        <ApplicationStepper
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          handleStep={handleStep}
          steps={steps.map((step) => step.label)}
          isLastStep={isLastStep}
          completed={new Array(maxSteps).fill(false)}
          handleComplete={handleApply}
          renderStep={renderStep}
        />
      </Container>
    );
  }
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#f1f1f1",
      }}
    >
      <ApplicationStart generation={generation} handleSetIsApplying={handleSetIsApplying} />
    </Container>
  );
};

export default ApplicationForm;
