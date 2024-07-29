import React, { useContext, useState } from "react";
import { Box, Button, Container, Paper, Stack, Step, StepButton, Stepper, Typography } from "@mui/material";
import { CustomerData, ProjectDescriptionData, ProjectKeyData } from "../../types/projectTypes";
import KeyDataStep from "../../components/projects/projectTendering/KeyDataStep";
import CustomerStep from "../../components/projects/projectTendering/CustomerStep";
import ProjectDescriptionStep from "../../components/projects/projectTendering/ProjectDescriptionStep";
import dayjs from "dayjs";
import { showErrorMessage } from "../../utils/toastUtils";
import { useParams } from "react-router-dom";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useResponsive from "../../hooks/useResponsive";
import MobileEditButtons from "../../components/projects/projectDetails/MobileEditButtons";
import EditButtons from "../../components/projects/projectDetails/EditButtons";
import ProjectApplications from "../../components/projects/projectDetails/ProjectApplications";
import ProjectData from "../../components/projects/projectDetails/ProjectData";
import ProjectChip from "../../components/projects/projectCard/ProjectChip";

// Steps for the project tendering form
const steps = ["Rahmendaten", "Kundendaten", "Projektbeschreibung"];

/**
 * Component to create a new project tendering
 * @returns - A form to create a new project tendering
 */
const ProjectTendering = () => {
  const { id } = useParams();
  const { projectDetails, saveProject } = useProjectDetails(Number(id));
  const [isEditMode, setIsEditMode] = useState(false);
  const { auth } = useContext(AuthContext);
  const hasProjectPermission = doesPermissionsHaveSomeOf(auth.permissions, [10]);
  const hasUserApplied = false;
  const isMobile = useResponsive("down", "sm");

  if (!projectDetails) {
    return (
      <Box>
        <Typography>Es konnte kein Projekt mit dieser ID gefunden werden</Typography>
      </Box>
    );
  }

  // Project key data initial state
  const [projectKeyData, setProjectKeyData] = React.useState<ProjectKeyData>({
    projectName: projectDetails.projectName,
    jobSite: projectDetails.jobSite,
    tenderDate: dayjs(projectDetails.tenderDate),
    estimatedProjectStart: dayjs(projectDetails.estimatedProjectStart),
    estimatedProjectDuration: projectDetails.estimatedProjectDuration,
    estimatedProjectEuroPerBT: projectDetails.estimatedProjectEuroPerBT,
    estimatedProjectEuroPerBTrange: projectDetails.estimatedProjectEuroPerBTrange,
    estimatedProjectBTmin: projectDetails.estimatedProjectBTmin,
    estimatedProjectBTmax: projectDetails.estimatedProjectBTmax,
    estimatedProjectMemberMin: projectDetails.estimatedProjectMemberMin,
    estimatedProjectMemberMax: projectDetails.estimatedProjectMemberMax,
    applicationStart1: dayjs(projectDetails.applicationStart1),
    applicationEnd1: dayjs(projectDetails.applicationEnd1),
    applicationStart2: projectDetails.applicationStart1 ? dayjs(projectDetails.applicationStart1) : null,
    applicationEnd2: projectDetails.applicationEnd2 ? dayjs(projectDetails.applicationEnd2) : null,
    kickoff: dayjs(projectDetails.kickoff),
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
    applicationStart1: false,
    applicationEnd1: false,
    applicationStart2: false,
    applicationEnd2: false,
  });

  // Customer data initial state
  const [customerData, setCustomerData] = React.useState<CustomerData>({
    companyId: projectDetails.client.companyId,
    name: projectDetails.client.name,
    shortDescription: projectDetails.client.shortDescription,
    newCustomer: projectDetails.customerType === "Neukunde" ? true : false,
    acquisitor: projectDetails.acquisitor,
    acquisitionMethod: projectDetails.acquisitionMethod,
    industry: projectDetails.client.industry,
    contactPerson: projectDetails.contactPerson,
    newContactPerson: projectDetails.newContactPerson,
    newContactPersonName: "",
    street: projectDetails.client.street,
    postalCode: projectDetails.client.postalCode,
    city: projectDetails.client.city,
    addressAdditional: projectDetails.client.addressAdditional,
    url: projectDetails.client.url,
    importantInformation: projectDetails.client.importantInformation,
    contactDesired: projectDetails.client.contactDesired,
    classified: projectDetails.client.classified,
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
    situation: projectDetails.situation,
    peculiarities: projectDetails.peculiarities,
    coreCompetencies: projectDetails.coreCompetencies,
    requirementProfile: projectDetails.requirementProfile,
    referenceProjects: projectDetails.referenceProjects,
    notes: projectDetails.notes,
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
    if (
      !projectKeyData.estimatedProjectStart ||
      (projectKeyData.tenderDate && projectKeyData.estimatedProjectStart < projectKeyData.tenderDate)
    ) {
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

  // Get the total number of steps
  const totalSteps = () => {
    return steps.length;
  };

  // Check if the current step is the last step
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  // Handle the tendering or saving of the project, depending on the tendering flag, determines if an email is sent to the members and if the projectApplicationEnd has to be set
  const handleSaveProject = () => {
    alert("Saving project");
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
      !customerData.contactPerson ||
      !projectKeyData.estimatedProjectEuroPerBT ||
      !customerData.newCustomer ||
      !projectKeyData.applicationEnd1
    ) {
      // Show an error message if some data is missing
      showErrorMessage("Einige Daten fehlen oder sind fehlerhaft");
      return;
    }
    const data = {
      projectId: projectDetails.projectId,
      projectName: projectKeyData.projectName,
      status: projectKeyData.tenderDate ? "Bewerbung" : "Durchführung",
      jobSite: projectKeyData.jobSite,
      tenderDate: projectDetails.tenderDate,
      estimatedProjectStart: projectKeyData.estimatedProjectStart.toDate(),
      estimatedProjectDuration: projectKeyData.estimatedProjectDuration,
      estimatedProjectEuroPerBT: projectKeyData.estimatedProjectEuroPerBT,
      estimatedProjectEuroPerBTrange: projectKeyData.estimatedProjectEuroPerBTrange,
      estimatedProjectBTmin: projectKeyData.estimatedProjectBTmin,
      estimatedProjectBTmax: projectKeyData.estimatedProjectBTmax,
      estimatedProjectMemberMin: projectKeyData.estimatedProjectMemberMin,
      estimatedProjectMemberMax: projectKeyData.estimatedProjectMemberMax,
      applicationStart1: projectKeyData.applicationStart1 ? projectKeyData.applicationStart1.toDate() : null,
      applicationEnd1: projectKeyData.applicationEnd1?.toDate(),
      applicationStart2: projectKeyData.applicationStart2 ? projectKeyData.applicationStart2.toDate() : null,
      applicationEnd2: projectKeyData.applicationEnd2 ? projectKeyData.applicationEnd2.toDate() : null,
      situation: projectDescriptionData.situation,
      peculiarities: projectDescriptionData.peculiarities,
      coreCompetencies: projectDescriptionData.coreCompetencies,
      requirementProfile: projectDescriptionData.requirementProfile,
      referenceProjects: projectDescriptionData.referenceProjects,
      notes: projectDescriptionData.notes,
      acquisitor: customerData.acquisitor,
      acquisitionMethod: customerData.acquisitionMethod,
      newContactPerson: customerData.newContactPerson,
      contactPerson: customerData.contactPerson,
      customerType: customerData.newCustomer ? "Neukunde" : "Altkunde",
      kickoff: projectKeyData.kickoff ? projectKeyData.kickoff.toDate() : null,
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
    saveProject(data);
  };

  // Handle the next step
  const handleNext = () => {
    const newActiveStep = isLastStep() ? 0 : activeStep + 1;
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

  // Render the current step
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <KeyDataStep
            projectKeyData={projectKeyData}
            setProjectKeyData={setProjectKeyData}
            isEditMode={isEditMode}
            errors={projectKeyDataErrors}
          />
        );
      case 1:
        return (
          <CustomerStep
            customerData={customerData}
            setCustomerData={setCustomerData}
            isEditMode={isEditMode}
            errors={customerDataErrors}
          />
        );
      case 2:
        return (
          <ProjectDescriptionStep
            projectDescriptionData={projectDescriptionData}
            setProjectDescriptionData={setProjectDescriptionData}
            isEditMode={isEditMode}
            errors={projectDescriptionDataErrors}
          />
        );
      default:
        return (
          <KeyDataStep
            projectKeyData={projectKeyData}
            setProjectKeyData={setProjectKeyData}
            isEditMode={isEditMode}
            errors={projectKeyDataErrors}
          />
        );
    }
  };

  // handles the click on the edit button
  const handleEditProject = () => {
    setIsEditMode(true);
  };

  // handles the click on the cancel button
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  return (
    <Container maxWidth="lg">
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ mb: 1 }}>
        <Stack direction={"row"} gap={4} alignContent={"center"}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
            Projektdetails
          </Typography>
          <ProjectChip status={projectDetails.status} size={"medium"} />
        </Stack>
        {hasProjectPermission ? (
          isMobile ? (
            <MobileEditButtons
              isEditMode={isEditMode}
              handleCancelEdit={handleCancelEdit}
              handleEditProject={handleEditProject}
              handleSaveProject={handleSaveProject}
            />
          ) : (
            <EditButtons
              isEditMode={isEditMode}
              handleCancelEdit={handleCancelEdit}
              handleEditProject={handleEditProject}
              handleSaveProject={handleSaveProject}
            />
          )
        ) : null}
      </Stack>
      <Paper sx={{ paddingX: 4, paddingY: 2 }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ marginLeft: -1 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={handleStep(index)} sx={{ maxHeight: 2, borderRadius: 5 }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          <Box sx={{ marginTop: 3 }}>{renderStep(activeStep)}</Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2, ml: -1 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
              Zurück
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext} sx={{ mr: 1 }} variant="outlined">
              Weiter
            </Button>
          </Box>
        </React.Fragment>
      </Paper>
      {projectDetails.status === "Bewerbung" ? (
        hasUserApplied ? (
          <Button variant="contained">Bewerbung zurückziehen</Button>
        ) : (
          <Stack direction={"row"} gap={3} alignItems={"center"} sx={{ my: 2 }} justifyContent={"space-between"}>
            <Typography>Du hast dich noch nicht auf dieses Projekt beworben.</Typography>
            <Button variant="outlined" color="info">
              Jetzt bewerben
            </Button>
          </Stack>
        )
      ) : null}
      {projectDetails.status === "Bewerbung" ? (
        hasProjectPermission &&
        projectDetails.members.length > 0 && <ProjectApplications applicants={projectDetails.members} />
      ) : (
        <ProjectData
          projectMembers={projectDetails.members}
          qms={projectDetails.qms}
          euroPerBT={projectDetails.euroPerBT}
          signatureDate={projectDetails.signatureDate}
          soldBT={projectDetails.soldBT}
          soldExpenses={projectDetails.soldExpenses}
        />
      )}
    </Container>
  );
};

export default ProjectTendering;
