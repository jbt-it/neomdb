import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { AddCircleOutline, Clear } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { Member } from "../../../types/membersTypes";
import { Trainee } from "../../../types/traineesTypes";

const useStyles = makeStyles((theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: "#f6891f",
      color: theme.palette.primary.contrastText,
      paddingTop: "15px",
      marginBottom: "40px",
    },
    tableTop: {
      fontWeight: "bold",
    },
    traineegrid: {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

interface AddInternalProjectDialogProps {
  open: boolean;
  handleDialogClose: () => void;
  addInternalProject: (traineeIDs: number[], qmIDs: number[], projectName: string, projectShort: string) => void;
  trainees: Trainee[];
  members: Member[];
  generationName: string | null;
}

interface MemberOption {
  id: number;
  name: string;
}

/**
 * Dialog to add an internal project to the database
 * @param open - boolean to determine if the dialog is open
 * @param handleDialogClose - function to close the dialog
 * @param addInternalProject - function to add the internal project to the database
 * @param trainees - array of all current trainees
 * @param members - array of all members who can be selected as QMs
 * @param generationName - name of the generation
 * @returns a dialog to add an internal project to the database
 */
const AddInternalProjectDialog: React.FunctionComponent<AddInternalProjectDialogProps> = ({
  open,
  handleDialogClose,
  addInternalProject,
  trainees,
  members,
  generationName,
}: AddInternalProjectDialogProps) => {
  const classes = useStyles();
  const [selectedTrainees, setSelectedTrainees] = useState<MemberOption[]>([]);
  const [selectedQMs, setSelectedQMs] = useState<MemberOption[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectShort, setProjectShort] = useState<string>("");
  const [formErrors, setFormErrors] = useState<boolean>(false);

  // reset all values when dialog is closed
  const handleClose = () => {
    handleDialogClose();
    setSelectedQMs([]);
    setSelectedTrainees([]);
    setProjectName("");
    setProjectShort("");
    setFormErrors(false);
  };

  // calls the addInternalProject function from the parent component and closes the dialog
  const handleSave = () => {
    if (
      projectName.trim() === "" ||
      projectShort.trim() === "" ||
      selectedTrainees.length === 0 ||
      selectedQMs.length === 0
    ) {
      setFormErrors(true);
      return;
    }

    addInternalProject(
      selectedTrainees.map((trainee) => trainee.id),
      selectedQMs.map((qm) => qm.id),
      projectName.trim(),
      projectShort.trim()
    );
    handleClose();
  };

  // create options for the trainees Autocomplete components
  const traineeOptions: MemberOption[] = trainees.map((trainee) => ({
    name: `${trainee.vorname} ${trainee.nachname}`,
    id: trainee.mitgliedID,
  }));

  // create options for the qms Autocomplete components
  const qmOptions: MemberOption[] = members.map((member) => ({
    name: `${member.vorname} ${member.nachname}`,
    id: member.mitgliedID,
  }));

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Neues internen Projekt erstellen</DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1, mt: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} md={3.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography>Projektname:</Typography>
            </Grid>
            <Grid item xs={12} md={8.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <TextField
                fullWidth
                id="name"
                label="Projektname"
                error={projectName.trim() === "" && projectName !== ""}
                helperText={projectName.trim() === "" && projectName !== "" ? "Projektname ist erforderlich" : ""}
                variant="outlined"
                size="small"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography>Kürzel:</Typography>
            </Grid>
            <Grid item xs={12} md={8.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <TextField
                fullWidth
                id="kuerzel"
                label="Kürzel"
                error={projectShort.trim() === "" && projectShort !== ""}
                helperText={projectShort.trim() === "" && projectShort !== "" ? "Kürzel ist erforderlich" : ""}
                variant="outlined"
                size="small"
                value={projectShort}
                onChange={(e) => {
                  setProjectShort(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography>Traineegeneration:</Typography>
            </Grid>
            <Grid item xs={12} md={8.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <TextField
                fullWidth
                disabled
                id="traineegeneration"
                variant="outlined"
                size="small"
                defaultValue={generationName}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography>Projektmitglieder:</Typography>
          {selectedTrainees.map((trainee, index) => (
            <Grid container spacing={1} xs={11} sm={8} md={6} lg={10} key={index} sx={{ mt: 1, alignItems: "center" }}>
              <Grid item xs={7}>
                <Autocomplete
                  value={trainee}
                  onChange={(event, newValue: MemberOption | null) => {
                    if (newValue) {
                      setSelectedTrainees(selectedTrainees.map((trainee, i) => (i === index ? newValue : trainee)));
                    }
                  }}
                  id={`selectedTrainees-${index}`}
                  options={traineeOptions.filter((option) => !selectedTrainees.includes(option))}
                  filterOptions={(options, state) => {
                    return options.filter(
                      (option) =>
                        option.name.toLowerCase().includes(state.inputValue) &&
                        selectedTrainees.every((trainee) => trainee.id !== option.id)
                    );
                  }}
                  getOptionLabel={(option: MemberOption) => option.name}
                  renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                  noOptionsText={"Keine Trainees gefunden"}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => {
                    setSelectedTrainees(selectedTrainees.filter((_, currentIndex) => currentIndex !== index));
                  }}
                >
                  <Clear />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <IconButton
              aria-label="add"
              color="primary"
              disabled={selectedTrainees.some((member) => member.name === "")}
              onClick={() => {
                setSelectedTrainees((prev) => [...prev, { id: 0, name: "" }]);
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Grid>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography>Qualitätsmanager:</Typography>

          {selectedQMs.map((qm, index) => (
            <Grid container spacing={1} xs={11} sm={8} md={6} lg={10} key={index} sx={{ mt: 1, alignItems: "center" }}>
              <Grid item xs={7}>
                <Autocomplete
                  value={qm}
                  onChange={(event, newValue: MemberOption | null) => {
                    if (newValue) {
                      setSelectedQMs(selectedQMs.map((qm, i) => (i === index ? newValue : qm)));
                    }
                  }}
                  id={`qm-${index}`}
                  options={qmOptions.filter((option) => !selectedQMs.includes(option))}
                  getOptionLabel={(option: MemberOption) => option.name}
                  filterOptions={(options, state) => {
                    return options.filter(
                      (option) =>
                        option.name.toLowerCase().includes(state.inputValue) &&
                        selectedQMs.every((qm) => qm.id !== option.id)
                    );
                  }}
                  renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                  noOptionsText={"Keine Mitglieder gefunden"}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => {
                    setSelectedQMs(selectedQMs.filter((_, currentIndex) => currentIndex !== index));
                  }}
                >
                  <Clear />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <IconButton
              aria-label="add"
              color="primary"
              disabled={selectedQMs.some((qm) => qm.name === "")}
              onClick={() => {
                setSelectedQMs((prev) => [...prev, { id: 0, name: "" }]);
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Grid>
        </Box>
        {formErrors && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography style={{ color: "red" }}>Bitte füllen Sie alle Felder aus!</Typography>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInternalProjectDialog;
