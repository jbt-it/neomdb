import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import ProjectDocumentDetails from "../../components/projects/projectBilling/ProjectDocumentDetails";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { Edit, Payments } from "@mui/icons-material";
import ProjectBillingDetails from "../../components/projects/projectBilling/ProjectBillingDetails";
import BTAllocation from "../../components/projects/projectBilling/BTAllocation";
import BillingDialog from "../../components/projects/projectBilling/BillingDialog";
import BillingWarningDialog from "../../components/projects/projectBilling/BillingWarningDialog";
import BTAllocationDialog from "../../components/projects/projectBilling/BTAllocationDialog";
import { MemberBTAllocationDto } from "../../types/projectTypes";

/**
 * ProjectBilling component to display the billing of a project
 * @returns - A container with the billing of a project
 */
const ProjectBilling = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    projectBillingDetailsDto,
    saveBTAllocation,
    checkProjectBillingCheckmark,
    checkFreelancerContract,
    checkMoneyTransferred,
  } = useProjectDetails(Number(id));
  if (!projectBillingDetailsDto) {
    return null;
  }

  const [billingDialogOpen, setBillingDialogOpen] = React.useState(false);
  const [billingWarningDialogOpen, setBillingWarningDialogOpen] = React.useState(false);
  const [btAllocationDialogOpen, setBTAllocationDialogOpen] = React.useState(false);
  const hasPermissionDocumentFiling = doesPermissionsHaveSomeOf(auth.permissions, [7]);
  const hasPermissionProjectBilling = doesPermissionsHaveSomeOf(auth.permissions, [19]);
  const hasPermissionCRM = doesPermissionsHaveSomeOf(auth.permissions, [13]);
  const isPL =
    projectBillingDetailsDto?.membersBilling.find((member) => member.memberId === auth.userID)?.type === "PL";
  const canSeePage =
    doesPermissionsHaveSomeOf(auth.permissions, [19, 22, 7, 13, 11]) ||
    projectBillingDetailsDto?.membersBilling.find((member) => member.memberId === auth.userID);

  // Check for correct permission
  if (!canSeePage) {
    return (
      <Container>
        <Stack>
          <Typography variant="h5" fontWeight={"bold"}>
            Keine Berechtigung
          </Typography>
          <Typography variant="body1">Sie haben keine Berechtigung diese Seite zu sehen.</Typography>
        </Stack>
      </Container>
    );
  }

  // Check for correct project status
  if (
    projectBillingDetailsDto.status != "Durchführung" &&
    projectBillingDetailsDto.status != "Abrechnung" &&
    projectBillingDetailsDto.status != "Abgeschlossen"
  ) {
    return (
      <Container>
        <Stack>
          <Typography variant="h5" fontWeight={"bold"}>
            Projektstatus falsch
          </Typography>
          <Typography variant="body1">Das Projekt befindet sich nicht in Abrechnung.</Typography>
        </Stack>
      </Container>
    );
  }

  // handle billing dialog open
  const handleOpenBillingDialog = () => {
    if (
      !projectBillingDetailsDto.signatureDate ||
      !projectBillingDetailsDto.euroPerBT ||
      !projectBillingDetailsDto.soldBT ||
      !projectBillingDetailsDto.soldExpenses
    ) {
      setBillingWarningDialogOpen(true);
    } else {
      setBillingDialogOpen(true);
    }
  };

  // handle billing dialog close
  const handleCloseBillingDialog = () => {
    setBillingDialogOpen(false);
  };

  // handle start billing
  const handleStartBilling = () => {
    alert("Abrechnung gestartet");
    setBillingDialogOpen(false);
  };

  // handle billing warning dialog close
  const handleCloseBillingWarning = () => {
    setBillingWarningDialogOpen(false);
    navigate(`/projekte/${id}`);
  };

  // handle open BT allocation dialog
  const handleOpenBTAllocationDialog = () => {
    setBTAllocationDialogOpen(true);
  };

  // handle close BT allocation dialog
  const handleCloseBTAllocationDialog = () => {
    setBTAllocationDialogOpen(false);
  };

  // handle save BT allocation
  const handleSaveBTAllocation = (allocations: MemberBTAllocationDto[]) => {
    saveBTAllocation(allocations);
    setBTAllocationDialogOpen(false);
  };

  return (
    <Container sx={{ marginBottom: 4 }}>
      {projectBillingDetailsDto.status === "Durchführung" && (isPL || hasPermissionProjectBilling) ? (
        <Button
          variant="outlined"
          color="success"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleOpenBillingDialog}
          startIcon={<Payments />}
          size="small"
        >
          Abrechnung
        </Button>
      ) : null}
      <BillingDialog
        billingDialogOpen={billingDialogOpen}
        handleCloseBillingDialog={handleCloseBillingDialog}
        handleStartBilling={handleStartBilling}
      />
      <BillingWarningDialog
        billingWarningDialogOpen={billingWarningDialogOpen}
        handleCloseBillingWarning={handleCloseBillingWarning}
      />
      <BTAllocationDialog
        btAllocationDialogOpen={btAllocationDialogOpen}
        handleCloseBTAllocationDialog={handleCloseBTAllocationDialog}
        saveBTAllocation={handleSaveBTAllocation}
        projectMembers={projectBillingDetailsDto.membersBilling}
        soldBT={projectBillingDetailsDto.soldBT || 0}
        soldExpenses={projectBillingDetailsDto.soldExpenses || 0}
      />
      <Stack>
        <Typography variant="body1" fontSize={18} fontWeight={"bold"} sx={{ mb: 2 }}>
          Bestätigung von Dokumenten
        </Typography>
        <ProjectDocumentDetails
          projectBillingDetailsDto={projectBillingDetailsDto}
          hasPermissionDocumentFiling={hasPermissionDocumentFiling}
          hasPermissionProjectBilling={hasPermissionProjectBilling}
          hasPermissionCRM={hasPermissionCRM}
          checkProjectBillingCheckmark={checkProjectBillingCheckmark}
          checkFreelancerContract={checkFreelancerContract}
          checkMoneyTransferred={checkMoneyTransferred}
        />
      </Stack>
      {(projectBillingDetailsDto.status === "Abrechnung" || projectBillingDetailsDto.status === "Abgeschlossen") &&
      projectBillingDetailsDto.soldBT != null &&
      projectBillingDetailsDto.euroPerBT != null &&
      projectBillingDetailsDto.soldExpenses != null &&
      (isPL || hasPermissionProjectBilling) ? (
        <Box>
          <Divider sx={{ marginTop: 4, marginBottom: 4, borderColor: "primary.main" }} />
          <Stack>
            <Typography variant="body1" fontSize={18} fontWeight={"bold"} sx={{ mb: 2 }}>
              Informationen zur Projektabrechnung {projectBillingDetailsDto.projectName}
            </Typography>
            <ProjectBillingDetails
              soldBT={projectBillingDetailsDto.soldBT}
              euroPerBT={projectBillingDetailsDto.euroPerBT}
              soldExpenses={projectBillingDetailsDto.soldExpenses}
            />
          </Stack>
          <Divider sx={{ marginTop: 4, marginBottom: 4, borderColor: "primary.main" }} />
          <Stack direction={"column"}>
            <Stack direction={"row"} spacing={10} alignItems={"center"} sx={{ mb: 2 }}>
              <Typography variant="body1" fontSize={18} fontWeight={"bold"}>
                Aufteilung innerhalb des Teams
              </Typography>
              {projectBillingDetailsDto.status === "Abrechnung" ? (
                <Button
                  variant="contained"
                  sx={{ maxWidth: 250 }}
                  size="small"
                  color="secondary"
                  onClick={handleOpenBTAllocationDialog}
                >
                  <Edit fontSize="small" sx={{ marginRight: 2 }} /> BT-Einteilung eingeben
                </Button>
              ) : null}
            </Stack>
            <BTAllocation
              soldBT={projectBillingDetailsDto.soldBT}
              euroPerBT={projectBillingDetailsDto.euroPerBT}
              soldExpenses={projectBillingDetailsDto.soldExpenses}
              projectMembers={projectBillingDetailsDto.membersBilling}
            />
          </Stack>
        </Box>
      ) : null}
    </Container>
  );
};

export default ProjectBilling;
