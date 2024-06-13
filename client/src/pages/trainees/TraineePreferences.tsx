/**
 * The TraineePreferences-Component lets trainees give preferences on their mentor, ip and ressort choice
 */
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Paper, Divider, TextField, MenuItem, Grid, Theme, Typography, Button } from "@mui/material";
import PageBar from "../../components/navigation/PageBar";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import { styled } from "@mui/system";
//import { makeStyles, createStyles } from "@mui/styles";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { Generation, InternalProject, TraineePreference } from "../../types/traineesTypes";
import { Department, Member, Mentor } from "../../types/membersTypes";
import { AxiosError } from "axios";

/**
 * Function which proivdes the styles of the TraineePreferences
 */
//const useStyles = makeStyles((theme: Theme) =>
const useStyles = styled((theme: Theme) => ({
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
}));

/**
 * Options to create a new member and to change the status of members
 */
const TraineePreferences: React.FunctionComponent = () => {
  const classes = useStyles();
  const { auth, dispatchAuth } = useContext(AuthContext);

  const [traineePreferences, setTraineePreferences] = useState<TraineePreference>();
  const [generation, setGeneration] = useState<Generation>();
  const [departements, setDepartements] = useState<Department[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
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
            console.log(res.data);
            const memberData: Member = res.data;
            getInternalProjects(memberData.generation);
            getMentors(memberData.generation);
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
  useEffect(() => getDepartements(), [getDepartements]);
  useEffect(() => getPreferences(), [getPreferences]);

  /**
   * Handles the change event on the first departement preference
   * @param event
   */
  const handleRessortFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const departement = departements.find((departement) => departement.ressortID === newValue);
    if (!departement?.kuerzel) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = departement.kuerzel;

    if (traineePreferences) {
      if (traineePreferences.wahl_ressort2 === newValue || traineePreferences.wahl_ressort3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
        return;
      } else {
        const newPrefs: TraineePreference = {
          ...traineePreferences,
          wahl_ressort1: newValue,
          wahl_ressort1_kuerzel: newKuerzel,
        };
        setTraineePreferences(newPrefs);
      }
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleRessortSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const departement = departements.find((departement) => departement.ressortID === newValue);
    if (!departement?.kuerzel) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = departement.kuerzel;

    if (traineePreferences) {
      if (traineePreferences.wahl_ressort1 === newValue || traineePreferences.wahl_ressort3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, wahl_ressort2: newValue, wahl_ressort2_kuerzel: newKuerzel });
      }
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleRessortThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const departement = departements.find((departement) => departement.ressortID === newValue);
    if (!departement?.kuerzel) {
      showErrorMessage("Ungültige Präferenz");
      return;
    }
    const newKuerzel = departement.kuerzel;

    if (traineePreferences) {
      if (traineePreferences.wahl_ressort1 === newValue || traineePreferences.wahl_ressort2 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, wahl_ressort3: newValue, wahl_ressort3_kuerzel: newKuerzel });
      }
    }
  };

  /**
   * Handles the change event on the first internal project preference
   * @param event
   */
  const handleIPFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const internalProject = internalprojects.find((internalProject) => internalProject.internesProjektID === newValue);
    if (!internalProject?.kuerzel) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.kuerzel;

    if (traineePreferences) {
      if (
        traineePreferences.wahl_internesprojekt2 === newValue ||
        traineePreferences.wahl_internesprojekt3 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          wahl_internesprojekt1: newValue,
          wahl_internesprojekt1_kuerzel: newKuerzel,
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
    const internalProject = internalprojects.find((internalProject) => internalProject.internesProjektID === newValue);
    if (!internalProject?.kuerzel) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.kuerzel;

    if (traineePreferences) {
      if (
        traineePreferences.wahl_internesprojekt1 === newValue ||
        traineePreferences.wahl_internesprojekt3 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          wahl_internesprojekt2: newValue,
          wahl_internesprojekt2_kuerzel: newKuerzel,
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
    const internalProject = internalprojects.find((internalProject) => internalProject.internesProjektID === newValue);
    if (!internalProject?.kuerzel) {
      showErrorMessage("Ungültiges Internes Projekt");
      return;
    }
    const newKuerzel = internalProject.kuerzel;

    if (traineePreferences) {
      if (
        traineePreferences.wahl_internesprojekt1 === newValue ||
        traineePreferences.wahl_internesprojekt2 === newValue
      ) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({
          ...traineePreferences,
          wahl_internesprojekt3: newValue,
          wahl_internesprojekt3_kuerzel: newKuerzel,
        });
      }
    }
  };

  /**
   * Handles the change event on the first departement preference
   * @param event
   */
  const handleMentorFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.mitgliedID === newValue);
    if (!mentor?.name) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.name;

    if (traineePreferences) {
      if (traineePreferences.wahl_mentor2 === newValue || traineePreferences.wahl_mentor3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, wahl_mentor1: newValue, wahl_mentor1_name: newName });
      }
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleMentorSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.mitgliedID === newValue);
    if (!mentor?.name) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.name;

    if (traineePreferences) {
      if (traineePreferences.wahl_mentor1 === newValue || traineePreferences.wahl_mentor3 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, wahl_mentor2: newValue, wahl_mentor2_name: newName });
      }
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleMentorThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value);
    const mentor = mentors.find((mentor) => mentor.mitgliedID === newValue);
    if (!mentor?.name) {
      showErrorMessage("Ungültiger Mentor");
      return;
    }
    const newName = mentor.name;

    if (traineePreferences) {
      if (traineePreferences.wahl_mentor1 === newValue || traineePreferences.wahl_mentor2 === newValue) {
        showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
      } else {
        setTraineePreferences({ ...traineePreferences, wahl_mentor3: newValue, wahl_mentor3_name: newName });
      }
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleFirstIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, wahl_internesprojekt1_motivation: event.target.value });
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleSecondIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, wahl_internesprojekt2_motivation: event.target.value });
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleThirdIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (traineePreferences) {
      setTraineePreferences({ ...traineePreferences, wahl_internesprojekt3_motivation: event.target.value });
    }
  };

  const savePreferences = () => {
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
   * Renders the different selection possibilities for the departement
   * @returns A map of jsx elements
   */
  const renderRessortItems = () => {
    return departements.map((departement) => {
      return (
        <MenuItem key={departement.ressortID} value={departement.ressortID}>
          {departement.bezeichnung}
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
        <Typography variant="h5" className={classes.paperHeaderText}>
          Ressort
        </Typography>
        <TextField
          label="1. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleRessortFirstChange}
          value={traineePreferences?.wahl_ressort1 || ""}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleRessortSecondChange}
          value={traineePreferences?.wahl_ressort2 || ""}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleRessortThirdChange}
          value={traineePreferences?.wahl_ressort3 || ""}
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
      if (mentor.mitgliedID) {
        return (
          <MenuItem key={mentor.mitgliedID} value={mentor.mitgliedID}>
            {mentor.vorname + " " + mentor.nachname}
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
        <Typography variant="h5" className={classes.paperHeaderText}>
          Mentor
        </Typography>
        <TextField
          label="1. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleMentorFirstChange}
          value={traineePreferences?.wahl_mentor1 || ""}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleMentorSecondChange}
          value={traineePreferences?.wahl_mentor2 || ""}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleMentorThirdChange}
          value={traineePreferences?.wahl_mentor3 || ""}
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
        <MenuItem key={internalproject.internesProjektID} value={internalproject.internesProjektID}>
          {internalproject.projektname}
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
        <Typography variant="h5" className={classes.paperHeaderText}>
          Internes Projekt
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="1. Präferenz"
            color="primary"
            className={classes.selectionElement}
            onChange={handleIPFirstChange}
            value={traineePreferences?.wahl_internesprojekt1 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 1. Präferenz"
            color="primary"
            className={classes.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleFirstIPMotivationChange}
            value={traineePreferences?.wahl_internesprojekt1_motivation}
          ></TextField>
        </Grid>
        <Divider className={classes.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="2. Präferenz"
            color="primary"
            className={classes.selectionElement}
            onChange={handleIPSecondChange}
            value={traineePreferences?.wahl_internesprojekt2 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 2. Präferenz"
            color="primary"
            className={classes.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleSecondIPMotivationChange}
            value={traineePreferences?.wahl_internesprojekt2_motivation}
          ></TextField>
        </Grid>
        <Divider className={classes.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="3. Präferenz"
            color="primary"
            className={classes.selectionElement}
            onChange={handleIPThirdChange}
            value={traineePreferences?.wahl_internesprojekt3 || ""}
            select
          >
            {renderIPItems()}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Motivationstext 3. Präferenz"
            color="primary"
            className={classes.motivationalText}
            fullWidth
            multiline
            rows={10}
            onChange={handleThirdIPMotivationChange}
            value={traineePreferences?.wahl_internesprojekt3_motivation}
          ></TextField>
        </Grid>
        <Divider className={classes.paperHeaderDivider} />
      </div>
    );
  };

  return (
    <div>
      <div className="content-page">
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.paperHeaderText}>
                Trainee Wahl
              </Typography>
              <Typography className={classes.paperText}>
                Hier kannst du Präferenzen für dein Wunsch Ressort, Mentor und Internes Projekt abgeben.<br></br>
                Bitte bedenke, dass du deine Präferenzen bis spätestens <b>{dateString}</b> anpassen kannst.
              </Typography>
              <Divider className={classes.paperHeaderDivider} />
              {renderRessortSelection()}
              <Divider className={classes.paperHeaderDivider} />
              {renderMentorSelection()}
              <Divider className={classes.paperHeaderDivider} />
              {renderIPSelection()}
              <Button variant="contained" color="primary" className={classes.inputButton} onClick={savePreferences}>
                Präferenzen Speichern
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <PageBar pageTitle="Trainee Wahl" />
    </div>
  );
};

export default TraineePreferences;
