/**
 * The AssignTraineePreferences-Component lets admins manually add members and change the status of existing members
 */
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  MenuItem,
  Link,
  Modal,
  useTheme,
} from "@mui/material";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { TraineePreference, Generation, InternalProject, TraineeAssignment, Trainee } from "../../types/traineesTypes";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import api from "../../utils/api";
import { transformSQLStringToGermanDate } from "../../utils/dateUtils";
import { DepartmentPartialDto, MentorDto } from "../../types/membersTypes";

/**
 * Options to create a new member and to change the status of members
 */
const AssignTrainees: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the AssignTraineePreferences
   */
  const styles = {
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
      color: "black",
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
  };

  const { dispatchAuth } = useContext(AuthContext);

  const [showMotivationalTexts, setShowMotivationalTexts] = useState<boolean>(false);
  const [openedTrainee, setOpenedTrainee] = useState<null | TraineePreference>(null);
  const [traineePreferences, setTraineePreferences] = useState<TraineePreference[]>([]);
  const [generation, setGeneration] = useState<Generation>();
  const [departements, setDepartements] = useState<DepartmentPartialDto[]>([]);
  const [mentors, setMentors] = useState<MentorDto[]>([]);
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
        } else if (err.response && err.response.status === 404) {
          showErrorMessage("Es wurde keine aktuelle Traineegeneration gefunden");
        }
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
      .get(`/trainees/generations/${generationID}/trainee-choices`, {
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
      .get("/trainees/generations/current", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (mounted) {
            setGeneration(res.data);
            getInternalProjects(res.data.generationId);
            getMentors(res.data.generationId);
            getPreferences(res.data.generationId);
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
          showErrorMessage("Fehler beim Laden der Trainee Zuteilung");
        } else if (err.response && err.response.status === 404) {
          showErrorMessage("Es gibt keine aktuelle Traineegeneration zur Zuteilung");
        }
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
          if (preference.departmentChoice === id) {
            const assignment: TraineeAssignment = {
              ipID: preference.internalProjectChoice,
              mentorID: preference.mentorChoice,
              departmentID: null,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, departmentChoice: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: preference.internalProjectChoice,
              mentorID: preference.mentorChoice,
              departmentID: id,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, departmentChoice: id };
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
          if (preference.mentorChoice === id) {
            const assignment: TraineeAssignment = {
              ipID: preference.internalProjectChoice,
              mentorID: null,
              departmentID: preference.departmentChoice,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, mentorChoice: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: preference.internalProjectChoice,
              mentorID: id,
              departmentID: preference.departmentChoice,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, mentorChoice: id };
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
          if (preference.internalProjectChoice === id) {
            const assignment: TraineeAssignment = {
              ipID: null,
              mentorID: preference.mentorChoice,
              departmentID: preference.departmentChoice,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, internalProjectChoice: null };
          } else {
            const assignment: TraineeAssignment = {
              ipID: id,
              mentorID: preference.mentorChoice,
              departmentID: preference.departmentChoice,
            };
            savePreference(preference.mitgliedID, assignment);
            return { ...preference, internalProjectChoice: id };
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
      <Paper sx={styles.motivationalTextPaper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.internalProjectChoice1ShortName === null
                ? "n/a"
                : openedTrainee?.internalProjectChoice1ShortName}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.internalProjectChoice1Motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.internalProjectChoice2ShortName === null
                ? "n/a"
                : openedTrainee?.internalProjectChoice2ShortName}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.internalProjectChoice2Motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Motivation für{" "}
              {openedTrainee?.internalProjectChoice3ShortName === null
                ? "n/a"
                : openedTrainee?.internalProjectChoice3ShortName}
            </Typography>
            <Typography sx={styles.paperText}>{openedTrainee?.internalProjectChoice3Motivation}</Typography>
            <Divider sx={styles.paperHeaderDivider} />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );

  const renderPreferences = (
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Trainee</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Ressort</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Mentor</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography>Internes Projekt</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {traineePreferences.map((trainee, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row" sx={styles.tableCell}>
                <Typography color="secondary">
                  <Link
                    href={`/gesamtuebersicht/${trainee.mitgliedID}`}
                    style={styles.linkText}
                  >{`${trainee.vorname} ${trainee.nachname}`}</Link>
                </Typography>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.departmentChoice1 === null}
                    checked={
                      trainee.departmentChoice1 === trainee.departmentChoice && trainee.departmentChoice1 !== null
                    }
                    value={trainee.departmentChoice1 === null ? "" : trainee.departmentChoice1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.departmentChoice1ShortName === null ? "n/a" : trainee.departmentChoice1ShortName}
                  />
                  <FormControlLabel
                    disabled={trainee.departmentChoice2 === null}
                    checked={
                      trainee.departmentChoice2 === trainee.departmentChoice && trainee.departmentChoice2 !== null
                    }
                    value={trainee.departmentChoice2 === null ? "" : trainee.departmentChoice2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.departmentChoice2ShortName === null ? "n/a" : trainee.departmentChoice2ShortName}
                  />
                  <FormControlLabel
                    disabled={trainee.departmentChoice3 === null}
                    checked={
                      trainee.departmentChoice3 === trainee.departmentChoice && trainee.departmentChoice3 !== null
                    }
                    value={trainee.departmentChoice3 === null ? "" : trainee.departmentChoice3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeRessortChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.departmentChoice3ShortName === null ? "n/a" : trainee.departmentChoice3ShortName}
                  />
                  <FormControlLabel
                    checked={
                      trainee.departmentChoice !== null &&
                      trainee.departmentChoice1 !== trainee.departmentChoice &&
                      trainee.departmentChoice2 !== trainee.departmentChoice &&
                      trainee.departmentChoice3 !== trainee.departmentChoice
                    }
                    control={<Radio onClick={() => changeRessortChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        sx={styles.otherSelect}
                        label="Andere"
                        value={
                          trainee.departmentChoice !== null &&
                          trainee.departmentChoice1 !== trainee.departmentChoice &&
                          trainee.departmentChoice2 !== trainee.departmentChoice &&
                          trainee.departmentChoice3 !== trainee.departmentChoice
                            ? trainee.departmentChoice
                            : ""
                        }
                        onChange={(event) => changeRessortChoice(trainee.mitgliedID, event.target.value.toString())}
                      >
                        {departements.map((departement) => {
                          return (
                            <MenuItem key={departement.departmentId} value={departement.departmentId}>
                              {departement.shortName}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.mentorChoice1 === null}
                    checked={trainee.mentorChoice1 === trainee.mentorChoice && trainee.mentorChoice1 !== null}
                    value={trainee.mentorChoice1 === null ? "" : trainee.mentorChoice1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.mentorChoice1Name === null ? "n/a" : trainee.mentorChoice1Name}
                  />
                  <FormControlLabel
                    disabled={trainee.mentorChoice2 === null}
                    checked={trainee.mentorChoice2 === trainee.mentorChoice && trainee.mentorChoice2 !== null}
                    value={trainee.mentorChoice2 === null ? "" : trainee.mentorChoice2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.mentorChoice2Name === null ? "n/a" : trainee.mentorChoice2Name}
                  />
                  <FormControlLabel
                    disabled={trainee.mentorChoice3 === null}
                    checked={trainee.mentorChoice3 === trainee.mentorChoice && trainee.mentorChoice3 !== null}
                    value={trainee.mentorChoice3 === null ? "" : trainee.mentorChoice3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeMentorChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={trainee.mentorChoice3Name === null ? "n/a" : trainee.mentorChoice3Name}
                  />
                  <FormControlLabel
                    checked={
                      trainee.mentorChoice !== null &&
                      trainee.mentorChoice1 !== trainee.mentorChoice &&
                      trainee.mentorChoice2 !== trainee.mentorChoice &&
                      trainee.mentorChoice3 !== trainee.mentorChoice
                    }
                    control={<Radio onClick={() => changeMentorChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        sx={styles.otherSelect}
                        label="Andere"
                        value={
                          trainee.mentorChoice !== null &&
                          trainee.mentorChoice1 !== trainee.mentorChoice &&
                          trainee.mentorChoice2 !== trainee.mentorChoice &&
                          trainee.mentorChoice3 !== trainee.mentorChoice
                            ? trainee.mentorChoice
                            : ""
                        }
                        onChange={(event) => changeMentorChoice(trainee.mitgliedID, event.target.value.toString())}
                      >
                        {mentors.map((mentor) => {
                          if (mentor.memberId) {
                            return (
                              <MenuItem key={mentor.memberId} value={mentor.memberId}>
                                {mentor.firstname.charAt(0) + "." + mentor.lastname}
                              </MenuItem>
                            );
                          }
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel
                    disabled={trainee.internalProjectChoice1 === null}
                    checked={
                      trainee.internalProjectChoice1 === trainee.internalProjectChoice &&
                      trainee.internalProjectChoice1 !== null
                    }
                    value={trainee.internalProjectChoice1 === null ? "" : trainee.internalProjectChoice1}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.internalProjectChoice1ShortName === null ? "n/a" : trainee.internalProjectChoice1ShortName
                    }
                  />
                  <FormControlLabel
                    disabled={trainee.internalProjectChoice2 === null}
                    checked={
                      trainee.internalProjectChoice2 === trainee.internalProjectChoice &&
                      trainee.internalProjectChoice2 !== null
                    }
                    value={trainee.internalProjectChoice2 === null ? "" : trainee.internalProjectChoice2}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.internalProjectChoice2ShortName === null ? "n/a" : trainee.internalProjectChoice2ShortName
                    }
                  />
                  <FormControlLabel
                    disabled={trainee.internalProjectChoice3 === null}
                    checked={
                      trainee.internalProjectChoice3 === trainee.internalProjectChoice &&
                      trainee.internalProjectChoice3 !== null
                    }
                    value={trainee.internalProjectChoice3 === null ? "" : trainee.internalProjectChoice3}
                    control={
                      <Radio
                        onClick={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, (event.target as HTMLInputElement).value)
                        }
                      />
                    }
                    label={
                      trainee.internalProjectChoice3ShortName === null ? "n/a" : trainee.internalProjectChoice3ShortName
                    }
                  />
                  <FormControlLabel
                    checked={
                      trainee.internalProjectChoice !== null &&
                      trainee.internalProjectChoice1 !== trainee.internalProjectChoice &&
                      trainee.internalProjectChoice2 !== trainee.internalProjectChoice &&
                      trainee.internalProjectChoice3 !== trainee.internalProjectChoice
                    }
                    control={<Radio onClick={() => changeInternesProjektChoice(trainee.mitgliedID, "")} />}
                    label={
                      <TextField
                        select
                        sx={styles.otherSelect}
                        label="Andere"
                        value={
                          trainee.internalProjectChoice !== null &&
                          trainee.internalProjectChoice1 !== trainee.internalProjectChoice &&
                          trainee.internalProjectChoice2 !== trainee.internalProjectChoice &&
                          trainee.internalProjectChoice3 !== trainee.internalProjectChoice
                            ? trainee.internalProjectChoice
                            : ""
                        }
                        onChange={(event) =>
                          changeInternesProjektChoice(trainee.mitgliedID, event.target.value.toString())
                        }
                      >
                        {internalprojects.map((project) => {
                          return (
                            <MenuItem key={project.internalProjectId} value={project.internalProjectId}>
                              {project.abbreviation}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    }
                  />
                </RadioGroup>
              </TableCell>
              <TableCell sx={styles.attachementCell}>
                <Button
                  sx={styles.attachementCell}
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
      {renderMotivationalTexts}
      <Paper sx={styles.paperContainer}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Trainee-Zuteilung {generation?.description}
            </Typography>
            <Typography sx={styles.paperText}>
              Hier können die Präferenzen für die Wahl von Ressort, Mentor und Internem Projekt der Trainees zugeteilt
              werden.<br></br>
              Die Daten werden bei Änderung automatisch zwischengespeichert.<br></br>
              Sobald eine neue Traineegeneration angelegt wird, können die Zuteilungen nicht mehr geändert werden.
              <br></br>
              Startdatum Präferenzwahlen:{" "}
              <b>
                {generation && generation.applicationStart
                  ? transformSQLStringToGermanDate(generation.applicationStart.toString())
                  : ""}
              </b>
              <br></br>
              Enddatum Präferenzwahlen:{" "}
              <b>
                {generation && generation.applicationEnd
                  ? transformSQLStringToGermanDate(generation.applicationEnd.toString())
                  : ""}
              </b>
              <br></br>
            </Typography>
            <Divider sx={styles.paperHeaderDivider} />
            {renderPreferences}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AssignTrainees;
