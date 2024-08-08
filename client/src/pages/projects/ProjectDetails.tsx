import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  MobileStepper,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
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
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import ChangeStatusButtons from "../../components/projects/projectDetails/ChangeStatusButtons";

// Steps for the project details form
const steps = ["Rahmendaten", "Kundendaten", "Projektbeschreibung"];

/**
 * Component to display the project details
 * @returns ProjectDetails component
 */
const ProjectDetails = () => {
  const { id } = useParams();
  const { projectDetails, saveProject } = useProjectDetails(Number(id));
  const [isEditMode, setIsEditMode] = useState(false);
  const { auth } = useContext(AuthContext);
  const hasProjectPermission = doesPermissionsHaveSomeOf(auth.permissions, [10]);
  const hasUserApplied = projectDetails?.members?.some((member) => member.memberId === auth.userID);
  const isMobile = useResponsive("down", "sm");
  const theme = useTheme();
  const isApplicationOpen = projectDetails?.applicationEnd1
    ? projectDetails.applicationEnd1 > new Date()
    : projectDetails?.applicationEnd2
    ? projectDetails.applicationEnd2 > new Date()
    : false;
  const isSecondApplicationPhase = projectDetails?.applicationEnd2 !== null;

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
    applicationStart2: projectDetails.applicationStart2 ? dayjs(projectDetails.applicationStart2) : null,
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

  // Reset all fields to the initial state
  const resetFields = () => {
    setProjectKeyData({
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
      applicationStart2: projectDetails.applicationStart2 ? dayjs(projectDetails.applicationStart2) : null,
      applicationEnd2: projectDetails.applicationEnd2 ? dayjs(projectDetails.applicationEnd2) : null,
      kickoff: dayjs(projectDetails.kickoff),
    });
    setProjectKeyDataErrors({
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
    setCustomerData({
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
    setCustomerDataErrors({
      customer: false,
      industry: false,
      newCustomer: false,
      contactPerson: false,
      acquisitor: false,
      newContactPersonName: false,
    });
    setProjectDescriptionData({
      situation: projectDetails.situation,
      peculiarities: projectDetails.peculiarities,
      coreCompetencies: projectDetails.coreCompetencies,
      requirementProfile: projectDetails.requirementProfile,
      referenceProjects: projectDetails.referenceProjects,
      notes: projectDetails.notes,
    });
    setProjectDescriptionDataErrors({
      coreCompetencies: false,
    });
  };

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
    // check if the status is "Bewerbung" and if so check if the applicationEnd1 was changed or if the applicationEnd1 is null / undefined
    if (
      (projectDetails.status === "Bewerbung" &&
        projectKeyData.applicationEnd1 &&
        dayjs(projectDetails.applicationEnd1).diff(projectKeyData.applicationEnd1) !== 0 &&
        projectKeyData.applicationEnd1 < dayjs()) ||
      (projectDetails.status === "Bewerbung" && !projectKeyData.applicationEnd1)
    ) {
      newErrors.applicationEnd1 = true;
      hasErrors = true;
    } else {
      newErrors.applicationEnd1 = false;
    }
    // check if the status is "Bewerbung" and if the applicationStart 2 is set and if so check if the applicationEnd2 was changed or if the applicationEnd2 is null / undefined
    if (
      (projectDetails.status === "Bewerbung" &&
        projectDetails.applicationStart2 &&
        projectKeyData.applicationEnd2 &&
        dayjs(projectDetails.applicationEnd2).diff(projectKeyData.applicationEnd2) !== 0 &&
        projectKeyData.applicationEnd2 < dayjs()) ||
      (projectDetails.status === "Bewerbung" && projectDetails.applicationStart2 && !projectKeyData.applicationEnd2)
    ) {
      newErrors.applicationEnd2 = true;
      hasErrors = true;
    } else {
      newErrors.applicationEnd2 = false;
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

  // Handle the saving of the project
  const handleSaveProject = () => {
    if (validateProjectKeyData()) {
      alert("Error in project key data");
      return;
    }
    if (validateCustomerData()) {
      alert("Error in project customer data");
      return;
    }
    if (validateProjectDescriptionData()) {
      alert("Error in project description data");
      return;
    }
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
    setIsEditMode(false);
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
            isProjectDeatails
            projectStatus={projectDetails.status}
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
    resetFields();
    setIsEditMode(false);
  };

  // handles the click on the accepted button
  const handleOfferAccepted = () => {
    alert("Offer accepted");
  };

  // handles the click on the rejected button
  const handleOfferRejected = () => {
    alert("Offer rejected");
  };

  // handles the click on the pitch lost button
  const handlePitchLost = () => {
    alert("Pitch lost");
  };

  // handles the click on the billing button
  const handleBilling = () => {
    alert("Billing");
  };

  // handles the click on the call off button
  const handleCallOffProject = () => {
    alert("Call off");
  };

  // handles the click on the share applications button
  const handleShareApplications = () => {
    alert("Share applications");
  };

  // handles the click on the team composition button
  const handleTeamComposition = () => {
    alert("Team composition");
  };

  // handles the click on the start second application phase button
  const handleStartSecondApplicationPhase = () => {
    alert("Start second application phase");
  };

  return (
    <Container maxWidth="lg">
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "start" : "center"}
        sx={{ mb: 1 }}
      >
        <Stack direction={"row"} gap={4} alignContent={"center"} justifyContent={"space-between"}>
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
            <Stack direction={"row"}>
              {!isEditMode ? (
                <ChangeStatusButtons
                  handleOfferAccepted={handleOfferAccepted}
                  handleOfferRejected={handleOfferRejected}
                  handlePitchLost={handlePitchLost}
                  handleBilling={handleBilling}
                  handleCallOff={handleCallOffProject}
                  status={projectDetails.status}
                />
              ) : null}

              <EditButtons
                isEditMode={isEditMode}
                handleCancelEdit={handleCancelEdit}
                handleEditProject={handleEditProject}
                handleSaveProject={handleSaveProject}
              />
            </Stack>
          )
        ) : null}
      </Stack>
      <Paper sx={{ paddingX: isMobile ? 2 : 4, paddingY: 2 }}>
        {isMobile ? (
          <>
            <Typography sx={{ fontWeight: "bold", fontSize: 24 }} gutterBottom>
              {steps[activeStep]}
            </Typography>
            <MobileStepper
              variant="text"
              steps={steps.length}
              activeStep={activeStep}
              position="static"
              sx={{ mt: -1, mb: 2 }}
              nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === steps.length - 1}>
                  Next
                  {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
            <Box>{renderStep(activeStep)}</Box>
            <MobileStepper
              variant="text"
              steps={steps.length}
              activeStep={activeStep}
              position="static"
              sx={{ mt: 2 }}
              nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === steps.length - 1}>
                  Next
                  {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
          </>
        ) : (
          <React.Fragment>
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
              </Box>
            </React.Fragment>
          </React.Fragment>
        )}
      </Paper>
      {projectDetails.status === "Bewerbung" && isApplicationOpen ? (
        hasUserApplied ? (
          <Stack
            sx={{ mt: isMobile ? 4 : 2 }}
            direction={isMobile ? "column" : "row"}
            gap={3}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography>Möchtest du deine Bewerbung zurückziehen?</Typography>
            <Button variant="outlined" color="error">
              Bewerbung zurückziehen
            </Button>
          </Stack>
        ) : (
          <Stack
            direction={isMobile ? "column" : "row"}
            gap={3}
            alignItems={"center"}
            sx={{ mt: isMobile ? 4 : 2 }}
            justifyContent={"space-between"}
          >
            <Typography>Du hast dich noch nicht auf dieses Projekt beworben.</Typography>
            <Button variant="outlined" color="info">
              Jetzt bewerben
            </Button>
          </Stack>
        )
      ) : null}
      {projectDetails.status === "Bewerbung" ? (
        hasProjectPermission &&
        projectDetails.members.length > 0 && (
          <ProjectApplications
            applicants={projectDetails.members}
            handleShareApplications={handleShareApplications}
            handleTeamComposition={handleTeamComposition}
            handleStartSecondApplicationPhase={handleStartSecondApplicationPhase}
            handleCallOffProject={handleCallOffProject}
            isApplicationOpen={isApplicationOpen}
            isSecondApplicationPhase={isSecondApplicationPhase}
          />
        )
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

export default ProjectDetails;
