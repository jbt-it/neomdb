import React from "react";
import ApplicationStart from "./ApplicationStart";
import useResponsive from "../../hooks/useResponsive";
import ApplicationMobileStepper from "./ApplicationMobileStepper";
import { Generation } from "../../types/traineesTypes";
import { Container } from "@mui/material";
import ApplicationStepper from "./ApplicationStepper";
import PersonalDataStep from "./steps/PersonalDataStep";
import StudyStep from "./steps/StudyStep";
import WorkExperienceStep from "./steps/WorkExperienceStep";
import LanguagesStep from "./steps/LanguagesStep";
import HobbiesStep from "./steps/HobbiesStep";
import MotivationStep from "./steps/MotivationStep";
import SelfEvaluationStep from "./steps/SelfEvaluationStep";
import FeedbackStep from "./steps/FeedbackStep";
import { useApplicationContext } from "../../context/ApplicationContext";
import { ApplicationDto } from "../../types/applicationTypes";
import { checkRequiredFields } from "../../utils/applicationValidationUtils";
import { saveApplication } from "../../api/application";

// The steps of the application form
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
  const { applicationState, updateApplicationErrorState, applicationImage } = useApplicationContext();
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  // check if all required fields of the personal data step are filled
  const attributesToCheckByStep: { [key: number]: (keyof ApplicationDto)[] } = {
    0: ["firstName", "lastName", "gender", "birthDate", "mobilePhone", "email", "confirmEmail", "picture"],
    1: ["enrolledDegree", "enrolledUniversity", "enrolledSubject", "studyStart", "studySemester", "apprenticeship"],
    2: ["internship", "hiwiStudentJob"],
    3: ["languages", "itSkills"],
    4: ["timeInvestment"],
    5: ["motivation"],
    6: [
      "selfAssessment1",
      "selfAssessment2",
      "selfAssessment3",
      "selfAssessment4",
      "selfAssessment5",
      "selfAssessment6",
      "selfAssessment7",
      "selfAssessment8",
    ],
    7: ["availabilitySelectionWeekend"],
  };

  // Check if the current step is the last step
  const isLastStep = () => {
    return activeStep === maxSteps - 1;
  };

  // Handles the check of the required fields
  const handleCheckRequiredFields = () => {
    return checkRequiredFields(attributesToCheckByStep, activeStep, applicationState, updateApplicationErrorState);
  };

  // Handles the next step
  const handleNext = () => {
    // Check if the required fields are filled and if not return
    if (handleCheckRequiredFields()) {
      return;
    }
    setCompleted({ ...completed, [activeStep]: true });
    isLastStep() ? setActiveStep(0) : setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handles the previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle click on step
  const handleStep = (step: number) => () => {
    // Check if the required fields are filled and if so set the step as completed
    if (!handleCheckRequiredFields()) {
      setCompleted({ ...completed, [activeStep]: true });
    } else {
      setCompleted({ ...completed, [activeStep]: false });
    }
    setActiveStep(step);
  };

  // Handles the application start
  const handleSetIsApplying = () => {
    setIsApplying(true);
  };

  // Handles the application submission
  const handleSubmition = () => {
    if (!applicationImage) {
      alert("Fehler beim Bildupload");
      return;
    }
    // Save the application
    saveApplication(applicationState, applicationImage);
    alert("Bewerbung abgeschickt");
  };

  // Handles the application completion
  const handleApply = () => {
    if (handleCheckRequiredFields()) {
      return;
    } else {
      setCompleted({ ...completed, [activeStep]: true });
    }
    // if every step is completed, the application is submitted
    if (Object.values(completed).every((value) => value === true)) {
      handleSubmition();
    } else {
      alert("Bitte fülle alle Felder aus");
    }
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
        return (
          <FeedbackStep
            wwStart={generation.wwDateStart}
            wwEnd={generation.wwDateEnd}
            selectionWeDateStart={generation.selectionWeDateStart}
            selectionWeDateEnd={generation.selectionWeDateEnd}
          />
        );
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
          handleApply={handleApply}
          isLastStep={isLastStep}
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
          completed={completed}
          handleApply={handleApply}
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
