/**
 * Component for resetting the password by the user without the help of a admin, when logged in
 *
 */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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
  styled,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Edit } from "@mui/icons-material";
import * as traineesTypes from "./traineesTypes";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import api from "../../utils/api";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import FieldSection, { Field } from "../../components/general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { transformDateToReadableString } from "../../utils/dateUtils";
import InfoSection, { InformationField } from "../../components/general/InfoSection";
import MemberSelection from "../../components/general/MemberSelection";
import { MembersField } from "../../types/membersTypes";
import LoadingCircle from "../../components/general/LoadingCircle";

/**
 * Function which provides the styles
 */

const styles = {
  dialog: {
    margin: "auto",
  },
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: "auto",
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "80%",
}));

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 1),
    color: "white",
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
  projectMembers: {
    flexGrow: 1,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

/**
 * Function that allows displays internal project details
 * @returns returns the interface for the user
 */
const InternalProject: React.FunctionComponent = () => {
  const classes = useStyles();
  const id = useParams();

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
  const [projektmitglieder, setProjektmitglieder] = useState<MembersField[]>([]);
  const [qualitaetsmanager, setQualitaetsmanager] = useState<MembersField[]>([]);
  const [selectableMembers, setSelectableMembers] = useState<MembersField[]>([]);
  const [selectableQMs, setSelectableQMs] = useState<MembersField[]>([]);

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

  const getSelectableMembers: VoidFunction = () => {
    //api call for current trainees
    setSelectableMembers([
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
      {
        mitgliedID: 8331,
        name: "Jorja Bautista",
        vorname: "Jorja",
        nachname: "Bautista",
        mitgliedstatus: 1,
      },
      { mitgliedID: 8748, name: "Mason Vinson", vorname: "Mason", nachname: "Vinson", mitgliedstatus: 2 },
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
    ]);
  };
  const getSelectableQms: VoidFunction = () => {
    //api call for current trainees
    setSelectableQMs([
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
      { mitgliedID: 8748, name: "Mason Vinson", vorname: "Mason", nachname: "Vinson", mitgliedstatus: 2 },
    ]);
  };
  useEffect(getSelectableMembers, []);
  useEffect(getSelectableQms, []);
  useEffect(getInternalProjectDetails, []);

  const updateInternalProjectDetails = () => {
    setInternalProjectInfoDialogOpen(false);
    const data = internalProjectDetails
      ? {
          id: internalProjectDetails?.id,
          name,
          kuerzel,
          traineegeneration,
          kickoff,
          angebotAbgegeben,
          apAbgegeben,
          apDatum,
          zpDatum,
          dlAbgegeben,
          zpAbgegeben,
          projektmitglieder,
          qualitaetsmanager,
        }
      : null;
    console.log(data?.projektmitglieder);
    internalProjectDetails ? setInternalProjectDetails(data) : null;
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

  const onChangeTraineegeneration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTraineegeneration(event.target.value);
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

  const handleMemberSelection = (event: React.SyntheticEvent, value: MembersField | null, reason: string) => {
    event.persist();
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedMembers = [...projektmitglieder];
      updatedMembers[index] = value;
      setProjektmitglieder(updatedMembers);
    }
  };

  const addMember = () => {
    setProjektmitglieder((prev) => [...prev, [] as unknown as MembersField]);
  };

  const removeMember = (mitgliedID: number) => {
    const updatedMembers = projektmitglieder.filter((member) => member.mitgliedID !== mitgliedID);
    setProjektmitglieder(updatedMembers);
  };

  const handleQMSelection = (event: React.SyntheticEvent, value: MembersField | null, reason: string) => {
    const index = Number(event.currentTarget.id.split("-")[1]);
    if (value !== null) {
      const updatedQMs = [...qualitaetsmanager];
      updatedQMs[index] = value;
      setQualitaetsmanager(updatedQMs);
    }
  };

  const addQM = () => {
    setQualitaetsmanager((prev) => [...prev, [] as unknown as MembersField]);
  };

  const removeQM = (mitgliedID: number) => {
    const updatedQMs = qualitaetsmanager.filter((member) => member.mitgliedID !== mitgliedID);
    setQualitaetsmanager(updatedQMs);
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
      onChangeCallback: onChangeTraineegeneration,
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
      state: zpAbgegeben,
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
      value: internalProjectDetails?.kickoff ? transformDateToReadableString(internalProjectDetails?.kickoff) : "",
      type: "text",
    },
    {
      label: "Angebot abgegeben",
      value: internalProjectDetails?.angebotAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "AP abgegeben",
      value: internalProjectDetails?.apAbgegeben ? true : false,
      type: "checkbox",
    },
    {
      label: "AP Datum",
      value: internalProjectDetails?.apDatum ? transformDateToReadableString(internalProjectDetails?.apDatum) : "",
      type: "text",
    },
    {
      label: "ZP Datum",
      value: internalProjectDetails?.zpDatum ? transformDateToReadableString(internalProjectDetails?.zpDatum) : "",
      type: "text",
    },
    {
      label: "ZP abgegeben",
      value: internalProjectDetails?.zpAbgegeben ? true : false,
      type: "checkbox",
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
      <Dialog
        sx={styles.dialog}
        open={internalProjectInfoDialogOpen}
        onClose={handleInternalProjectInfoDialogClose}
        aria-labelledby="general-dialog-title"
      >
        <DialogTitle>{internalProjectDetails.name} bearbeiten</DialogTitle>
        <DialogContent dividers={true}>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Details"} fields={InternalProjectDialogFields}></FieldSection>
          </div>
          <div className={classes.fieldSectionBox}>
            <FieldSection title={"Dokumente"} fields={FieldDocuments}></FieldSection>
          </div>
          <div className={`${classes.fieldSectionBox} ${classes.projectMembers}`}>
            <Typography variant="subtitle1">Projektmitglieder</Typography>
            <MemberSelection
              selectedMembers={projektmitglieder}
              addMember={addMember}
              onChangeCallback={handleMemberSelection}
              removeMember={removeMember}
              allMembers={selectableMembers}
              mitgliedstatus={[1]}
            ></MemberSelection>
          </div>
          <div className={`${classes.fieldSectionBox} ${classes.projectMembers}`}>
            <Typography variant="subtitle1">Qualitätsmanager</Typography>
            <MemberSelection
              selectedMembers={qualitaetsmanager}
              addMember={addQM}
              removeMember={removeQM}
              onChangeCallback={handleQMSelection}
              allMembers={selectableQMs}
            ></MemberSelection>
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
              <Typography variant="h6">
                <strong>Informationen zum internen Projekt</strong>
              </Typography>
              {doesPermissionsHaveSomeOf(auth.permissions, [15]) ? (
                <IconButton onClick={(event) => handleInternalProjectInfoDialogOpen(event)}>
                  <Edit fontSize="inherit" />
                </IconButton>
              ) : null}
            </Box>
            <Box>
              <InfoSection fields={internalProjectDetailsFields} />
            </Box>
          </StyledPaper>
        </Box>
      </div>
    </div>
  ) : (
    <LoadingCircle />
  );
};

export default InternalProject;
