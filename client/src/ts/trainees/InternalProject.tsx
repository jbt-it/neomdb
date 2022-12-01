/**
 * Component for resetting the password by the user without the help of a admin, when logged in
 *
 */
import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import * as traineesTypes from "./traineesTypes";

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

  const [internalProjectDetails, setInternalProjectDetails] = useState<traineesTypes.IpInfoType>();

  const [name, setName] = useState<string>();
  const [kuerzel, setKuerzel] = useState<string>();
  const [traineegeneration, setTraineegeneration] = useState<string>();
  const [kickoff, setKickoff] = useState<string>();
  const [angebotAbgegeben, setAngebotAbgegeben] = useState<string>();
  const [apDatum, setApDatum] = useState<string>();
  const [apAbgegeben, setApAbgegeben] = useState<string>();
  const [zpDatum, setZpDatum] = useState<string>();
  const [zpAbgegeben, setZpAbgegeben] = useState<string>();
  const [dlAbgegeben, setDlAbgegeben] = useState<string>();
  const [projektmitglieder, setProjektmitglieder] = useState<string>();
  const [qualitaetsmanager, setQualitaetsmanager] = useState<string>();

  /**
   * Retrieves dummy member details
   */
  const getInternalProjectDetails: VoidFunction = () => {
    setInternalProjectDetails({
      id: 5,
      name: "Analoges Bootcamp",
      kuerzel: "DB",
      traineegeneration: "22/WS",
      kickoff: "01.01.2020",
      angebotAbgegeben: "Ja",
      apDatum: "01.01.2022",
      apAbgegeben: "Ja",
      zpDatum: "01.01.2020",
      zpAbgegeben: "Ja",
      dlAbgegeben: "Nein",
      projektmitglieder: "Marko Müller, Ada Lovelace",
      qualitaetsmanager: "Nils Weiß, Michael Lang, Max Nagel",
    });
  };

  useEffect(getInternalProjectDetails, []);

  /**
   * Renders the dialog for changing the internal project informations
   */
  const renderInternalProjectInformationDialog: VoidFunction = () => {
    return (
      <Dialog
        open={internalProjectInfoDialogOpen}
        onClose={handleInternalProjectInfoDialogClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="general-dialog-title"
      >
        <DialogTitle id="general-dialog-title">Internes Projekt</DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!true}
                  id="name-field"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  required
                  color="primary"
                  disabled={!true}
                  id="kuerzel-field"
                  label="Kürzel"
                  variant="outlined"
                  value={kuerzel}
                  onChange={(event) => {
                    setKuerzel(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  required
                  disabled={!true}
                  id="traineegeneration-field"
                  label="Traineegeneration"
                  variant="outlined"
                  value={traineegeneration}
                  onChange={(event) => {
                    setTraineegeneration(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="kickoff-field"
                  label="Kickoff-Termin"
                  variant="outlined"
                  value={kickoff}
                  onChange={(event) => {
                    setKickoff(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="angebot-abgegeben-field"
                  label="Angebot abgegeben"
                  variant="outlined"
                  value={angebotAbgegeben}
                  onChange={(event) => {
                    setAngebotAbgegeben(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="ap-abgegeben-field"
                  label="AP abgegeben"
                  variant="outlined"
                  value={apAbgegeben}
                  onChange={(event) => {
                    setApAbgegeben(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="ap-datum-field"
                  label="AP Datum"
                  variant="outlined"
                  value={apDatum}
                  onChange={(event) => {
                    setApDatum(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="zp-abgegeben-field"
                  label="ZP abgegeben"
                  variant="outlined"
                  value={zpAbgegeben}
                  onChange={(event) => {
                    setZpAbgegeben(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="zp-datum-field"
                  label="ZP Datum"
                  variant="outlined"
                  value={zpDatum}
                  onChange={(event) => {
                    setZpDatum(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="dl-abgegeben-field"
                  label="DL abgegeben"
                  variant="outlined"
                  value={dlAbgegeben}
                  onChange={(event) => {
                    setDlAbgegeben(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="projektmitglieder-field"
                  label="Projektmitglieder"
                  variant="outlined"
                  value={projektmitglieder}
                  onChange={(event) => {
                    setProjektmitglieder(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.fullWidth}
                  color="primary"
                  disabled={!true}
                  id="qualitaetsmanager-field"
                  label="Qualitätsmanager"
                  variant="outlined"
                  value={qualitaetsmanager}
                  onChange={(event) => {
                    setQualitaetsmanager(event.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <hr />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} className={classes.submitContainer}>
                <Button
                  className={classes.cancelButton}
                  variant="contained"
                  onClick={handleInternalProjectInfoDialogClose}
                >
                  Abbrechen
                </Button>
                <Button className={classes.submitButton} variant="contained" color="primary" type="submit">
                  Änderungen speichern
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Returns the interface
   */
  return (
    <div>
      {renderInternalProjectInformationDialog()}

      <div className="content-page">
        <Paper className={classes.paper}>
          <div className={classes.categoryHeader}>
            <div>
              <Typography variant="h6">
                <strong>Informationen zum internen Projekt</strong>
              </Typography>
            </div>
            <div>
              {true ? (
                <IconButton onClick={(event) => handleInternalProjectInfoDialogOpen(event)}>
                  <Edit fontSize="inherit" />
                </IconButton>
              ) : null}
            </div>
          </div>
          <br></br>
          <div className={classes.category}>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Name:&nbsp;&nbsp;</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.name}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Kürzel:&nbsp;&nbsp;</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.kuerzel}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Traineegeneration:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.traineegeneration}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Kick-Off:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.kickoff}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Angebot abgegeben:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.angebotAbgegeben}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>AP abgegeben:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.apAbgegeben}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>AP Datum:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.apDatum}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>ZP abgegeben:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.zpAbgegeben}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>ZP Datum:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.zpDatum}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>DL abgegeben:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.dlAbgegeben}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Projektmitglieder:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.projektmitglieder}</Typography>
            </div>
            <div className={classes.categoryItem}>
              <Typography className={classes.categoryLine}>Qualitätsmanager:</Typography>
              <Typography className={classes.categoryLine}>{internalProjectDetails?.qualitaetsmanager}</Typography>
            </div>
          </div>
          <br></br>
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
  );
};

export default InternalProject;
