import React from "react";
import { Box, Button, Container, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";
import { CustomerData, ProjectDescriptionData, ProjectKeyData } from "../../types/projectTypes";
import KeyDataStep from "../../components/projects/projectTendering/KeyDataStep";
import CustomerStep from "../../components/projects/projectTendering/CustomerStep";
import ProjectDescriptionStep from "../../components/projects/projectTendering/ProjectDescriptionStep";
import SummaryDetails from "../../components/projects/projectTendering/SummaryDetails";

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

  // Errors for the project key data
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

  // Errors for the customer data
  const [customerDataErrors, setCustomerDataErrors] = React.useState<{ [key: string]: boolean }>({
    customerName: false,
    shortDescription: false,
    newCustomer: false,
    acquisitor: false,
    acquisitionMethod: false,
    contactChannels: false,
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

  // Errors for the project description data
  const [projectDescriptionDataErrors, setProjectDescriptionDataErrors] = React.useState<{ [key: string]: boolean }>({
    situation: false,
    peculiarities: false,
    coreCompetencies: false,
    requirementProfile: false,
    referenceProjects: false,
    notes: false,
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
    if (!projectKeyData.tenderingDate || projectKeyData.tenderingDate.toDate() < new Date()) {
      newErrors.tenderingDate = true;
      hasErrors = true;
    } else {
      newErrors.tenderingDate = false;
    }
    if (!projectKeyData.start || projectKeyData.start.toDate() < new Date()) {
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
    if (!projectKeyData.conditions || projectKeyData.conditions < 0) {
      newErrors.conditions = true;
      hasErrors = true;
    } else {
      newErrors.conditions = false;
    }
    if (
      !projectKeyData.conditionsRange ||
      projectKeyData.conditionsRange < 0 ||
      (projectKeyData.conditions && projectKeyData.conditionsRange < projectKeyData.conditions)
    ) {
      newErrors.conditionsRange = true;
      hasErrors = true;
    } else {
      newErrors.conditionsRange = false;
    }
    if (!projectKeyData.btMin || projectKeyData.btMin < 0 || !Number.isInteger(projectKeyData.btMin)) {
      newErrors.btMin = true;
      hasErrors = true;
    } else {
      newErrors.btMin = false;
    }
    if (
      !projectKeyData.btMax ||
      projectKeyData.btMax < 0 ||
      !Number.isInteger(projectKeyData.btMax) ||
      (projectKeyData.btMin && projectKeyData.btMax < projectKeyData.btMin)
    ) {
      newErrors.btMax = true;
      hasErrors = true;
    } else {
      newErrors.btMax = false;
    }
    if (
      !projectKeyData.amountProjectMembersMin ||
      projectKeyData.amountProjectMembersMin < 0 ||
      !Number.isInteger(projectKeyData.amountProjectMembersMin)
    ) {
      newErrors.amountProjectMembersMin = true;
      hasErrors = true;
    } else {
      newErrors.amountProjectMembersMin = false;
    }
    if (
      !projectKeyData.amountProjectMembersMax ||
      projectKeyData.amountProjectMembersMax < 0 ||
      !Number.isInteger(projectKeyData.amountProjectMembersMax) ||
      (projectKeyData.amountProjectMembersMin &&
        projectKeyData.amountProjectMembersMax < projectKeyData.amountProjectMembersMin)
    ) {
      newErrors.amountProjectMembersMax = true;
      hasErrors = true;
    } else {
      newErrors.amountProjectMembersMax = false;
    }
    if (!projectKeyData.applicationDeadline || projectKeyData.applicationDeadline.toDate() < new Date()) {
      newErrors.applicationDeadline = true;
      hasErrors = true;
    } else {
      newErrors.applicationDeadline = false;
    }
    setProjectKeyDataErrors(newErrors);
    return hasErrors;
  };

  // Validate the customer data
  const validateCustomerData = () => {
    let hasErrors = false;
    const newErrors = { ...customerDataErrors };
    if (!customerData.customerName) {
      newErrors.customerName = true;
      hasErrors = true;
    } else {
      newErrors.customerName = false;
    }
    if (!customerData.shortDescription) {
      newErrors.shortDescription = true;
      hasErrors = true;
    } else {
      newErrors.shortDescription = false;
    }
    if (customerData.newCustomer === undefined) {
      newErrors.newCustomer = true;
      hasErrors = true;
    } else {
      newErrors.newCustomer = false;
    }
    if (!customerData.acquisitor) {
      newErrors.acquisitor = true;
      hasErrors = true;
    } else {
      newErrors.acquisitor = false;
    }
    if (!customerData.acquisitionMethod) {
      newErrors.acquisitionMethod = true;
      hasErrors = true;
    } else {
      newErrors.acquisitionMethod = false;
    }
    if (!customerData.contactChannels || customerData.contactChannels.length === 0) {
      newErrors.contactChannels = true;
      hasErrors = true;
    } else {
      newErrors.contactChannels = false;
    }
    setCustomerDataErrors(newErrors);
    return hasErrors;
  };

  // Validate the project description data
  const validateProjectDescriptionData = () => {
    let hasErrors = false;
    const newErrors = { ...projectDescriptionDataErrors };
    if (!projectDescriptionData.situation) {
      newErrors.situation = true;
      hasErrors = true;
    } else {
      newErrors.situation = false;
    }
    if (!projectDescriptionData.peculiarities) {
      newErrors.peculiarities = true;
      hasErrors = true;
    } else {
      newErrors.peculiarities = false;
    }
    if (!projectDescriptionData.coreCompetencies || projectDescriptionData.coreCompetencies.length === 0) {
      newErrors.coreCompetencies = true;
      hasErrors = true;
    } else {
      newErrors.coreCompetencies = false;
    }
    if (!projectDescriptionData.requirementProfile) {
      newErrors.requirementProfile = true;
      hasErrors = true;
    } else {
      newErrors.requirementProfile = false;
    }
    if (!projectDescriptionData.referenceProjects) {
      newErrors.referenceProjects = true;
      hasErrors = true;
    } else {
      newErrors.referenceProjects = false;
    }
    if (!projectDescriptionData.notes) {
      newErrors.notes = true;
      hasErrors = true;
    } else {
      newErrors.notes = false;
    }
    setProjectDescriptionDataErrors(newErrors);
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

  // Handle the saving of the project
  const handleSaveProject = () => {
    alert("Save project");
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
    // If the active step is the project key data step, validate the project key data and return if there are errors
    if (activeStep === 0) {
      if (validateProjectKeyData()) {
        return;
      }
    }
    // If the active step is the customer step, validate the customer data and return if there are errors
    if (activeStep === 1) {
      if (validateCustomerData()) {
        return;
      }
    }
    // If the active step is the project description step, validate the project description data and return if there are errors
    if (activeStep === 2) {
      if (validateProjectDescriptionData()) {
        return;
      }
    }
    // If there are no errors, set the step as completed and go to the next step
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
          <CustomerStep
            customerData={customerData}
            setCustomerData={setCustomerData}
            isCompleted={completed[1]}
            errors={customerDataErrors}
          />
        );
      case 2:
        return (
          <ProjectDescriptionStep
            projectDescriptionData={projectDescriptionData}
            setProjectDescriptionData={setProjectDescriptionData}
            isCompleted={completed[2]}
            errors={projectDescriptionDataErrors}
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
              <Typography sx={{ mt: 3, mb: 2 }} fontWeight={"bold"} fontSize={18}>
                Soll das Projekt ausgeschieben oder nachgetragen werden?
              </Typography>
              <SummaryDetails
                projectKeyData={projectKeyData}
                customerData={customerData}
                projectDescriptionData={projectDescriptionData}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button onClick={handleTenderProject} sx={{ mr: 3 }} variant="outlined">
                  Ausschreiben
                </Button>
                <Button onClick={handleSaveProject} variant="outlined">
                  Nachtragen
                </Button>
                <Box sx={{ flex: "1 2 auto" }} />
                <Button onClick={handleReset} variant="outlined" color="info">
                  Nochmals Bearbeiten
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
