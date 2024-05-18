import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  styled,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import LoadingCircle from "../../components/general/LoadingCircle";
import EditInternalProjectDialog from "../../components/members/trainees/EditInternalProjectDialog";
import { Member, MemberStatus, MembersField } from "../../types/membersTypes";
import useMembers from "../../hooks/members/useMembers";
import useTrainees from "../../hooks/useTrainees";
import useInternalProjectDetails from "../../hooks/useInternalProjectDetails";

// Styling for the paper element
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "600px",
}));

/**
 * Function that allows displays internal project details
 * @returns returns the interface for the user
 */
const InternalProject: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { auth } = useContext(AuthContext);
  const hasInternalProjectPermission = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const { members } = useMembers();
  const { trainees } = useTrainees();
  const { internalProjectDetails, updateInternalProjectDetails, deleteInternalProject } = useInternalProjectDetails(
    Number(id)
  );

  const selectableQMs: MembersField[] = members
    .filter((member: Member) => member.mitgliedstatus !== "Trainee" && member.mitgliedstatus !== "Ausgetretene")
    .map((member: Member) => ({
      mitgliedID: member.mitgliedID,
      name: `${member.vorname} ${member.nachname}`,
      vorname: member.vorname,
      nachname: member.nachname,
      mitgliedstatus: member.mitgliedstatus as MemberStatus,
    }));

  const [internalProjectInfoDialogOpen, setInternalProjectInfoDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  /**
   * Handles the click on the edit button of the internal project information section
   * @param event MouseEvent
   */
  const handleInternalProjectInfoDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setInternalProjectInfoDialogOpen(true);
  };

  /**
   * Handles the closing of the edit dialog
   */
  const handleInternalProjectInfoDialogClose = () => {
    setInternalProjectInfoDialogOpen(false);
  };

  /**
   * Handles the opening of the delete dialog
   */
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  /**
   * Handles the closing of the delete dialog
   */
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Fields for the internal project details
  const internalProjectDetailsFields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: internalProjectDetails?.projektname,
      type: "text",
    },
    {
      label: "Kürzel",
      value: internalProjectDetails?.kuerzel,
      type: "text",
    },
    {
      label: "Traineegeneration",
      value: internalProjectDetails?.generationsBezeichnung,
      type: "text",
    },
    {
      label: "Kickoff",
      value: internalProjectDetails?.kickoff ? internalProjectDetails?.kickoff.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "Angebot abgegeben",
      value: internalProjectDetails?.AngebotBeiEV ? true : false,
      type: "checkbox",
    },
    {
      label: "ZP abgegeben",
      value: internalProjectDetails?.ZPBeiEV ? true : false,
      type: "checkbox",
    },
    {
      label: "ZP Datum",
      value: internalProjectDetails?.ZPGehalten ? internalProjectDetails?.ZPGehalten.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "AP abgegeben",
      value: internalProjectDetails?.APBeiEV ? true : false,
      type: "checkbox",
    },
    {
      label: "AP Datum",
      value: internalProjectDetails?.APGehalten ? internalProjectDetails?.APGehalten.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "DL abgegeben",
      value: internalProjectDetails?.DLBeiEV ? true : false,
      type: "checkbox",
    },
    {
      label: "Projektmitglieder",
      value: internalProjectDetails?.projektmitglieder,
      type: "memberList",
    },
    {
      label: "Qualitätsmanager",
      value: internalProjectDetails?.qualitaetsmanager,
      type: "memberList",
    },
  ];

  /*
   * Returns the internal project details if the retrieval of the internal project was successful (internalProjectDetails is not null or undefined)
   */
  return internalProjectDetails ? (
    <div>
      <EditInternalProjectDialog
        internalProjectDetails={internalProjectDetails}
        open={internalProjectInfoDialogOpen}
        closeDialog={handleInternalProjectInfoDialogClose}
        updateInternalProjectDetails={updateInternalProjectDetails}
        selectableQMs={selectableQMs}
        selectableTrainees={trainees
          .map((trainee) => ({
            ...trainee,
            mitgliedstatus: trainee.mitgliedstatus as MemberStatus,
            name: `${trainee.vorname} ${trainee.nachname}`,
          }))
          .filter((trainee: MembersField) => trainee.mitgliedstatus !== "Ausgetretene")}
      />

      <StyledPaper>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>
            Informationen zum internen Projekt
          </Typography>
          {hasInternalProjectPermission ? (
            <Box>
              <IconButton
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  handleInternalProjectInfoDialogOpen(event)
                }
              >
                <Edit fontSize="inherit" />
              </IconButton>
              <IconButton onClick={handleDeleteDialogOpen}>
                <Delete fontSize="inherit" />
              </IconButton>
              <Dialog open={deleteDialogOpen}>
                <DialogTitle>Internes Projekt löschen</DialogTitle>
                <DialogContent>
                  <Typography>
                    Bist Du sicher, dass Du das interne Projekt <strong>"{internalProjectDetails?.projektname}"</strong>{" "}
                    löschen möchtest?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteInternalProject(Number(id));
                    }}
                    color="error"
                  >
                    Löschen
                  </Button>
                  <Button onClick={handleDeleteDialogClose} variant="contained" color="secondary">
                    Abbrechen
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : null}
        </Box>
        <Box>
          <InfoSection fields={internalProjectDetailsFields} />
        </Box>
      </StyledPaper>
    </div>
  ) : (
    <LoadingCircle />
  );
};

export default InternalProject;
