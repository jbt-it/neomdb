/**
 * The AssignTraineePreferences-Component lets admins manually add members and change the status of existing members
 */
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Paper,
  Link,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Theme,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  MenuItem,
  Modal,
} from "@mui/material";
import PageBar from "../../components/navigation/PageBar";
import { makeStyles, createStyles } from "@mui/styles";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { TraineePreference, Generation, InternalProject, TraineeAssignment, Trainee } from "../../types/traineesTypes";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import api from "../../utils/api";
import { transformSQLStringToGermanDate } from "../../utils/dateUtils";
import { Department, Mentor } from "../../types/membersTypes";

/**
 * Function which proivdes the styles of the AssignTraineePreferences
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Header text of a paper marking a section of a page
    paperHeaderText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    paperText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    // Header divider of a paper marking a section of a page
    paperHeaderDivider: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    paperContainer: {
      marginBottom: "10px",
    },
    inputContainer: {
      padding: theme.spacing(1),
    },
    selectionElement: {
      [theme.breakpoints.up("md")]: {
        margin: theme.spacing(1),
        width: "155px",
      },
      [theme.breakpoints.down("md")]: {
        margin: theme.spacing(1),
        width: "120px",
      },
      [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(1),
        width: "120px",
      },
    },
    motivationalText: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    inputButton: {
      margin: theme.spacing(1),
    },
    tableContainer: {
      maxHeight: (window.screen.height - 75) * 0.8,
    },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    attachementCell: {
      padding: "10px 8px 10px 8px",
      marginRight: "16px",
      minWidth: "16px",
    },
    tableCell: {
      padding: "16px 8px 16px 8px",
    },
    tableHeadSortBtn: {
      display: "flex",
      alignItems: "center",
    },
    linkText: {
      textDecoration: "none",
      boxShadow: "none",
    },
    motivationalTextPaper: {
      overflowY: "auto",
      position: "absolute",
      margin: "auto",
      top: "10%",
      left: "10%",
      right: "10%",
      bottom: "10%",
      width: "80%",
      display: "flex",
      justifyContent: "center",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    otherSelect: {
      minWidth: "80px",
    },
  })
);

/**
 * Options to create a new member and to change the status of members
 */
const AssignTrainees: React.FunctionComponent = () => {
  const classes = useStyles();

  const { dispatchAuth } = useContext(AuthContext);

  const [showMotivationalTexts, setShowMotivationalTexts] = useState<boolean>(false);
  const [openedTrainee, setOpenedTrainee] = useState<null | TraineePreference>(null);
  const [traineePreferences, setTraineePreferences] = useState<TraineePreference[]>([]);
  const [generation, setGeneration] = useState<Generation>();
  const [departements, setDepartements] = useState<Department[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [internalprojects, setInternalprojects] = useState<InternalProject[]>([]);

  /**
   * Retrieves all internal projects of this generation generations/{id}/internal-projects
   */
  const getInternalProjects = (generationID: number) => {
    api
      .get(`/trainees/generations/${generationID}/internal-projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setInternalprojects(res.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        showErrorMessage("Fehler beim Laden der Trainee Zuteilung");
      });
  };

  /**
   * Retrieves all internal projects of this generation generations/{id}/internal-projects
   */
  const getMentors = (generationID: number) => {
    api
      .get(`/trainees/generations/${generationID}/mentors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setMentors(res.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        showErrorMessage("Fehler beim Laden der Mentoren");
      });
  };

  /**
   * Retrieves the preferences
   */
  const getPreferences = (generationID: number) => {
    api
      .get("/trainees/generations/14/trainee-choices", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          const prefs: TraineePreference[] = res.data;
          setTraineePreferences(prefs);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        showErrorMessage("Fehler beim Laden der Trainee Zuteilung");
      });
  };

  /**
   * Retrieves the newest trainee generation
   */
  const getTraineeGeneration: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/trainees/generations?current=true", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setGeneration(res.data[0]);
            getInternalProjects(res.data[0].generationID);
            getMentors(res.data[0].generationID);
            getPreferences(res.data[0].generationID);
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        showErrorMessage("Fehler beim Laden der Trainee Zuteilung");
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  /**
   * Retrieves all departements
   */
  const getDepartements: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDepartements(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
        showErrorMessage("Fehler beim Laden der Ressorts");
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  useEffect(() => getTraineeGeneration(), [getTraineeGeneration]);
  useEffect(() => getDepartements(), [getDepartements]);

  const closeMotivationalTexts = () => {
    setShowMotivationalTexts(false);
  };

  const openMotivationalTexts = (trainee: TraineePreference) => {
    if (trainee) {
      setOpenedTrainee(trainee);
      setShowMotivationalTexts(true);
    } else {
      showErrorMessage(
        "Die Motivationstexte konnten nicht gefunden werden, bitte laden Sie die Seite neu und probieren sie es erneut."
      );
    }
  };

  const savePreference = (traineeID: number, assignment: TraineeAssignment) => {
    api
      .patch(`/trainees/${traineeID}/assignment`, assignment)
      .then((res) => {
        console.log("saved successfully");
      })
      .catch((error) => {
        showErrorMessage("Die Zuteilung konnte nicht gespeichert werden, bitte lade die Seite neu.");
      });
  };

  const changeRessortChoice = (mitgliedID: number, newValue: string) => {
    let id: number | null = null;
    if (newValue !== null) {
      id = parseInt(newValue);
    }
    setTraineePreferences((prevPreferences) => {
      const updatedPreferences = prevPreferences.map((preference) => {
        if (preference.mitgliedID === mitgliedID) {
          if (preference.wahl_ressort === id) {
            const assignment: TraineeAssignment = {
              ipID: preference.wahl_internesprojekt,
              mentorID: preference.wahl_mentor,
              departmentID: null,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_ressort: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: preference.wahl_internesprojekt,
              mentorID: preference.wahl_mentor,
              departmentID: id,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_ressort: id };
          }
        } else {
          return preference;
        }
      });
      return updatedPreferences;
    });
  };

  const changeMentorChoice = (mitgliedID: number, newValue: string) => {
    let id: number | null = null;
    if (newValue !== null) {
      id = parseInt(newValue);
    }
    setTraineePreferences((prevPreferences) => {
      const updatedPreferences = prevPreferences.map((preference) => {
        if (preference.mitgliedID === mitgliedID) {
          if (preference.wahl_mentor === id) {
            const assignment: TraineeAssignment = {
              ipID: preference.wahl_internesprojekt,
              mentorID: null,
              departmentID: preference.wahl_ressort,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_mentor: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: preference.wahl_internesprojekt,
              mentorID: id,
              departmentID: preference.wahl_ressort,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_mentor: id };
          }
        } else {
          return preference;
        }
      });
      return updatedPreferences;
    });
  };

  const changeInternesProjektChoice = (mitgliedID: number, newValue: string) => {
    let id: number | null = null;
    if (newValue !== null) {
      id = parseInt(newValue);
    }
    setTraineePreferences((prevPreferences) => {
      const updatedPreferences = prevPreferences.map((preference) => {
        if (preference.mitgliedID === mitgliedID) {
          if (preference.wahl_internesprojekt === id) {
            const assignment: TraineeAssignment = {
              ipID: null,
              mentorID: preference.wahl_mentor,
              departmentID: preference.wahl_ressort,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_internesprojekt: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: id,
              mentorID: preference.wahl_mentor,
              departmentID: preference.wahl_ressort,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, wahl_internesprojekt: id };
          }
        } else {
          return preference;
        }
      });
      return updatedPreferences;
    });
  };

  const renderMotivationalTexts = (
    <Modal open={showMotivationalTexts} onClose={closeMotivationalTexts}>
      <Paper className={classes.motivationalTextPaper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.wahl_internesprojekt1_kuerzel === null
                ? "n/a"
                : openedTrainee?.wahl_internesprojekt1_kuerzel}
            </Typography>
            <Typography className={classes.paperText}>{openedTrainee?.wahl_internesprojekt1_motivation}</Typography>
            <Divider className={classes.paperHeaderDivider} />
            <Typography variant="h5" className={classes.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.wahl_internesprojekt2_kuerzel === null
                ? "n/a"
                : openedTrainee?.wahl_internesprojekt2_kuerzel}
            </Typography>
            <Typography className={classes.paperText}>{openedTrainee?.wahl_internesprojekt2_motivation}</Typography>
            <Divider className={classes.paperHeaderDivider} />
            <Typography variant="h5" className={classes.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.wahl_internesprojekt3_kuerzel === null
                ? "n/a"
                : openedTrainee?.wahl_internesprojekt3_kuerzel}
            </Typography>
            <Typography className={classes.paperText}>{openedTrainee?.wahl_internesprojekt3_motivation}</Typography>
            <Divider className={classes.paperHeaderDivider} />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );

  const renderPreferences = (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>
              <Typography>Trainee</Typography>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Typography>Ressort</Typography>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Typography>Mentor</Typography>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Typography>Internes Projekt</Typography>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Typography></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {traineePreferences.map((trainee, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row" className={classes.tableCell}>
                <Typography color="secondary">
                  <Link
                    color="textPrimary"
                    underline="hover"
                    href={`#/gesamtuebersicht/${trainee.mitgliedID}`}
                  >{`${trainee.vorname} ${trainee.nachname}`}</Link>
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.wahl_ressort1 === null}
                    checked={trainee.wahl_ressort1 === trainee.wahl_ressort && trainee.wahl_ressort1 !== null}
                    value={trainee.wahl_ressort1 === null ? "" : trainee.wahl_ressort1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_ressort1_kuerzel === null ? "n/a" : trainee.wahl_ressort1_kuerzel}
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_ressort2 === null}
                    checked={trainee.wahl_ressort2 === trainee.wahl_ressort && trainee.wahl_ressort2 !== null}
                    value={trainee.wahl_ressort2 === null ? "" : trainee.wahl_ressort2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_ressort2_kuerzel === null ? "n/a" : trainee.wahl_ressort2_kuerzel}
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_ressort3 === null}
                    checked={trainee.wahl_ressort3 === trainee.wahl_ressort && trainee.wahl_ressort3 !== null}
                    value={trainee.wahl_ressort3 === null ? "" : trainee.wahl_ressort3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_ressort3_kuerzel === null ? "n/a" : trainee.wahl_ressort3_kuerzel}
                  />
                  <FormControlLabel
                    checked={
                      trainee.wahl_ressort !== null &&
                      trainee.wahl_ressort1 !== trainee.wahl_ressort &&
                      trainee.wahl_ressort2 !== trainee.wahl_ressort &&
                      trainee.wahl_ressort3 !== trainee.wahl_ressort
                    }
                    control={<Radio onClick={() => changeRessortChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        className={classes.otherSelect}
                        label="Andere"
                        value={
                          trainee.wahl_ressort !== null &&
                          trainee.wahl_ressort1 !== trainee.wahl_ressort &&
                          trainee.wahl_ressort2 !== trainee.wahl_ressort &&
                          trainee.wahl_ressort3 !== trainee.wahl_ressort
                            ? trainee.wahl_ressort
                            : ""
                        }
                        onChange={(event) => changeRessortChoice(trainee.mitgliedID, event.target.value.toString())}
                      >
                        {departements.map((departement) => {
                          return (
                            <MenuItem key={departement.ressortID} value={departement.ressortID}>
                              {departement.kuerzel}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.wahl_mentor1 === null}
                    checked={trainee.wahl_mentor1 === trainee.wahl_mentor && trainee.wahl_mentor1 !== null}
                    value={trainee.wahl_mentor1 === null ? "" : trainee.wahl_mentor1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_mentor1_name === null ? "n/a" : trainee.wahl_mentor1_name}
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_mentor2 === null}
                    checked={trainee.wahl_mentor2 === trainee.wahl_mentor && trainee.wahl_mentor2 !== null}
                    value={trainee.wahl_mentor2 === null ? "" : trainee.wahl_mentor2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_mentor2_name === null ? "n/a" : trainee.wahl_mentor2_name}
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_mentor3 === null}
                    checked={trainee.wahl_mentor3 === trainee.wahl_mentor && trainee.wahl_mentor3 !== null}
                    value={trainee.wahl_mentor3 === null ? "" : trainee.wahl_mentor3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.wahl_mentor3_name === null ? "n/a" : trainee.wahl_mentor3_name}
                  />
                  <FormControlLabel
                    checked={
                      trainee.wahl_mentor !== null &&
                      trainee.wahl_mentor1 !== trainee.wahl_mentor &&
                      trainee.wahl_mentor2 !== trainee.wahl_mentor &&
                      trainee.wahl_mentor3 !== trainee.wahl_mentor
                    }
                    control={<Radio onClick={() => changeMentorChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        className={classes.otherSelect}
                        label="Andere"
                        value={
                          trainee.wahl_mentor !== null &&
                          trainee.wahl_mentor1 !== trainee.wahl_mentor &&
                          trainee.wahl_mentor2 !== trainee.wahl_mentor &&
                          trainee.wahl_mentor3 !== trainee.wahl_mentor
                            ? trainee.wahl_mentor
                            : ""
                        }
                        onChange={(event) => changeMentorChoice(trainee.mitgliedID, event.target.value.toString())}
                      >
                        {mentors.map((mentor) => {
                          if (mentor.mitgliedID) {
                            return (
                              <MenuItem key={mentor.mitgliedID} value={mentor.mitgliedID}>
                                {mentor.name}
                              </MenuItem>
                            );
                          }
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.wahl_internesprojekt1 === null}
                    checked={
                      trainee.wahl_internesprojekt1 === trainee.wahl_internesprojekt &&
                      trainee.wahl_internesprojekt1 !== null
                    }
                    value={trainee.wahl_internesprojekt1 === null ? "" : trainee.wahl_internesprojekt1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.wahl_internesprojekt1_kuerzel === null ? "n/a" : trainee.wahl_internesprojekt1_kuerzel
                    }
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_internesprojekt2 === null}
                    checked={
                      trainee.wahl_internesprojekt2 === trainee.wahl_internesprojekt &&
                      trainee.wahl_internesprojekt2 !== null
                    }
                    value={trainee.wahl_internesprojekt2 === null ? "" : trainee.wahl_internesprojekt2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.wahl_internesprojekt2_kuerzel === null ? "n/a" : trainee.wahl_internesprojekt2_kuerzel
                    }
                  />
                  <FormControlLabel
                    disabled={trainee.wahl_internesprojekt3 === null}
                    checked={
                      trainee.wahl_internesprojekt3 === trainee.wahl_internesprojekt &&
                      trainee.wahl_internesprojekt3 !== null
                    }
                    value={trainee.wahl_internesprojekt3 === null ? "" : trainee.wahl_internesprojekt3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.wahl_internesprojekt3_kuerzel === null ? "n/a" : trainee.wahl_internesprojekt3_kuerzel
                    }
                  />
                  <FormControlLabel
                    checked={
                      trainee.wahl_internesprojekt !== null &&
                      trainee.wahl_internesprojekt1 !== trainee.wahl_internesprojekt &&
                      trainee.wahl_internesprojekt2 !== trainee.wahl_internesprojekt &&
                      trainee.wahl_internesprojekt3 !== trainee.wahl_internesprojekt
                    }
                    control={<Radio onClick={() => changeInternesProjektChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        className={classes.otherSelect}
                        label="Andere"
                        value={
                          trainee.wahl_internesprojekt !== null &&
                          trainee.wahl_internesprojekt1 !== trainee.wahl_internesprojekt &&
                          trainee.wahl_internesprojekt2 !== trainee.wahl_internesprojekt &&
                          trainee.wahl_internesprojekt3 !== trainee.wahl_internesprojekt
                            ? trainee.wahl_internesprojekt
                            : ""
                        }
                        onChange={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, event.target.value.toString())
                        }
                      >
                        {internalprojects.map((project) => {
                          return (
                            <MenuItem key={project.internesProjektID} value={project.internesProjektID}>
                              {project.kuerzel}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell className={classes.attachementCell}>
                <Button
                  className={classes.attachementCell}
                  onClick={() => {
                    openMotivationalTexts(trainee);
                  }}
                >
                  <AttachFileSharpIcon></AttachFileSharpIcon>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <div className="content-page">
        {renderMotivationalTexts}
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.paperHeaderText}>
                Trainee-Zuteilung {generation?.bezeichnung}
              </Typography>
              <Typography className={classes.paperText}>
                Hier können die Präferenzen für die Wahl von Ressort, Mentor und Internem Projekt der Trainees zugeteilt
                werden.<br></br>
                Die Daten werden bei Änderung automatisch zwischengespeichert.<br></br>
                Sobald eine neue Traineegeneration angelegt wird, können die Zuteilungen nicht mehr geändert werden.
                <br></br>
                Startdatum Präferenzwahlen:{" "}
                <b>{generation ? transformSQLStringToGermanDate(generation.wahl_start.toString()) : ""}</b>
                <br></br>
                Enddatum Präferenzwahlen:{" "}
                <b>{generation ? transformSQLStringToGermanDate(generation.wahl_ende.toString()) : ""}</b>
                <br></br>
              </Typography>
              <Divider className={classes.paperHeaderDivider} />
              {renderPreferences}
            </Grid>
          </Grid>
        </Paper>
      </div>
      <PageBar pageTitle="Trainee-Zuteilung" />
    </div>
  );
};

export default AssignTrainees;
