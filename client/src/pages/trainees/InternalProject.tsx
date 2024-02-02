import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, IconButton, styled } from "@mui/material";

import { Edit } from "@mui/icons-material";
import * as traineesTypes from "../../types/traineesTypes";
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

  const [internalProjectDetails, setInternalProjectDetails] = useState<traineesTypes.IpInfoType | null>(null);
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
   * Retrieves dummy member details
   */
  const getInternalProjectDetails: (id: number) => void = (id) => {
    /* TO-DO: Implement API call to retrieve internal project details
     *  setInternalProjectDetails(ip);
     *  setName(InternalProjectDetails?.name);
     */
    if (id === 5) {
      const ip = {
        id: 5,
        name: "Analoges Bootcamp",
        kuerzel: "DB",
        traineegeneration: "Sommersemester 2022",
        kickoff: dayjs("2023-11-25"),
        angebotAbgegeben: true,
        apDatum: null,
        apAbgegeben: false,
        zpDatum: dayjs("2024-03-10"),
        zpAbgegeben: true,
        dlAbgegeben: false,
        projektmitglieder: [
          {
            mitgliedID: 8364,
            name: "Jimmie O'Brien",
            vorname: "vorname1",
            nachname: "nachname1",
            mitgliedstatus: "Trainee",
          },
          {
            mitgliedID: 8320,
            name: "Radhika Norton",
            vorname: "vorname2",
            nachname: "nachname2",
            mitgliedstatus: "Trainee",
          },
          {
            mitgliedID: 8478,
            name: "Kellan Mclaughlin",
            vorname: "vorname3",
            nachname: "nachname3",
            mitgliedstatus: "Trainee",
          },
        ],
        qualitaetsmanager: [
          {
            mitgliedID: 8338,
            name: "Mariana Macdonald",
            vorname: "vorname4",
            nachname: "nachname4",
            mitgliedstatus: "Senior",
          },
          {
            mitgliedID: 8167,
            name: "Wolfgang U Luft",
            vorname: "vorname4",
            nachname: "nachname4",
            mitgliedstatus: "aktives Mitglied",
          },
        ],
      };

      setInternalProjectDetails(ip);
    }
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
                .map((member: Member) => ({
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
                .map((trainee: traineesTypes.TraineeShort) => ({
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

  useEffect(() => {
    const fetchDetails = async () => {
      getInternalProjectDetails(Number(id));
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    getSelectableQms();
  }, [getSelectableQms]);

  useEffect(() => {
    getTrainees();
  }, [getTrainees]);

  const internalProjectDetailsFields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: internalProjectDetails?.name,
      type: "text",
    },
    {
      label: "Kürzel",
      value: internalProjectDetails?.kuerzel,
      type: "text",
    },
    {
      label: "Traineegeneration",
      value: internalProjectDetails?.traineegeneration,
      type: "text",
    },
    {
      label: "Kickoff",
      value: internalProjectDetails?.kickoff ? internalProjectDetails?.kickoff.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "Angebot abgegeben",
      value: internalProjectDetails?.angebotAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "ZP abgegeben",
      value: internalProjectDetails?.zpAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "ZP Datum",
      value: internalProjectDetails?.zpDatum ? internalProjectDetails?.zpDatum.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "AP abgegeben",
      value: internalProjectDetails?.apAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "AP Datum",
      value: internalProjectDetails?.apDatum ? internalProjectDetails?.apDatum.format("DD.MM.YYYY") : "",
      type: "text",
    },
    {
      label: "DL abgegeben",
      value: internalProjectDetails?.dlAbgegeben ? true : false,
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
        updateInternalProjectDetails={setInternalProjectDetails}
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
