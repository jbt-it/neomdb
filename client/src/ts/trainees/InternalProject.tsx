/**
 * Component for resetting the password by the user without the help of a admin, when logged in
 *
 */
import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button, Dialog, Paper, Typography, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Edit } from "@mui/icons-material";
import * as traineesTypes from "./traineesTypes";
import { InternalProjectInformationDialog } from "./InternalProjectInformationDialog";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";
import { Detail } from "../global/components/DetailComponent";
import { AuthContext } from "../global/AuthContext";
import api from "../utils/api";
import { showErrorMessage, showSuccessMessage } from "../utils/toastUtils";
import { authReducerActionType } from "../global/globalTypes";
import FieldSection, { Field } from "../global/components/FieldSection";
import dayjs from "dayjs";

/**
 * Function which provides the styles
 */
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
  const [internalProjectDetails, setInternalProjectDetails] = useState<traineesTypes.IpInfoType>({
    id: 0,
    name: "",
    kuerzel: "",
    traineegeneration: "",
    kickoff: "",
    angebotAbgegeben: "",
    apDatum: new Date(),
    apAbgegeben: "",
    zpDatum: "",
    zpAbgegeben: "",
    dlAbgegeben: "",
    projektmitglieder: "",
    qualitaetsmanager: "",
  });

  const [name, setName] = useState<string>("");
  const [kuerzel, setKuerzel] = useState<string>("");
  const [traineegeneration, setTraineegeneration] = useState<string>("");
  const [kickoff, setKickoff] = useState<string>("");
  const [angebotAbgegeben, setAngebotAbgegeben] = useState<string>("");
  const [apDatum, setApDatum] = useState<Date>();
  const [apAbgegeben, setApAbgegeben] = useState<string>("");
  const [zpDatum, setZpDatum] = useState<string>("");
  const [zpAbgegeben, setZpAbgegeben] = useState<string>("");
  const [dlAbgegeben, setDlAbgegeben] = useState<string>("");
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
   */
  const handleInternalProjectInfoDialogClose: VoidFunction = () => {
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
      kickoff: "01.01.2020",
      angebotAbgegeben: "Ja",
      apDatum: new Date("2022-03-25"),
      apAbgegeben: "Ja",
      zpDatum: "01.01.2020",
      zpAbgegeben: "Ja",
      dlAbgegeben: "Nein",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalProjectDetails({
      ...internalProjectDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeApDatum = (value: unknown) => {
    setApDatum(value as Date);
  };

  const InternalProjectDialogFields: Array<Field> = [
    {
      label: "Name",
      state: name,
      width: "half",
      onChangeCallback: onChangeName,
      type: "Text",
    },
    { label: "Kürzel", state: kuerzel, width: "half", onChangeCallback: handleChange, type: "Text" },
    {
      label: "Traineegeneration",
      state: traineegeneration,
      width: "half",
      onChangeCallback: handleChange,
      type: "Text",
    },

    { label: "Kickoff", state: kickoff, width: "half", onChangeCallback: handleChange, type: "Text" },
    {
      label: "Angebot abgegeben",
      state: angebotAbgegeben,
      width: "half",
      onChangeCallback: handleChange,
      type: "Text",
    },
    { label: "AP abgegeben", state: apAbgegeben, width: "half", onChangeCallback: handleChange, type: "Text" },
    {
      label: "AP Datum",
      state: dayjs(apDatum),
      width: "half",
      onChangeCallback: onChangeApDatum,
      type: "Date",
    },
    { label: "ZP Datum", state: zpDatum, width: "half", onChangeCallback: handleChange, type: "Text" },
    { label: "DL abgegeben", state: dlAbgegeben, width: "half", onChangeCallback: handleChange, type: "Text" },
    {
      label: "Projektmitglieder",
      state: projektmitglieder,
      width: "half",
      onChangeCallback: handleChange,
      type: "Text",
    },
    {
      label: "Qualitätsmanager",
      state: qualitaetsmanager,
      width: "half",
      onChangeCallback: handleChange,
      type: "Text",
    },
  ];

  /*
   * Returns the internal project details if the retrieval of the internal project was successful (internalProjectDetails is not null or undefined)
   */
  return internalProjectDetails ? (
    <div>
      {/* TODO: The default values (meaning the values sent from the backend) should also be given to the dialog, because canceling the editing should probably reset the states - low priority*/}
      {/* <InternalProjectInformationDialog
        name={name}
        kuerzel={kuerzel}
        traineegeneration={traineegeneration}
        kickoff={kickoff}
        angebotAbgegeben={angebotAbgegeben}
        apAbgegeben={apAbgegeben}
        apDatum={apDatum}
        zpDatum={zpDatum}
        projektmitglieder={projektmitglieder}
        dlAbgegeben={dlAbgegeben}
        zpAbgegeben={zpAbgegeben}
        qualitaetsmanager={qualitaetsmanager}
        internalProjectInfoDialogOpen={internalProjectInfoDialogOpen}
        handleInternalProjectInfoDialogClose={handleInternalProjectInfoDialogClose}
        setName={setName}
        setKuerzel={setKuerzel}
        setTraineegeneration={setTraineegeneration}
        setKickoff={setKickoff}
        setAngebotAbgegeben={setAngebotAbgegeben}
        setApDatum={setApDatum}
        setApAbgegeben={setApAbgegeben}
        setZpDatum={setZpDatum}
        setZpAbgegeben={setZpAbgegeben}
        setDlAbgegeben={setDlAbgegeben}
        setProjektmitglieder={setProjektmitglieder}
        setQualitaetsmanager={setQualitaetsmanager}
        updateInternalProjectDetails={updateInternalProjectDetails}
      /> */}
      <Dialog
        className={"content-page"}
        open={internalProjectInfoDialogOpen}
        onClose={handleInternalProjectInfoDialogClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="general-dialog-title"
      >
        <FieldSection title={"InternalProjectDialogSection"} fields={InternalProjectDialogFields}></FieldSection>
      </Dialog>

      <div className="content-page">
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
            <Detail name={"Name"} value={internalProjectDetails.name} />
            <Detail name={"Kürzel"} value={internalProjectDetails.kuerzel} />
            <Detail name={"Traineegeneration"} value={internalProjectDetails.traineegeneration} />
            <Detail name={"Kick-Off"} value={internalProjectDetails.kickoff} />
            <Detail name={"Angebot abgegeben"} value={internalProjectDetails.angebotAbgegeben} />
            <Detail name={"AP abgegeben"} value={internalProjectDetails.apAbgegeben} />
            {/* <Detail name={"AP Datum"} value={internalProjectDetails.apDatum} /> */}
            <Detail name={"ZP abgegeben"} value={internalProjectDetails.zpAbgegeben} />
            <Detail name={"DL abgegeben"} value={internalProjectDetails.dlAbgegeben} />
            <Detail name={"Projektmitglieder"} value={internalProjectDetails.projektmitglieder} />
            <Detail name={"Qualitätsmanager"} value={internalProjectDetails.qualitaetsmanager} />
          </div>
          <div className={classes.categoryHeader}>
            <div>
              <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                E-Mail an alle Projektmitglieder
              </Button>
            </div>
            <div>
              <Button className={classes.submit} variant="contained" fullWidth color="primary" type="submit">
                E-Mail an alle Projektmitglieder und QMs
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  ) : null; // TODO: Instead of returning null, a loading spinner should be displayed
};

export default InternalProject;
