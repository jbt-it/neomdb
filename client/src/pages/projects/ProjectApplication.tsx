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
import { ProjectApplicationDto } from "../../types/projectTypes";
import { Workshop } from "../../types/eventTypes";
import {
  ExpertiseOfMemberDto,
  InternshipOfMemberDto,
  ItSkillOfMember,
  PosionOfMemberDto,
  WorkshopsHeldByMember,
} from "../../types/membersTypes";

const workshopsMockData: Workshop[] = [
  {
    schulungId: 1,
    schulungsName: "Workshop 1",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 2,
    schulungsName: "Workshop 2",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 3,
    schulungsName: "Workshop 3",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 4,
    schulungsName: "Workshop 4",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },

  {
    schulungId: 6,
    schulungsName: "Workshop 6",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 7,
    schulungsName: "Workshop 7",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 8,
    schulungsName: "Workshop 8",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 9,
    schulungsName: "Workshop 9",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
  {
    schulungId: 10,
    schulungsName: "Workshop 10",
    art: "Externer Workshop",
    beschreibung: "beschreibung",
  },
];

const ItSkillsSuggestionsMockData: ItSkillOfMember[] = [
  {
    memberId: 9999,
    value: "Cobol",
    level: 3,
  },
  {
    memberId: 9999,
    value: "Microsoft Access",
    level: 1,
  },
];

const ExpertiseSuggestionsMockData: ExpertiseOfMemberDto[] = [
  {
    memberId: 9999,
    expertiseId: 1,
    designation: "Scrum",
    value: "value",
  },
  {
    memberId: 9999,
    expertiseId: 2,
    designation: "Buzzwords",
    value: "value",
  },
];

const InternshopSuggestionsMockData: InternshipOfMemberDto[] = [
  {
    memberId: 9999,
    company: "Firma 1",
    description: "Beschreibung 1",
  },
  {
    memberId: 9999,
    company: "Firma 2",
    description: "Beschreibung 2",
  },
  {
    memberId: 9999,
    company: "Firma 3",
    description: "Beschreibung 3",
  },
  {
    memberId: 9999,
    company: "Firma 4",
    description: "Beschreibung 4",
  },
  {
    memberId: 9999,
    company: "Firma 5",
    description: "Beschreibung 5",
  },
];

const internalCommitmentSuggestionsMockData: PosionOfMemberDto[] = [
  {
    memberId: 9999,
    designation: "Vorstand",
    from: new Date("2021-01-01"),
    until: new Date("2021-12-31"),
  },
  {
    memberId: 9999,
    designation: "Sicherheitsbeauftragter",
    from: new Date("2022-01-01"),
    until: new Date("2022-12-31"),
  },
];

const workshopsHeldByMemberSuggestionsMockData: WorkshopsHeldByMember[] = [
  {
    memberId: 9999,
    workshopInstanceId: 1,
    name: "Workshop 1",
  },
  {
    memberId: 9999,
    workshopInstanceId: 2,
    name: "Workshop 2",
  },
  {
    memberId: 9999,
    workshopInstanceId: 3,
    name: "Workshop 3",
  },
];

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

interface ProjectApplicationProps {
  projectApplicationData?: ProjectApplicationDto;
}

/**
 * Project application form
 * @returns the respective stepper for the project application form
 */
const ProjectApplication = ({ projectApplicationData }: ProjectApplicationProps) => {
  const isMobile = useResponsive("down", "sm");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isApplicationCompleted, setIsApplicationCompleted] = React.useState(false);
  const maxSteps = steps.length;
  const [applicationData, setApplicationData] = React.useState<ProjectApplicationDto>(
    {
      internship: "",
      apprenticeship: "",
      studentJob: "",
      seminarPapers: "",
      workshops: [],
      internalCommitment: [],
      preliminaryWork: [],
      extraordinaryCommitment: null,
      availability: null,
      restriction: "",
      motivation: "",
    } || projectApplicationData
  );

  const [secrecyAgreement, setSecrecyAgreement] = React.useState(false);

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

  // Handles the completion of the application
  const handleCompleteApplication = () => {
    setIsApplicationCompleted(true);
  };

  // Renders the respective step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <WorkExperienceStep
            applicationData={applicationData}
            setApplicationData={setApplicationData}
            itSkillsSuggestions={ItSkillsSuggestionsMockData}
            expertiseSuggestions={ExpertiseSuggestionsMockData}
            internshipSuggestions={InternshopSuggestionsMockData}
          />
        );
      case 1:
        return (
          <TheoryStep
            applicationData={applicationData}
            setApplicationData={setApplicationData}
            workshops={workshopsMockData}
          />
        );
      case 2:
        return (
          <CommitmentStep
            applicationData={applicationData}
            setApplicationData={setApplicationData}
            internalCommitmentSuggestions={internalCommitmentSuggestionsMockData}
            workshopsHeldByMemberSuggestions={workshopsHeldByMemberSuggestionsMockData}
          />
        );
      case 3:
        return <AvailabilityStep applicationData={applicationData} setApplicationData={setApplicationData} />;
      case 4:
        return (
          <MotivationStep
            applicationData={applicationData}
            setApplicationData={setApplicationData}
            secrecyAgreement={secrecyAgreement}
            setSecrecyAgreement={setSecrecyAgreement}
          />
        );
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
        <Box>
          <Typography variant="body1" component="h2" gutterBottom>
            Bewerbung erfolgreich abgeschickt
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.internship}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.apprenticeship}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.studentJob}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.seminarPapers}
          </Typography>
          {applicationData.workshops.map((workshop: Workshop) => (
            <Typography variant="body1" component="h2" gutterBottom>
              {workshop.schulungsName}
            </Typography>
          ))}
          {applicationData.internalCommitment?.map((commitment) => (
            <Typography variant="body1" component="h2" gutterBottom>
              {commitment}
            </Typography>
          ))}
          {applicationData.preliminaryWork?.map((preliminaryWork) => (
            <Typography variant="body1" component="h2" gutterBottom>
              {preliminaryWork}
            </Typography>
          ))}
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.extraordinaryCommitment}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.availability}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.restriction}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            {applicationData.motivation}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectApplication;
