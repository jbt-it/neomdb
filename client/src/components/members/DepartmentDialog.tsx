/*
 * Dialog component for displaying input fields for changing department infos
 */
import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, useTheme } from "@mui/material";
import React, { memo, useState } from "react";
import { DepartmentDetailsDto, UpdateDepartmentDto } from "../../types/membersTypes";
import { AxiosResponse } from "axios";

/**
 * Props for the department dialog component
 */
interface DepartmentDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentDetailsDto;
  updateDepartmentDetails: (
    departmentDetails: DepartmentDetailsDto
  ) => Promise<AxiosResponse<DepartmentDetailsDto, any>>;
}

/**
 * Displays dialog with textfields for editing department infos
 * @returns Dialog with textfields
 */
const DepartmentDialog: React.FunctionComponent<DepartmentDialogProps> = memo((props: DepartmentDialogProps) => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the dialog department component
   */
  const styles = {
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
  };

  const { title, isOpen, onClose, department, updateDepartmentDetails } = props;

  const [goalLink, setGoalLink] = useState(department.linkObjectivePresentation);
  const [organisationLink, setOrganisationLink] = useState(department.linkOrganigram);

  /**
   * Saves the changed links of the department
   */
  const saveData = (event: React.SyntheticEvent) => {
    event.preventDefault(); // Prevents the page from reloading

    // Given department object with changed goal and organisation links
    const editedDepartment = { ...department, linkObjectivePresentation: goalLink, linkOrganigram: organisationLink };
    updateDepartmentDetails(editedDepartment).then((response: AxiosResponse<UpdateDepartmentDto>) => {
      response.status === 204 ? onClose() : null;
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
                sx={styles.fullWidth}
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
                sx={styles.fullWidth}
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
            <Grid item xs={12} sm={12} md={12} lg={12} sx={styles.submitContainer}>
              <Button sx={styles.cancelButton} variant="contained" onClick={onClose}>
                Abbrechen
              </Button>
              <Button sx={styles.submitButton} variant="contained" color="primary" type="submit">
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
