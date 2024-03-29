/**
 * The TraineePreferences-Component lets admins manually add members and change the status of existing members
 */
import React, { useState, useEffect } from "react";
import { Paper, Divider, TextField, MenuItem, Grid, Theme, Typography, Button } from "@mui/material";
import PageBar from "../../components/navigation/PageBar";
import api from "../../utils/api";
import { makeStyles, createStyles } from "@mui/styles";
import { showErrorMessage } from "../../utils/toastUtils";

/**
 * Function which proivdes the styles of the TraineePreferences
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
  })
);

/**
 * Options to create a new member and to change the status of members
 */
const TraineePreferences: React.FunctionComponent = () => {
  const classes = useStyles();

  const [ressortFirst, setRessortFirst] = useState<string>("");
  const [ressortSecond, setRessortSecond] = useState<string>("");
  const [ressortThird, setRessortThird] = useState<string>("");

  const [mentorFirst, setMentorFirst] = useState<string>("");
  const [mentorSecond, setMentorSecond] = useState<string>("");
  const [mentorThird, setMentorThird] = useState<string>("");

  const [ipFirst, setIPFirst] = useState<string>("");
  const [ipSecond, setIPSecond] = useState<string>("");
  const [ipThird, setIPThird] = useState<string>("");
  const [ipMotivationFirst, setIPMotivationFirst] = useState<string>("");
  const [ipMotivationSecond, setIPMotivationSecond] = useState<string>("");
  const [ipMotivationThird, setIPMotivationThird] = useState<string>("");

  // Test data
  const endDate = new Date();
  endDate.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  let dateString = endDate.toISOString().substring(0, 10);
  const dateArray = dateString.split("-");
  dateString = dateArray[2] + "." + dateArray[1] + "." + dateArray[0];

  const ressorts = ["Mitglieder", "Marketing", "Firmenkontakte", "IT", "Finanzen & Recht"];
  const mentors = ["W. Luft", "Test1", "Test2", "Test3", "Test4"];
  const ips = ["IP 1", "IP 2", "IP 3", "IP 4"];

  /**
   * Handles the change event on the first departement preference
   * @param event
   */
  const handleRessortFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ressortSecond !== event.target.value && ressortThird !== event.target.value)) {
      setRessortFirst(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleRessortSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ressortFirst !== event.target.value && ressortThird !== event.target.value)) {
      setRessortSecond(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleRessortThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ressortFirst !== event.target.value && ressortSecond !== event.target.value)) {
      setRessortThird(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the first internal project preference
   * @param event
   */
  const handleIPFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ipSecond !== event.target.value && ipThird !== event.target.value)) {
      setIPFirst(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the second internal project preference
   * @param event
   */
  const handleIPSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ipFirst !== event.target.value && ipThird !== event.target.value)) {
      setIPSecond(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the third internal project preference
   * @param event
   */
  const handleIPThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (ipFirst !== event.target.value && ipSecond !== event.target.value)) {
      setIPThird(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the first departement preference
   * @param event
   */
  const handleMentorFirstChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (mentorSecond !== event.target.value && mentorThird !== event.target.value)) {
      setMentorFirst(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleMentorSecondChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (mentorFirst !== event.target.value && mentorThird !== event.target.value)) {
      setMentorSecond(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the second departement preference
   * @param event
   */
  const handleMentorThirdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === "-" || (mentorFirst !== event.target.value && mentorSecond !== event.target.value)) {
      setMentorThird(event.target.value);
    } else {
      showErrorMessage("Für jede Präferenz muss eine andere Wahl getroffen werden");
    }
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleFirstIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIPMotivationFirst(event.target.value);
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleSecondIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIPMotivationSecond(event.target.value);
  };

  /**
   * Handles the change event on the first internal project motviational text
   * @param event
   */
  const handleThirdIPMotivationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIPMotivationThird(event.target.value);
  };

  /**
   * Renders the different selection possibilities for the departement
   * @returns A map of jsx elements
   */
  const renderRessortItems = () => {
    const res = [...ressorts];
    res.unshift("-");
    return res.map((ressort) => {
      return <MenuItem value={ressort}>{ressort}</MenuItem>;
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
          value={ressortFirst}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleRessortSecondChange}
          value={ressortSecond}
          select
        >
          {renderRessortItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleRessortThirdChange}
          value={ressortThird}
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
    const men = [...mentors];
    men.unshift("-");
    return men.map((mentor) => {
      return <MenuItem value={mentor}>{mentor}</MenuItem>;
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
          value={mentorFirst}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="2. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleMentorSecondChange}
          value={mentorSecond}
          select
        >
          {renderMentorItems()}
        </TextField>
        <TextField
          label="3. Präferenz"
          color="primary"
          className={classes.selectionElement}
          onChange={handleMentorThirdChange}
          value={mentorThird}
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
    const internal = [...ips];
    internal.unshift("-");
    return internal.map((ip) => {
      return <MenuItem value={ip}>{ip}</MenuItem>;
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
            value={ipFirst}
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
            value={ipMotivationFirst}
          ></TextField>
        </Grid>
        <Divider className={classes.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="2. Präferenz"
            color="primary"
            className={classes.selectionElement}
            onChange={handleIPSecondChange}
            value={ipSecond}
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
            value={ipMotivationSecond}
          ></TextField>
        </Grid>
        <Divider className={classes.paperHeaderDivider} />
        <Grid item xs={12}>
          <TextField
            label="3. Präferenz"
            color="primary"
            className={classes.selectionElement}
            onChange={handleIPThirdChange}
            value={ipThird}
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
            value={ipMotivationThird}
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
              <Button variant="outlined" color="primary" className={classes.inputButton}>
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
