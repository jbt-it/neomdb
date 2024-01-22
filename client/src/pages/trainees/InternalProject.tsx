import React, { useState, useEffect, useContext } from "react";
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
  const { auth } = useContext(AuthContext);
  const hasInternalProjectPermission = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const [internalProjectDetails, setInternalProjectDetails] = useState<traineesTypes.IpInfoType | null>(null);
  const [internalProjectInfoDialogOpen, setInternalProjectInfoDialogOpen] = useState<boolean>(false);

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
            mitgliedstatus: 1,
          },
          {
            mitgliedID: 8320,
            name: "Radhika Norton",
            vorname: "vorname2",
            nachname: "nachname2",
            mitgliedstatus: 1,
          },
          {
            mitgliedID: 8478,
            name: "Kellan Mclaughlin",
            vorname: "vorname3",
            nachname: "nachname3",
            mitgliedstatus: 1,
          },
        ],
        qualitaetsmanager: [
          {
            mitgliedID: 8338,
            name: "Mariana Macdonald",
            vorname: "vorname4",
            nachname: "nachname4",
            mitgliedstatus: 3,
          },
          {
            mitgliedID: 8167,
            name: "Wolfgang U Luft",
            vorname: "vorname4",
            nachname: "nachname4",
            mitgliedstatus: 4,
          },
        ],
      };

      setInternalProjectDetails(ip);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      getInternalProjectDetails(Number(id));
    };

    fetchDetails();
  }, [id]);

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
        setInternalProjectDetails={setInternalProjectDetails}
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
