/**
 * The TraineePreferences-Component lets trainees give preferences on their mentor, ip and ressort choice
 */
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Paper, Divider, TextField, MenuItem, Grid, Theme, Typography, Button, useTheme } from "@mui/material";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
//import { makeStyles, createStyles } from "@mui/styles";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { Generation, InternalProject, TraineePreference } from "../../types/traineesTypes";
import { DepartmentPartialDto, MemberPartialDto, MentorDto } from "../../types/membersTypes";
import { AxiosError } from "axios";

/**
 * Options to create a new member and to change the status of members
 */
const TraineePreferences: React.FunctionComponent = () => {
  const theme = useTheme();

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
  };

  const { auth, dispatchAuth } = useContext(AuthContext);

  const [traineePreferences, setTraineePreferences] = useState<TraineePreference>();
  const [generation, setGeneration] = useState<Generation>();
  const [departments, setDepartments] = useState<DepartmentPartialDto[]>([]);
  const [mentors, setMentors] = useState<MentorDto[]>([]);
  const [internalprojects, setInternalprojects] = useState<InternalProject[]>([]);

  // Test data
  const endDate = new Date();
  endDate.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  let dateString = endDate.toISOString().substring(0, 10);
  const dateArray = dateString.split("-");
  dateString = dateArray[2] + "." + dateArray[1] + "." + dateArray[0];

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
          console.log(res.data);
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
  const getPreferences: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/trainees/${auth.userID}/trainee-choices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            const prefs: TraineePreference = res.data;
            console.log(prefs);
            setTraineePreferences(prefs);
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
   * Retrieves all departments
   */
  const getDepartments: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDepartments(res.data);
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

  /**
   * Retrieves the newest trainee generation
   */
  const getTraineeGeneration: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;

    api
      .get(`/members/${auth.userID}/basic`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            const memberData: MemberPartialDto = res.data;
            getInternalProjects(memberData.generationId);
            getMentors(memberData.generationId);
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

  useEffect(() => getTraineeGeneration(), [getTraineeGeneration]);
  useEffect(() => getDepartments(), [getDepartments]);
  useEffect(() => getPreferences(), [getPreferences]);

  /**
   * Handles the change event on the first department preference
   * @param event
   */
  const handleRessortFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const department = departments.find((department) => department.departmentId === newValue);
    if (!department?.shortName) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = department.shortName;

    if (traineePreferences) {
      if (traineePreferences.departmentChoice2 === newValue || traineePreferences.departmentChoice3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
        return;
      } else {
        const newPrefs: TraineePreference = {
          ...traineePreferences,
          departmentChoice1: newValue,
          departmentChoice1ShortName: newKuerzel,
        };
        setTraineePreferences(newPrefs);
      }
    }
  };

  /**
   * Handles the change event on the second department preference
   * @param event
   */
  const handleRessortSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const department = departments.find((department) => department.departmentId === newValue);
    if (!department?.shortName) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = department.shortName;

    if (traineePreferences) {
      if (traineePreferences.departmentChoice1 === newValue || traineePreferences.departmentChoice3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          departmentChoice2: newValue,
          departmentChoice2ShortName: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the second department preference
   * @param event
   */
  const handleRessortThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const department = departments.find((department) => department.departmentId === newValue);
    if (!department?.shortName) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = department.shortName;

    if (traineePreferences) {
      if (traineePreferences.departmentChoice1 === newValue || traineePreferences.departmentChoice2 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          departmentChoice3: newValue,
          departmentChoice3ShortName: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the first internal project preference
   * @param event
   */
  const handleIPFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const internalProject = internalprojects.find((internalProject) => internalProject.internalProjectId === newValue);
    if (!internalProject?.abbreviation) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.abbreviation;

    if (traineePreferences) {
      if (
        traineePreferences.internalProjectChoice2 === newValue ||
        traineePreferences.internalProjectChoice3 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          internalProjectChoice1: newValue,
          internalProjectChoice1ShortName: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the second internal project preference
   * @param event
   */
  const handleIPSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const internalProject = internalprojects.find((internalProject) => internalProject.internalProjectId === newValue);
    if (!internalProject?.abbreviation) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.abbreviation;

    if (traineePreferences) {
      if (
        traineePreferences.internalProjectChoice1 === newValue ||
        traineePreferences.internalProjectChoice3 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          internalProjectChoice2: newValue,
          internalProjectChoice2ShortName: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the third internal project preference
   * @param event
   */
  const handleIPThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const internalProject = internalprojects.find((internalProject) => internalProject.internalProjectId === newValue);
    if (!internalProject?.abbreviation) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.abbreviation;

    if (traineePreferences) {
      if (
        traineePreferences.internalProjectChoice1 === newValue ||
        traineePreferences.internalProjectChoice2 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          internalProjectChoice3: newValue,
          internalProjectChoice3ShortName: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the first department preference
   * @param event
   */
  const handleMentorFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.memberId === newValue);
    if (!mentor?.firstname) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.firstname.charAt(0) + "." + mentor.lastname;

    if (traineePreferences) {
      if (traineePreferences.mentorChoice2 === newValue || traineePreferences.mentorChoice3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, mentorChoice1: newValue, mentorChoice1Name: newName });
      }
    }
  };

  /**
   * Handles the change event on the second department preference
   * @param event
   */
  const handleMentorSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.memberId === newValue);
    if (!mentor?.firstname) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.firstname.charAt(0) + "." + mentor.lastname;

    if (traineePreferences) {
      if (traineePreferences.mentorChoice1 === newValue || traineePreferences.mentorChoice3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, mentorChoice2: newValue, mentorChoice2Name: newName });
      }
    }
  };

  /**
   * Handles the change event on the second department preference
   * @param event
   */
  const handleMentorThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.memberId === newValue);
    if (!mentor?.firstname) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.firstname.charAt(0) + "." + mentor.lastname;

    if (traineePreferences) {
      if (traineePreferences.mentorChoice1 === newValue || traineePreferences.mentorChoice2 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, mentorChoice3: newValue, mentorChoice3Name: newName });
      }
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleFirstIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, internalProjectChoice1Motivation: event.target.value });
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleSecondIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, internalProjectChoice2Motivation: event.target.value });
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleThirdIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, internalProjectChoice3Motivation: event.target.value });
    }
  };

  const savePreferences = () => {
    console.log(traineePreferences);
    api
      .put(`/trainees/${auth.userID}/trainee-choices`, traineePreferences)
      .then((res) => {
        if (res.status === 204) {
          showSuccessMessage("Deine Präferenzen wurden gespeichert.");
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response?.status === 500) {
          showErrorMessage("Präferenzen konnten nicht gespeichert werden!");
        }
      });
  };

  /**
   * Renders the different selection possibilities for the department
   * @returns A map of jsx elements
   */
  const renderRessortItems = () => {
    return departments.map((department) => {
      return (
        <MenuItem key={department.departmentId} value={department.departmentId}>
          {department.shortName}
        </MenuItem>
      );
    });
  };

  /**
   * Render the ressort selection jsx element
   * @returns A jsx element
   */
  const renderRessortSelection = () => {
    return (
      <div>
        <Typography variant="h5" sx={styles.paperHeaderText}>
          Ressort
        </Typography>
        <TextField
          label="1. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleRessortFirstChange}
          value={traineePreferences?.departmentChoice1 || ""}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleRessortSecondChange}
          value={traineePreferences?.departmentChoice2 || ""}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleRessortThirdChange}
          value={traineePreferences?.departmentChoice3 || ""}
          select
        >
          {renderRessortItems()}
        </TextField>
      </div>
    );
  };

  /**
   * Renders the different selection possibilities for the mentor
   * @returns A map of jsx elements
   */
  const renderMentorItems = () => {
    return mentors.map((mentor) => {
      if (mentor.memberId) {
        return (
          <MenuItem key={mentor.memberId} value={mentor.memberId}>
            {mentor.firstname + " " + mentor.lastname}
          </MenuItem>
        );
      }
    });
  };

  /**
   * Render the mentor selection jsx element
   * @returns A jsx element
   */
  const renderMentorSelection = () => {
    return (
      <div>
        <Typography variant="h5" sx={styles.paperHeaderText}>
          Mentor
        </Typography>
        <TextField
          label="1. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleMentorFirstChange}
          value={traineePreferences?.mentorChoice1 || ""}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleMentorSecondChange}
          value={traineePreferences?.mentorChoice2 || ""}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          sx={styles.selectionElement}
          onChange={handleMentorThirdChange}
          value={traineePreferences?.mentorChoice3 || ""}
          select
        >
          {renderMentorItems()}
        </TextField>
      </div>
    );
  };

  /**
   * Renders the different selection possibilities for the internal project
   * @returns A map of jsx elements
   */
  const renderIPItems = () => {
    return internalprojects.map((internalproject) => {
      return (
        <MenuItem key={internalproject.internalProjectId} value={internalproject.internalProjectId}>
          {internalproject.projectName}
        </MenuItem>
      );
    });
  };

  /**
   * Render the internal project selection jsx element
   * @returns A jsx element
   */
  const renderIPSelection = () => {
    return (
      <div>
        <Typography variant="h5" sx={styles.paperHeaderText}>
          Internes Projekt
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="1. Präferenz"
            color="primary"
            sx={styles.selectionElement}
            onChange={handleIPFirstChange}
            value={traineePreferences?.internalProjectChoice1 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 1. Präferenz"
            color="primary"
            sx={styles.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleFirstIPMotivationChange}
            value={traineePreferences?.internalProjectChoice1Motivation}
          ></TextField>
        </Grid>
        <Divider sx={styles.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="2. Präferenz"
            color="primary"
            sx={styles.selectionElement}
            onChange={handleIPSecondChange}
            value={traineePreferences?.internalProjectChoice2 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 2. Präferenz"
            color="primary"
            sx={styles.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleSecondIPMotivationChange}
            value={traineePreferences?.internalProjectChoice2Motivation}
          ></TextField>
        </Grid>
        <Divider sx={styles.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="3. Präferenz"
            color="primary"
            sx={styles.selectionElement}
            onChange={handleIPThirdChange}
            value={traineePreferences?.internalProjectChoice3 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 3. Präferenz"
            color="primary"
            sx={styles.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleThirdIPMotivationChange}
            value={traineePreferences?.internalProjectChoice3Motivation}
          ></TextField>
        </Grid>
        <Divider sx={styles.paperHeaderDivider} />
      </div>
    );
  };

  return (
    <div>
      <Paper sx={styles.paperContainer}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Trainee Wahl
            </Typography>
            <Typography sx={styles.paperText}>
              Hier kannst du Präferenzen für dein Wunsch Ressort, Mentor und Internes Projekt abgeben.<br></br>
              Bitte bedenke, dass du deine Präferenzen bis spätestens <b>{dateString}</b> anpassen kannst.
            </Typography>
            <Divider sx={styles.paperHeaderDivider} />
            {renderRessortSelection()}
            <Divider sx={styles.paperHeaderDivider} />
            {renderMentorSelection()}
            <Divider sx={styles.paperHeaderDivider} />
            {renderIPSelection()}
            <Button variant="contained" color="primary" sx={styles.inputButton} onClick={savePreferences}>
              Präferenzen Speichern
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default TraineePreferences;
