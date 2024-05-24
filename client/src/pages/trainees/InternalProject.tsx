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
import { InternalProjectDto } from "../../types/traineesTypes";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import LoadingCircle from "../../components/general/LoadingCircle";
import EditInternalProjectDialog from "../../components/members/trainees/EditInternalProjectDialog";
import dayjs from "dayjs";
import api from "../../utils/api";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { AxiosError, AxiosResponse } from "axios";
import useTrainees from "../../hooks/trainees/useTrainees";
import useInternalProjectDetails from "../../hooks/trainees/useInternalProjectDetails";
import useMembers from "../../hooks/members/useMembers";

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
  const { auth, dispatchAuth } = useContext(AuthContext);
  const hasInternalProjectPermission = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const [internalProjectInfoDialogOpen, setInternalProjectInfoDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { trainees } = useTrainees();
  const { members } = useMembers();
  const { internalProjectDetails, isInternalProjectDetailsFetched, updateInternalProjectDetails } =
    useInternalProjectDetails(Number(id));

  const selectableQMs = members.filter(
    (member) => member.memberStatus?.name !== "Trainee" && member.memberStatus?.name !== "Ausgetretene"
  );
  const selectableTrainees = trainees.filter((trainee) => trainee.memberStatus?.name !== "Ausgetretene");

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

  const handleUpdateInternalProjectDetails = (ipDetails: InternalProjectDto) => {
    console.log(ipDetails);
    return;
    updateInternalProjectDetails(ipDetails).then((response: AxiosResponse) => {
      response.status === 204 ? handleInternalProjectInfoDialogClose() : null;
    });
  };

  /**
   * Deletes the internal project
   * @param id - The id of the internal project to be deleted
   */
  const deleteInternalProject = (id: number) => {
    api
      .delete(`/trainees/ip/${id}`)
      .then((res) => {
        if (res.status === 204) {
          showSuccessMessage("Internes Projekt erfolgreich gelöscht!");
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response?.status === 500) {
          showErrorMessage("Löschen ist fehlgeschlagen!");
        } else {
          showErrorMessage("Löschen ist fehlgeschlagen!");
        }
      });
  };

  // Fields for the internal project details
  const internalProjectDetailsFields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: internalProjectDetails?.projectName,
      type: "text",
    },
    {
      label: "Kürzel",
      value: internalProjectDetails?.abbreviation,
      type: "text",
    },
    {
      label: "Traineegeneration",
      value: internalProjectDetails?.generationName,
      type: "text",
    },
    {
      label: "Kickoff",
      value: internalProjectDetails?.kickoff ? dayjs(internalProjectDetails?.kickoff).format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "Angebot abgegeben",
      value: internalProjectDetails?.offerAtEv,
      type: "checkbox",
    },
    {
      label: "ZP abgegeben",
      value: internalProjectDetails?.zpAtEv,
      type: "checkbox",
    },
    {
      label: "ZP Datum",
      value: internalProjectDetails?.zpHeld ? dayjs(internalProjectDetails?.zpHeld).format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "AP abgegeben",
      value: internalProjectDetails?.apAtEv,
      type: "checkbox",
    },
    {
      label: "AP Datum",
      value: internalProjectDetails?.apHeld ? dayjs(internalProjectDetails?.apHeld).format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "DL abgegeben",
      value: internalProjectDetails?.dlAtEv,
      type: "checkbox",
    },
    {
      label: "Projektmitglieder",
      value: internalProjectDetails?.members || [],
      type: "memberList",
    },
    {
      label: "Qualitätsmanager",
      value: internalProjectDetails?.qualityManagers || [],
      type: "memberList",
    },
  ];

  /*
   * Returns the internal project details if the retrieval of the internal project was successful (internalProjectDetails is not null or undefined)
   */
  return isInternalProjectDetailsFetched ? (
    <div>
      <EditInternalProjectDialog
        internalProjectDetails={internalProjectDetails}
        open={internalProjectInfoDialogOpen}
        closeDialog={handleInternalProjectInfoDialogClose}
        updateInternalProjectDetails={handleUpdateInternalProjectDetails}
        selectableQMs={selectableQMs}
        selectableTrainees={selectableTrainees}
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
                    Bist Du sicher, dass Du das interne Projekt <strong>"{internalProjectDetails?.projectName}"</strong>{" "}
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
