import React from "react";
import { Grid, Dialog, DialogTitle, DialogContent, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as traineesTypes from "./traineesTypes";

interface DetailProps {
  name: string;
  kuerzel: string;
  traineegeneration: string;
  kickoff: string;
  angebotAbgegeben: string;
  apDatum: string;
  apAbgegeben: string;
  zpDatum: string;
  zpAbgegeben: string;
  dlAbgegeben: string;
  projektmitglieder: string;
  qualitaetsmanager: string;
  internalProjectInfoDialogOpen: boolean;
  handleInternalProjectInfoDialogClose: VoidFunction;
  setName: (value: React.SetStateAction<string>) => void;
  setKuerzel: (value: React.SetStateAction<string>) => void;
  setTraineegeneration: (value: React.SetStateAction<string>) => void;
  setKickoff: (value: React.SetStateAction<string>) => void;
  setAngebotAbgegeben: (value: React.SetStateAction<string>) => void;
  setApDatum: (value: React.SetStateAction<string>) => void;
  setApAbgegeben: (value: React.SetStateAction<string>) => void;
  setZpAbgegeben: (value: React.SetStateAction<string>) => void;
  setZpDatum: (value: React.SetStateAction<string>) => void;
  setDlAbgegeben: (value: React.SetStateAction<string>) => void;
  setProjektmitglieder: (value: React.SetStateAction<string>) => void;
  setQualitaetsmanager: (value: React.SetStateAction<string>) => void;
  updateInternalProjectDetails: () => () => void;
}

export const InternalProjectInformationDialog: React.FC<DetailProps> = ({
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
  internalProjectInfoDialogOpen,
  handleInternalProjectInfoDialogClose,
  setName,
  setKuerzel,
  setTraineegeneration,
  setKickoff,
  setAngebotAbgegeben,
  setApDatum,
  setApAbgegeben,
  setZpDatum,
  setZpAbgegeben,
  setDlAbgegeben,
  setProjektmitglieder,
  setQualitaetsmanager,
  updateInternalProjectDetails,
}) => {
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

  const classes = useStyles();

  const onSubmit = () => {
    updateInternalProjectDetails();
    handleInternalProjectInfoDialogClose();
  };

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
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                type="submit"
                onClick={onSubmit}
              >
                Änderungen speichern
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
