import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { MembersFieldDto } from "../../types/membersTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import axios, { AxiosError } from "axios";

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

  const [internalProjectDetails, setInternalProjectDetails] = useState<InternalProjectDto | null>(null);
  const [selectableQMs, setSelectableQMs] = useState<MembersFieldDto[]>([]);
  const [trainees, setTrainees] = useState<MembersFieldDto[]>([]);
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

  /**
   * Retrieves the internal project details
   */
  const getInternalProjectDetails = (id: number) => {
    let mounted = true;
    api
      .get(`/trainees/ip/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            /* TODO: Check implementation */
            // const internalProject: InternalProjectDto = {
            //   internesProjektID: res.data.internesProjektID,
            //   projektname: res.data.projektname,
            //   kuerzel: res.data.kuerzel,
            //   generation: res.data.generation,
            //   generationsBezeichnung: res.data.generationsBezeichnung,
            //   kickoff: res.data.kickoff ? dayjs(res.data.kickoff).toDate() : null,
            //   AngebotBeiEV: res.data.AngebotBeiEV === 1 ? true : false,
            //   ZPBeiEV: res.data.ZPBeiEV === 1 ? true : false,
            //   ZPGehalten: res.data.ZPGehalten ? dayjs(res.data.ZPGehalten) : null,
            //   APBeiEV: res.data.APBeiEV === 1 ? true : false,
            //   APGehalten: res.data.APGehalten ? dayjs(res.data.APGehalten) : null,
            //   DLBeiEV: res.data.DLBeiEV === 1 ? true : false,
            //   projektmitglieder: res.data.projektmitglieder.map((member: MemberPartialDto) => ({
            //     mitgliedID: member.memberId,
            //     name: `${member.firstname} ${member.lastname}`,
            //     vorname: member.firstname,
            //     nachname: member.lastname,
            //     mitgliedstatus: member.memberStatus,
            //   })),
            //   qualitaetsmanager: res.data.qualitaetsmanager.map((member: MemberPartialDto) => ({
            //     mitgliedID: member.memberId,
            //     name: `${member.firstname} ${member.lastname}`,
            //     vorname: member.firstname,
            //     nachname: member.lastname,
            //     mitgliedstatus: member.memberStatus,
            //   })),
            // };
            setInternalProjectDetails(res.data);
          }
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else if (error.code === "ECONNABORTED") {
          console.log("Timeout error", error.message);
        } else {
          // handle other errors
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  // Retrieves all members and only sets the selectableQMs to the ones that are not trainees or no longer part of jbt
  const getSelectableQms: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setSelectableQMs(
              res.data
                .map((member: MembersFieldDto) => ({
                  memberId: member.memberId,
                  firstname: member.firstname,
                  lastname: member.lastname,
                  memberStatus: member.memberStatus?.name,
                }))
                .filter(
                  (member: MembersFieldDto) =>
                    member.memberStatus?.name !== "Trainee" && member.memberStatus?.name !== "Ausgetretene"
                )
            );
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  // Retrieves the current trainees
  const getTrainees: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/trainees/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setTrainees(res.data.filter((trainee: MembersFieldDto) => trainee.memberStatus?.name !== "Ausgetretene"));
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  /**
   * Updates the internal project details
   * @param updatedInternalProjectDetails - The updated internal project details
   */
  const updateInternalProjectDetails = (updatedInternalProjectDetails: InternalProjectDto) => {
    event?.preventDefault();

    // const newInternalProjectDetails = {
    //   internesProjektID: updatedInternalProjectDetails.internalProjectID,
    //   projektname: updatedInternalProjectDetails.projectName,
    //   kuerzel: updatedInternalProjectDetails.abbreviation,
    //   generation: updatedInternalProjectDetails.generation,
    //   generationsBezeichnung: updatedInternalProjectDetails.generationName,
    //   kickoff: updatedInternalProjectDetails.kickoff
    //     ? updatedInternalProjectDetails.kickoff.format("YYYY-MM-DD")
    //     : null,
    //   AngebotBeiEV: updatedInternalProjectDetails.AngebotBeiEV,
    //   ZPBeiEV: updatedInternalProjectDetails.ZPBeiEV,
    //   ZPGehalten: updatedInternalProjectDetails.ZPGehalten
    //     ? updatedInternalProjectDetails.ZPGehalten.format("YYYY-MM-DD")
    //     : null,
    //   APBeiEV: updatedInternalProjectDetails.APBeiEV,
    //   APGehalten: updatedInternalProjectDetails.APGehalten
    //     ? updatedInternalProjectDetails.APGehalten.format("YYYY-MM-DD")
    //     : null,
    //   DLBeiEV: updatedInternalProjectDetails.DLBeiEV,
    //   projektmitglieder: updatedInternalProjectDetails.projektmitglieder.map((member: MembersFieldDto) => ({
    //     memberId: member.memberId,
    //     firstname: member.firstname,
    //     lastname: member.lastname,
    //   })),
    //   qualitaetsmanager: updatedInternalProjectDetails.qualitaetsmanager.map((member: MembersFieldDto) => ({
    //     memberId: member.memberId,
    //     firstname: member.firstname,
    //     lastname: member.lastname,
    //   })),
    // };

    api
      .put(`/trainees/ip/${updatedInternalProjectDetails.internalProjectId}`, updatedInternalProjectDetails)
      .then((res) => {
        if (res.status === 204) {
          showSuccessMessage("Aktualisierung erfolgreich!");
          handleInternalProjectInfoDialogClose();
          getInternalProjectDetails(Number(id));
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response?.status === 500) {
          showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        }
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

  useEffect(() => {
    getInternalProjectDetails(Number(id));
  }, [id]);

  useEffect(() => {
    getSelectableQms();
  }, [getSelectableQms]);

  useEffect(() => {
    getTrainees();
  }, [getTrainees]);

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
  return internalProjectDetails ? (
    <div>
      <EditInternalProjectDialog
        internalProjectDetails={internalProjectDetails}
        open={internalProjectInfoDialogOpen}
        closeDialog={handleInternalProjectInfoDialogClose}
        updateInternalProjectDetails={updateInternalProjectDetails}
        selectableQMs={selectableQMs}
        selectableTrainees={trainees}
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
