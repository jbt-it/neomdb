import React from "react";
import { Box, Button, Container, Paper, Step, StepButton, Stepper, Typography } from "@mui/material";
import { CustomerData, ProjectDescriptionData, ProjectKeyData } from "../../types/projectTypes";
import KeyDataStep from "../../components/projects/projectTendering/KeyDataStep";
import CustomerStep from "../../components/projects/projectTendering/CustomerStep";
import ProjectDescriptionStep from "../../components/projects/projectTendering/ProjectDescriptionStep";
import SummaryDetails from "../../components/projects/projectTendering/SummaryDetails";
import dayjs from "dayjs";
import useProjects from "../../hooks/useProjects";
import { showErrorMessage } from "../../utils/toastUtils";

// Steps for the project tendering form
const steps = ["Rahmendaten", "Kundendaten", "Projektbeschreibung"];

/**
 * Component to create a new project tendering
 * @returns - A form to create a new project tendering
 */
const ProjectTendering = () => {
  const { tenderProject, saveProject } = useProjects();
  // Project key data initial state
  const [projectKeyData, setProjectKeyData] = React.useState<ProjectKeyData>({
    projectName: "",
    location: "",
    tenderDate: dayjs(), // will be shown but is disabled
    estimatedProjectStart: undefined,
    estimatedProjectDuration: "",
    estimatedProjectEuroPerBT: undefined,
    estimatedProjectEuroPerBTrange: undefined,
    estimatedProjectBTmin: undefined,
    estimatedProjectBTmax: undefined,
    estimatedProjectMemberMin: undefined,
    estimatedProjectMemberMax: undefined,
    applicationEnd1: undefined,
  });

  // Errors for the project key data inital state
  const [projectKeyDataErrors, setProjectKeyDataErrors] = React.useState<{ [key: string]: boolean }>({
    projectName: false,
    estimatedProjectStart: false,
    estimatedProjectDuration: false,
    estimatedProjectEuroPerBT: false,
    estimatedProjectBTmin: false,
    estimatedProjectBTmax: false,
    estimatedProjectMemberMin: false,
    estimatedProjectMemberMax: false,
    applicationEnd1: false,
  });

  // Customer data initial state
  const [customerData, setCustomerData] = React.useState<CustomerData>({
    companyId: -1,
    name: "",
    shortDescription: "",
    newCustomer: undefined,
    acquisitor: undefined,
    acquisitionMethod: undefined,
    industry: undefined,
    contactPerson: undefined,
    newContactPerson: false,
    newContactPersonName: "",
    street: "",
    postalCode: "",
    city: "",
    addressAdditional: "",
    url: "",
    importantInformation: "",
    contactDesired: false,
    classified: false,
  });

  // Errors for the customer data initial state
  const [customerDataErrors, setCustomerDataErrors] = React.useState<{ [key: string]: boolean }>({
    customer: false,
    industry: false,
    newCustomer: false,
    contactPerson: false,
    acquisitor: false,
    newContactPersonName: false,
  });

  // Project Description data initial state
  const [projectDescriptionData, setProjectDescriptionData] = React.useState<ProjectDescriptionData>({
    situation: "",
    peculiarities: "",
    coreCompetencies: [],
    requirementProfile: "",
    referenceProjects: "",
    notes: "",
  });

  // Errors for the project description data initial state
  const [projectDescriptionDataErrors, setProjectDescriptionDataErrors] = React.useState<{ [key: string]: boolean }>({
    coreCompetencies: false,
  });

  // Validate the project key data
  // Checks for projectName, estimatedProjectStart, estimatedProjectDuration, estimatedProjectEuroPerBT, estimatedProjectBTmin, estimatedProjectBTmax, estimatedProjectMemberMin, estimatedProjectMemberMax and applicationEnd1
  const validateProjectKeyData = () => {
    let hasErrors = false;
    const newErrors = { ...projectKeyDataErrors };
    if (!projectKeyData.projectName) {
      newErrors.projectName = true;
      hasErrors = true;
    } else {
      newErrors.projectName = false;
    }
    if (!projectKeyData.estimatedProjectStart || projectKeyData.estimatedProjectStart.toDate() < new Date()) {
      newErrors.estimatedProjectStart = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectStart = false;
    }
    if (!projectKeyData.estimatedProjectDuration) {
      newErrors.estimatedProjectDuration = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectDuration = false;
    }
    if (!projectKeyData.estimatedProjectEuroPerBT || projectKeyData.estimatedProjectEuroPerBT < 0) {
      newErrors.estimatedProjectEuroPerBT = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectEuroPerBT = false;
    }
    if (
      projectKeyData.estimatedProjectEuroPerBT &&
      projectKeyData.estimatedProjectEuroPerBTrange &&
      projectKeyData.estimatedProjectEuroPerBTrange < projectKeyData.estimatedProjectEuroPerBT
    ) {
      newErrors.estimatedProjectEuroPerBTrange = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectEuroPerBTrange = false;
    }
    if (
      !projectKeyData.estimatedProjectBTmin ||
      projectKeyData.estimatedProjectBTmin < 0 ||
      !Number.isInteger(projectKeyData.estimatedProjectBTmin)
    ) {
      newErrors.estimatedProjectBTmin = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectBTmin = false;
    }
    if (
      !projectKeyData.estimatedProjectBTmax ||
      projectKeyData.estimatedProjectBTmax < 0 ||
      !Number.isInteger(projectKeyData.estimatedProjectBTmax) ||
      (projectKeyData.estimatedProjectBTmin &&
        projectKeyData.estimatedProjectBTmax < projectKeyData.estimatedProjectBTmin)
    ) {
      newErrors.estimatedProjectBTmax = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectBTmax = false;
    }
    if (
      !projectKeyData.estimatedProjectMemberMin ||
      projectKeyData.estimatedProjectMemberMin < 0 ||
      !Number.isInteger(projectKeyData.estimatedProjectMemberMin)
    ) {
      newErrors.estimatedProjectMemberMin = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectMemberMin = false;
    }
    if (
      !projectKeyData.estimatedProjectMemberMax ||
      projectKeyData.estimatedProjectMemberMax < 0 ||
      !Number.isInteger(projectKeyData.estimatedProjectMemberMax) ||
      (projectKeyData.estimatedProjectMemberMin &&
        projectKeyData.estimatedProjectMemberMax < projectKeyData.estimatedProjectMemberMin)
    ) {
      newErrors.estimatedProjectMemberMax = true;
      hasErrors = true;
    } else {
      newErrors.estimatedProjectMemberMax = false;
    }
    // only check if the applicationEnd is in the future if the date is set, the date can be empty/undefined if the project is not tendered but rather just saved
    if (projectKeyData.applicationEnd1 ? projectKeyData.applicationEnd1.toDate() < new Date() : false) {
      newErrors.applicationEnd1 = true;
      hasErrors = true;
    } else {
      newErrors.applicationEnd1 = false;
    }
    setProjectKeyDataErrors(newErrors);
    return hasErrors;
  };

  // Validate the customer data
  // Checks if a customer is set, an industry is set, if the customerType is set, an acquisitor is set and an acquisition method is set
  const validateCustomerData = () => {
    let hasErrors = false;
    const newErrors = { ...customerDataErrors };
    if (customerData.companyId === -1) {
      newErrors.customer = true;
      hasErrors = true;
    } else {
      newErrors.customer = false;
    }
    if (!customerData.industry) {
      newErrors.industry = true;
      hasErrors = true;
    } else {
      newErrors.industry = false;
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
    if (
      customerData.newContactPerson &&
      (!customerData.newContactPersonName || customerData.newContactPersonName.trim() === "")
    ) {
      newErrors.contactPerson = true;
      hasErrors = true;
    } else if (!customerData.newContactPerson && !customerData.contactPerson) {
      newErrors.contactPerson = true;
      hasErrors = true;
    } else {
      newErrors.contactPerson = false;
    }
    setCustomerDataErrors(newErrors);
    return hasErrors;
  };

  // Validate the project description data
  // Checks if core competencies are set
  const validateProjectDescriptionData = () => {
    let hasErrors = false;
    const newErrors = { ...projectDescriptionDataErrors };
    if (!projectDescriptionData.coreCompetencies || projectDescriptionData.coreCompetencies.length === 0) {
      newErrors.coreCompetencies = true;
      hasErrors = true;
    } else {
      newErrors.coreCompetencies = false;
    }
    setProjectDescriptionDataErrors(newErrors);
    return hasErrors;
  };

  // states for the active step and the completed steps
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

  // Handle the tendering or saving of the project, depending on the tendering flag, determines if an email is sent to the members and if the projectApplicationEnd has to be set
  const handleSaveProject = (tendering: boolean) => {
    alert("Tender project");
    // All data should be set at this point, but check again to be sure
    if (
      !projectKeyData.projectName ||
      !projectKeyData.estimatedProjectStart ||
      !projectKeyData.estimatedProjectDuration ||
      !projectKeyData.estimatedProjectEuroPerBT ||
      !projectKeyData.estimatedProjectBTmin ||
      !projectKeyData.estimatedProjectBTmax ||
      !projectKeyData.estimatedProjectMemberMin ||
      !projectKeyData.estimatedProjectMemberMax ||
      !customerData.acquisitor ||
      !customerData.acquisitionMethod ||
      !customerData.industry ||
      customerData.companyId === -1 ||
      !projectDescriptionData.coreCompetencies ||
      projectDescriptionData.coreCompetencies.length === 0 ||
      (customerData.newContactPerson ? !customerData.newContactPersonName : !customerData.contactPerson) ||
      !projectKeyData.estimatedProjectEuroPerBT ||
      !customerData.newCustomer ||
      (tendering && !projectKeyData.applicationEnd1)
    ) {
      // Show an error message if some data is missing
      showErrorMessage("Einige Daten fehlen oder sind fehlerhaft");
      return;
    }
    const data = {
      projectId: -1,
      projectName: projectKeyData.projectName,
      status: projectKeyData.tenderDate ? "Bewerbung" : "Durchführung",
      location: projectKeyData.location,
      tenderDate: projectKeyData.tenderDate?.toDate(),
      estimatedProjectStart: projectKeyData.estimatedProjectStart.toDate(),
      estimatedProjectDuration: projectKeyData.estimatedProjectDuration,
      estimatedProjectEuroPerBT: projectKeyData.estimatedProjectEuroPerBT,
      estimatedProjectEuroPerBTrange: projectKeyData.estimatedProjectEuroPerBTrange,
      estimatedProjectBTmin: projectKeyData.estimatedProjectBTmin,
      estimatedProjectBTmax: projectKeyData.estimatedProjectBTmax,
      estimatedProjectMemberMin: projectKeyData.estimatedProjectMemberMin,
      estimatedProjectMemberMax: projectKeyData.estimatedProjectMemberMax,
      applicationStart1: null,
      applicationEnd1: projectKeyData.applicationEnd1?.toDate(),
      applicationStart2: null,
      applicationEnd2: null,
      situation: projectDescriptionData.situation,
      peculiarities: projectDescriptionData.peculiarities,
      coreCompetencies: projectDescriptionData.coreCompetencies,
      requirementProfile: projectDescriptionData.requirementProfile,
      referenceProjects: projectDescriptionData.referenceProjects,
      notes: projectDescriptionData.notes,
      acquisitor: customerData.acquisitor,
      acquisitionMethod: customerData.acquisitionMethod,
      newContactPerson: customerData.newContactPerson,
      contactPerson: customerData.contactPerson || customerData.newContactPersonName,
      newCustomer: customerData.newCustomer,
      kickoff: null,
      staffingCommittee: [],
      client: {
        companyId: customerData.companyId,
        name: customerData.name,
        industry: customerData.industry,
        shortDescription: customerData.shortDescription,
        street: customerData.street,
        postalCode: customerData.postalCode,
        city: customerData.city,
        addressAdditional: customerData.addressAdditional,
        url: customerData.url,
        importantInformation: customerData.importantInformation,
        contactDesired: customerData.contactDesired,
        classified: customerData.classified,
      },
      members: [],
      qms: [],
      signatureDate: null,
      euroPerBT: null,
      soldBT: null,
      soldExpenses: null,
      projectEnd: null,
      invoicing: null,
    };
    tendering ? tenderProject(data) : saveProject(data);
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
              {projectKeyData.applicationEnd1 ? (
                <Typography sx={{ mt: 3, mb: 2 }} fontWeight={"bold"} fontSize={18}>
                  Soll das Projekt ausgeschrieben werden?
                </Typography>
              ) : (
                <Typography sx={{ mt: 3, mb: 2 }} fontWeight={"bold"} fontSize={18}>
                  Soll das Projekt nachgetragen werden?
                </Typography>
              )}
              <Typography sx={{ mt: 3, mb: 2 }} fontWeight={"bold"} fontSize={18}></Typography>
              <SummaryDetails
                projectKeyData={projectKeyData}
                customerData={customerData}
                projectDescriptionData={projectDescriptionData}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {projectKeyData.applicationEnd1 ? (
                  <Button onClick={() => handleSaveProject(true)} variant="outlined">
                    Ausschreiben
                  </Button>
                ) : (
                  <Button onClick={() => handleSaveProject(false)} variant="outlined">
                    Nachtragen
                  </Button>
                )}
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
