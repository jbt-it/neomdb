import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, IconButton, styled } from "@mui/material";

import { Edit } from "@mui/icons-material";
import { InternalProjectDetails, TraineeShort } from "../../types/traineesTypes";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import LoadingCircle from "../../components/general/LoadingCircle";
import PageBar from "../../components/navigation/PageBar";
import EditInternalProjectDialog from "../../components/members/trainees/EditInternalProjectDialog";
import dayjs from "dayjs";
import api from "../../utils/api";
import { authReducerActionType } from "../../types/globalTypes";
import { Member, MembersField } from "../../types/membersTypes";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import axios, { AxiosError } from "axios";

// Styling for the paper element
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
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

  const [internalProjectDetails, setInternalProjectDetails] = useState<InternalProjectDetails | null>(null);
  const [internalProjectInfoDialogOpen, setInternalProjectInfoDialogOpen] = useState<boolean>(false);
  const [selectableQMs, setSelectableQMs] = useState<MembersField[]>([]);
  const [trainees, setTrainees] = useState<MembersField[]>([]);

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
            const internalProject: InternalProjectDetails = {
              internesProjektID: res.data.internesProjektID,
              projektname: res.data.projektname,
              kuerzel: res.data.kuerzel,
              generation: res.data.generation,
              generationsBezeichnung: res.data.generationsBezeichnung,
              kickoff: res.data.kickoff ? dayjs(res.data.kickoff) : null,
              AngebotBeiEV: res.data.AngebotBeiEV === 1 ? true : false,
              ZPBeiEV: res.data.ZPBeiEV === 1 ? true : false,
              ZPGehalten: res.data.ZPGehalten ? dayjs(res.data.ZPGehalten) : null,
              APBeiEV: res.data.APBeiEV === 1 ? true : false,
              APGehalten: res.data.APGehalten ? dayjs(res.data.APGehalten) : null,
              DLBeiEV: res.data.DLBeiEV === 1 ? true : false,
              projektmitglieder: res.data.projektmitglieder.map((member: Member) => ({
                mitgliedID: member.mitgliedID,
                name: `${member.vorname} ${member.nachname}`,
                vorname: member.vorname,
                nachname: member.nachname,
                mitgliedstatus: member.mitgliedstatus,
              })),
              qualitaetsmanager: res.data.qualitaetsmanager.map((member: Member) => ({
                mitgliedID: member.mitgliedID,
                name: `${member.vorname} ${member.nachname}`,
                vorname: member.vorname,
                nachname: member.nachname,
                mitgliedstatus: member.mitgliedstatus,
              })),
            };
            setInternalProjectDetails(internalProject);
          }
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            console.error("Request was aborted");
          } else {
            console.error(err.message);
          }
        } else if (err.response) {
          console.error(err.response.data);
          if (err.response.status === 401) {
            dispatchAuth({ type: authReducerActionType.deauthenticate });
          }
        } else {
          // Handle the error when there's no response
          console.error(err);
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
                .map((member: MembersField) => ({
                  mitgliedID: member.mitgliedID,
                  name: `${member.vorname} ${member.nachname}`,
                  vorname: member.vorname,
                  nachname: member.nachname,
                  mitgliedstatus: member.mitgliedstatus,
                }))
                .filter(
                  (member: MembersField) =>
                    member.mitgliedstatus !== "Trainee" && member.mitgliedstatus !== "Ausgetretene"
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
            setTrainees(
              res.data
                .map((trainee: TraineeShort) => ({
                  mitgliedID: trainee.mitgliedID,
                  name: `${trainee.vorname} ${trainee.nachname}`,
                  vorname: trainee.vorname,
                  nachname: trainee.nachname,
                  mitgliedstatus: "Trainee",
                }))
                .filter((trainee: MembersField) => trainee.mitgliedstatus !== "Ausgetretene")
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

  const updateInternalProjectDetails = (updatedInternalProjectDetails: InternalProjectDetails) => {
    const newInternalProjectDetails = {
      internesProjektID: updatedInternalProjectDetails.internesProjektID,
      projektname: updatedInternalProjectDetails.projektname,
      kuerzel: updatedInternalProjectDetails.kuerzel,
      generation: updatedInternalProjectDetails.generation,
      generationsBezeichnung: updatedInternalProjectDetails.generationsBezeichnung,
      kickoff: updatedInternalProjectDetails.kickoff
        ? updatedInternalProjectDetails.kickoff.format("YYYY-MM-DD")
        : null,
      AngebotBeiEV: updatedInternalProjectDetails.AngebotBeiEV,
      ZPBeiEV: updatedInternalProjectDetails.ZPBeiEV,
      ZPGehalten: updatedInternalProjectDetails.ZPGehalten
        ? updatedInternalProjectDetails.ZPGehalten.format("YYYY-MM-DD")
        : null,
      APBeiEV: updatedInternalProjectDetails.APBeiEV,
      APGehalten: updatedInternalProjectDetails.APGehalten
        ? updatedInternalProjectDetails.APGehalten.format("YYYY-MM-DD")
        : null,
      DLBeiEV: updatedInternalProjectDetails.DLBeiEV,
      projektmitglieder: updatedInternalProjectDetails.projektmitglieder.map((member: MembersField) => ({
        mitgliedID: member.mitgliedID,
        vorname: member.vorname,
        nachname: member.nachname,
      })),
      qualitaetsmanager: updatedInternalProjectDetails.qualitaetsmanager.map((member: MembersField) => ({
        mitgliedID: member.mitgliedID,
        vorname: member.vorname,
        nachname: member.nachname,
      })),
    };

    api
      .put(`/trainees/ip/${updatedInternalProjectDetails.internesProjektID}`, newInternalProjectDetails)
      .then((res) => {
        if (res.status === 204) {
          showSuccessMessage("Aktualisierung erfolgreich!");
          handleInternalProjectInfoDialogClose();
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

  useEffect(() => {
    getInternalProjectDetails(Number(id));
  }, [id, updateInternalProjectDetails]);

  useEffect(() => {
    getSelectableQms();
  }, [getSelectableQms]);

  useEffect(() => {
    getTrainees();
  }, [getTrainees]);

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
            <IconButton
              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleInternalProjectInfoDialogOpen(event)
              }
            >
              <Edit fontSize="inherit" />
            </IconButton>
          ) : null}
        </Box>
        <Box>
          <InfoSection fields={internalProjectDetailsFields} />
        </Box>
      </StyledPaper>
      <PageBar pageTitle="Internesprojekt" />
    </div>
  ) : (
    <LoadingCircle />
  );
};

export default InternalProject;
