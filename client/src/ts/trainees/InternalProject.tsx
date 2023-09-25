/**
 * Component for resetting the password by the user without the help of a admin, when logged in
 *
 */
import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Dialog,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Edit } from "@mui/icons-material";
import * as traineesTypes from "./traineesTypes";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";
import { Detail } from "../global/components/DetailComponent";
import { AuthContext } from "../global/AuthContext";
import api from "../utils/api";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";
import { authReducerActionType } from "../global/globalTypes";
import FieldSection, { Field } from "../global/components/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { transformDateToReadableString } from "../utils/dateUtils";

/**
 * Function which provides the styles
 */

const styles = {
  dialog: {
    // width: "60%",
    margin: "auto",
  },
};

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 1),
    color: "white",
  },
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  category: {
    color: theme.palette.text.secondary,
    width: "100%",
  },
  categoryHeader: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryTitle: {
    textAlign: "center",
  },
  categoryLine: {
    paddingTop: "12.5px",
    paddingBottom: "11.5px",
    textAlign: "right",
  },

  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      width: "30%",
    },
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "60%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  categoryItemList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "right",
  },

  fieldSectionBox: {
    margin: theme.spacing(1),
  },
  button: {
    padding: "6px 12px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    margin: "4px 2px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "black",
    border: "none",
  },
  fullWidth: {
    width: "100%",
  },

  submitContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  cancelButton: {
    margin: theme.spacing(1, 1, 1, 1),
  },
  submitButton: {
    margin: theme.spacing(1, 0, 1, 1),
    color: "white",
  },
}));

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

/**
 * Function that allows displays internal project details
 * @returns returns the interface for the user
 */
const InternalProject: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (
  props: RouteComponentProps<RouterMatch>
) => {
  const classes = useStyles();

  const { auth } = useContext(AuthContext);

  // internalProjectDetails will be used later when the API call is implemented
  const [internalProjectDetails, setInternalProjectDetails] = useState<traineesTypes.IpInfoType | null>(null);

  const [name, setName] = useState<string>("");
  const [kuerzel, setKuerzel] = useState<string>("");
  const [traineegeneration, setTraineegeneration] = useState<string>("");
  const [kickoff, setKickoff] = useState<Date>();
  const [angebotAbgegeben, setAngebotAbgegeben] = useState<boolean>();
  const [apDatum, setApDatum] = useState<Date>();
  const [apAbgegeben, setApAbgegeben] = useState<boolean>();
  const [zpDatum, setZpDatum] = useState<Date>();
  const [zpAbgegeben, setZpAbgegeben] = useState<boolean>();
  const [dlAbgegeben, setDlAbgegeben] = useState<boolean>();
  const [projektmitglieder, setProjektmitglieder] = useState<string>("");
  const [qualitaetsmanager, setQualitaetsmanager] = useState<string>("");

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
   * Handles the closing of the internal project information dialog
   * @param event FormEvent
   * TODO: Default-Werte wiederherstellen
   */
  const handleInternalProjectInfoDialogClose: VoidFunction = () => {
    setName(internalProjectDetails!.name);
    setKuerzel(internalProjectDetails!.kuerzel);
    setTraineegeneration(internalProjectDetails!.traineegeneration);
    setKickoff(internalProjectDetails!.kickoff);
    setAngebotAbgegeben(internalProjectDetails!.angebotAbgegeben);
    setApDatum(internalProjectDetails!.apDatum);
    setApAbgegeben(internalProjectDetails!.apAbgegeben);
    setZpDatum(internalProjectDetails!.zpDatum);
    setZpAbgegeben(internalProjectDetails!.zpAbgegeben);
    setDlAbgegeben(internalProjectDetails!.dlAbgegeben);
    setProjektmitglieder(internalProjectDetails!.projektmitglieder);
    setQualitaetsmanager(internalProjectDetails!.qualitaetsmanager);
    setInternalProjectInfoDialogOpen(false);
  };
  /**
   * Retrieves dummy member details
   */
  const getInternalProjectDetails: VoidFunction = () => {
    /* TO-DO: Implement API call to retrieve internal project details
     *  setInternalProjectDetails(ip);
     *  setName(InternalProjectDetails?.name);
     */

    const ip = {
      id: 5,
      name: "Analoges Bootcamp",
      kuerzel: "DB",
      traineegeneration: "22/WS",
      kickoff: new Date("2020-01-01"),
      angebotAbgegeben: false,
      apDatum: new Date("2022-03-25"),
      apAbgegeben: false,
      zpDatum: new Date("2020-01-01"),
      zpAbgegeben: true,
      dlAbgegeben: false,
      projektmitglieder: "Marko Müller, Ada Lovelace",
      qualitaetsmanager: "Nils Weiß, Michael Lang, Max Nagel",
    };
    console.log("apDatum: " + apDatum);

    setInternalProjectDetails(ip);
    setName(ip?.name);
    setKuerzel(ip?.kuerzel);
    setTraineegeneration(ip?.traineegeneration);
    setKickoff(ip?.kickoff);
    setAngebotAbgegeben(ip?.angebotAbgegeben);
    setApDatum(ip?.apDatum);
    setApAbgegeben(ip?.apAbgegeben);
    setZpDatum(ip?.zpDatum);
    setZpAbgegeben(ip?.zpAbgegeben);
    setDlAbgegeben(ip?.dlAbgegeben);
    setProjektmitglieder(ip?.projektmitglieder);
    setQualitaetsmanager(ip?.qualitaetsmanager);
  };

  useEffect(getInternalProjectDetails, []);

  const updateInternalProjectDetails = () => {
    const data = {
      name,
      kuerzel,
      traineegeneration,
      kickoff,
      angebotAbgegeben,
      apAbgegeben,
      apDatum,
      zpDatum,
      projektmitglieder,
      dlAbgegeben,
      zpAbgegeben,
      qualitaetsmanager,
    };
    // Variable for checking, if the component is mounted
    let mounted = true;
    console.log(data);
    /*
    *
    * Here will be the api call for storing the changed data in the database, currently the api call for the members page is here as a placeholder since the required function is not implemented yet
    * Check if data is stored correctly in database after api is implemented
    * 
    api
      .patch(`/users/${props.match.params.id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res: any) => {
        if (res.status === 200) {
          if (mounted) {
            showSuccessMessage("Aktualisierung des Profils war erfolgreich!");
            getInternalProjectDetails();
          }
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response.status === 500) {
          showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        }
      });
      */

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeKuerzel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKuerzel(event.target.value);
  };

  const onChangeKickoff = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
    setKickoff(dateValue);
  };

  const onChangeApDatum = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
    setApDatum(dateValue);
  };

  const onChangeZpDatum = (value: unknown) => {
    const dateValue = (value as Dayjs).toDate();
    setZpDatum(dateValue);
  };

  const onChangeAngebotAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAngebotAbgegeben(event.target.checked);
  };

  const onChangeApAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApAbgegeben(event.target.checked);
  };

  const onChangeZpAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZpAbgegeben(event.target.checked);
  };

  const onChangeDlAbgegeben = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDlAbgegeben(event.target.checked);
  };

  const InternalProjectDialogFields: Array<Field> = [
    {
      label: "Name",
      state: name,
      width: "half",
      onChangeCallback: onChangeName,
      type: "Text",
    },
    { label: "Kürzel", state: kuerzel, width: "half", onChangeCallback: onChangeKuerzel, type: "Text" },
    {
      label: "Traineegeneration",
      state: traineegeneration,
      width: "full",
      onChangeCallback: onChangeName,
      type: "Text",
    },
    { label: "Kickoff", state: dayjs(kickoff), width: "full", onChangeCallback: onChangeKickoff, type: "Date" },
    {
      label: "AP Datum",
      state: dayjs(apDatum),
      width: "full",
      onChangeCallback: onChangeApDatum,
      type: "Date",
    },
    { label: "ZP Datum", state: dayjs(zpDatum), width: "full", onChangeCallback: onChangeZpDatum, type: "Date" },
  ];

  const FieldDocuments: Array<Field> = [
    {
      label: "Angebot abgegeben",
      state: angebotAbgegeben,
      width: "full",
      onChangeCallback: onChangeAngebotAbgegeben,
      type: "Checkbox",
    },
    {
      label: "AP abgegeben",
      state: apAbgegeben,
      width: "full",
      onChangeCallback: onChangeApAbgegeben,
      type: "Checkbox",
    },
    {
      label: "ZP abgegeben",
      state: dlAbgegeben,
      width: "full",
      onChangeCallback: onChangeZpAbgegeben,
      type: "Checkbox",
    },
    {
      label: "DL abgegeben",
      state: dlAbgegeben,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Checkbox",
    },
  ];

  const InternalProjectMembers: Array<Field> = [
    {
      label: "Projektmitglieder",
      state: projektmitglieder,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Text",
    },
    {
      label: "Qualitätsmanager",
      state: qualitaetsmanager,
      width: "full",
      onChangeCallback: onChangeDlAbgegeben,
      type: "Text",
    },
  ];

  /*
   * Returns the internal project details if the retrieval of the internal project was successful (internalProjectDetails is not null or undefined)
   */
  return internalProjectDetails ? (
    <div>
      <Dialog
        sx={styles.dialog}
        open={internalProjectInfoDialogOpen}
        onClose={handleInternalProjectInfoDialogClose}
        aria-labelledby="general-dialog-title"
      >
        <DialogTitle>Internes Projekt bearbeiten</DialogTitle>
        <DialogContent dividers={true}>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Details"} fields={InternalProjectDialogFields}></FieldSection>
          </div>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Dokumente"} fields={FieldDocuments}></FieldSection>
          </div>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Mitglieder"} fields={InternalProjectMembers}></FieldSection>
          </div>
        </DialogContent>
        <DialogActions>
          {/* TODO: State bei Abbrechen zurücksetzen */}
          <Button
            className={classes.cancelButton}
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleInternalProjectInfoDialogClose}
          >
            Abbrechen
          </Button>
          <Button
            className={classes.submitButton}
            variant="contained"
            fullWidth
            color="primary"
            onClick={updateInternalProjectDetails}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <div className="content-page">
        <Box sx={{ margin: "auto" }}>
          <Paper className={classes.paper}>
            <div className={classes.categoryHeader}>
              <div>
                <Typography variant="h6">
                  <strong>Informationen zum internen Projekt</strong>
                </Typography>
              </div>
              <div>
                {doesPermissionsHaveSomeOf(auth.permissions, [15]) ? (
                  <IconButton onClick={(event) => handleInternalProjectInfoDialogOpen(event)}>
                    <Edit fontSize="inherit" />
                  </IconButton>
                ) : null}
              </div>
            </div>
            <div className={classes.category}>
              <Box
                sx={{
                  display: "grid",
                  columnGap: 3,
                  rowGap: 1,
                  gridTemplateColumns: "repeat(1, 1fr)",
                }}
              >
                <Detail name={"Name"} value={internalProjectDetails.name} />
                <Detail name={"Kürzel"} value={internalProjectDetails.kuerzel} />
                <Detail name={"Traineegeneration"} value={traineegeneration} />
                <Detail
                  name={"Kick-Off"}
                  value={
                    internalProjectDetails.kickoff ? transformDateToReadableString(internalProjectDetails.kickoff) : ""
                  }
                />
                <Detail name={"Angebot abgegeben"} value={internalProjectDetails.angebotAbgegeben ? "Ja" : "Nein"} />
                <Detail name={"AP abgegeben"} value={internalProjectDetails.apAbgegeben ? "Ja" : "Nein"} />
                <Detail
                  name={"AP Datum"}
                  value={
                    internalProjectDetails.apDatum ? transformDateToReadableString(internalProjectDetails.apDatum) : ""
                  }
                />
                <Detail
                  name={"ZP Datum"}
                  value={
                    internalProjectDetails.zpDatum ? transformDateToReadableString(internalProjectDetails.zpDatum) : ""
                  }
                />
                <Detail name={"ZP abgegeben"} value={internalProjectDetails.zpAbgegeben ? "Ja" : "Nein"} />
                <Detail name={"DL abgegeben"} value={internalProjectDetails.dlAbgegeben ? "Ja" : "Nein"} />
                <Detail name={"Projektmitglieder"} value={internalProjectDetails.projektmitglieder} />
                <Detail name={"Qualitätsmanager"} value={internalProjectDetails.qualitaetsmanager} />
              </Box>
            </div>
          </Paper>
        </Box>
      </div>
    </div>
  ) : null; // TODO: Instead of returning null, a loading spinner should be displayed
};

export default InternalProject;
