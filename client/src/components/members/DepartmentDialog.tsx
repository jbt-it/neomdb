/*
 * Dialog component for displaying input fields for changing department infos
 */
import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import React, { memo, useContext, useState } from "react";
import { DepartmentDetails } from "../../types/membersTypes";
import api from "../../utils/api";
import { showErrorMessage, showSuccessMessage } from "../../utils/toastUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import { AxiosError } from "axios";
import { AxiosResponse } from "axios";

/**
 * Function which proivdes the styles of the dialog department component
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

/**
 * Props for the department dialog component
 */
interface DepartmentDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentDetails;
}

/**
 * Displays dialog with textfields for editing department infos
 * @returns Dialog with textfields
 */
const DepartmentDialog: React.FunctionComponent<DepartmentDialogProps> = memo((props: DepartmentDialogProps) => {
  const classes = useStyles();
  const { title, isOpen, onClose, department } = props;
  const { dispatchAuth } = useContext(AuthContext);

  const [goalLink, setGoalLink] = useState(department.linkZielvorstellung);
  const [organisationLink, setOrganisationLink] = useState(department.linkOrganigramm);

  /**
   * Saves the changed links of the department
   */
  const saveData = (event: React.SyntheticEvent) => {
    event.preventDefault(); // Prevents the page from reloading

    // Given department object with changed goal and organisation links
    const editedDepartment = { ...department, linkZielvorstellung: goalLink, linkOrganigramm: organisationLink };
    api
      .put(`/members/departments/${editedDepartment.ressortID}`, editedDepartment)
      .then((res: AxiosResponse) => {
        if (res.status === 204) {
          showSuccessMessage("Aktualisierung erfolgreich!");
          onClose();
        }
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        } else if (err.response?.status === 500) {
          showErrorMessage("Aktualisierung ist fehlgeschlagen!");
        }
      });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg" keepMounted aria-labelledby="general-dialog-title">
      <DialogTitle id={`${title}-title`}>{title}</DialogTitle>
      <DialogContent>
        <form autoComplete="off" onSubmit={saveData}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                className={classes.fullWidth}
                required
                color="primary"
                id="goal-link-field"
                label="Ziele"
                variant="outlined"
                value={goalLink}
                onChange={(event) => setGoalLink(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                className={classes.fullWidth}
                color="primary"
                required
                id="organisation-link-field"
                label="Organisation"
                variant="outlined"
                value={organisationLink}
                onChange={(event) => setOrganisationLink(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} className={classes.submitContainer}>
              <Button className={classes.cancelButton} variant="contained" onClick={onClose}>
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
});

export default DepartmentDialog;
