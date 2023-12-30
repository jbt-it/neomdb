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
import { Permission } from "../../../types/globalTypes";
import { InternalProjectAll, Trainee } from "../../../types/traineesTypes";

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogListItem: {
      display: "flex",
      alignContent: "center",
    },
    addListItemBtn: {
      display: "flex",
      alignContent: "center",
    },
    fullWidth: {
      width: "100%",
    },
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
    verticaltext: {
      transform: "rotate(-135deg)",
      writingMode: "vertical-rl",
      textOrientation: "mixed",
      color: "white",
      fontWeight: "bold",
      borderBottom: "4px solid white",
      padding: theme.spacing(1, 2),
      backgroundColor: "#f6891f",
      height: "40",
    },
  })
);

interface Props {
  open: boolean;
  handleDialogClose: () => void;
  listOfPermissions?: Permission[];
  isOwner?: boolean;
  internalProjects: InternalProjectAll[];
  trainees: Trainee[];
  members: Member[];
  generationFilter: number | undefined;
  currentGeneration: string | null;
}

interface MemberOption {
  id: number;
  name: string;
}

const AddInternalProjectDialog: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [qms, setQMs] = useState<MemberOption[]>([]);
  const { trainees, generationFilter } = props;

  const handleClose = () => {
    props.handleDialogClose();
    setQMs([]);
    setMembers([]);
  };

  //Function to filter the members based on the wanted generation

  const filteredMembers: Trainee[] = generationFilter
    ? trainees.filter((member) => member.generation === generationFilter)
    : trainees;

  const traineeOptions: MemberOption[] = filteredMembers.map((member) => ({
    name: `${member.vorname} ${member.nachname}`,
    id: member.mitgliedID,
  }));
  const qmOptions: MemberOption[] = props.members.map((member) => ({
    name: `${member.vorname} ${member.nachname}`,
    id: member.mitgliedID,
  }));

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Informationen zum internen Projekt</DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} md={3.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography>Name:</Typography>
            </Grid>
            <Grid item xs={12} md={8.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <TextField fullWidth id="name" variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} md={3.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography>Kürzel:</Typography>
            </Grid>
            <Grid item xs={12} md={8.5} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <TextField fullWidth id="kuerzel" variant="outlined" size="small" />
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
                defaultValue={props.currentGeneration}
              />
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: "20px" }}>
              <Typography>Projektmitglieder:</Typography>
            </Grid>

            <Grid container spacing={1}>
              {members.map((member, index) => (
                <Grid
                  item
                  container
                  spacing={1}
                  xs={11}
                  sm={8}
                  md={6}
                  lg={10}
                  className={classes.dialogListItem}
                  key={index}
                >
                  <Grid item xs={5} style={{ marginTop: "10px" }}>
                    <Autocomplete
                      value={member}
                      onChange={(event, newValue: MemberOption | null) => {
                        if (newValue) {
                          const newMembers = [...members];
                          newMembers[index] = newValue;
                          setMembers(newMembers);
                        }
                      }}
                      id={`members-${index}`}
                      options={traineeOptions.filter((option) => !members.includes(option))}
                      getOptionLabel={(option: MemberOption) => option.name}
                      className={classes.fullWidth}
                      renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                    />
                  </Grid>

                  <Grid item xs={2} style={{ marginTop: "10px" }}>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => {
                        const newMembers = [...members];
                        newMembers.splice(index, 1);
                        setMembers(newMembers);
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12} sm={12} md={12} lg={12} className={classes.addListItemBtn}>
                <IconButton
                  aria-label="add"
                  color="primary"
                  disabled={members.some((member) => member.name === "")}
                  onClick={() => {
                    setMembers((prev) => [...prev, { id: 0, name: "" }]);
                  }}
                >
                  <AddCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: "20px" }}>
              <Typography>QMs:</Typography>
            </Grid>

            <Grid container spacing={1}>
              {qms.map((qm, index) => (
                <Grid
                  item
                  container
                  spacing={1}
                  xs={11}
                  sm={8}
                  md={6}
                  lg={10}
                  className={classes.dialogListItem}
                  key={index}
                >
                  <Grid item xs={5} style={{ marginTop: "10px" }}>
                    <Autocomplete
                      value={qm}
                      onChange={(event, newValue: MemberOption | null) => {
                        if (newValue) {
                          const newQMs = [...qms];
                          newQMs[index] = newValue;
                          setQMs(newQMs);
                        }
                      }}
                      id={`members-${index}`}
                      options={qmOptions.filter((option) => !qms.includes(option))}
                      getOptionLabel={(option: MemberOption) => option.name}
                      className={classes.fullWidth}
                      renderInput={(params) => <TextField {...params} label="Name" variant="outlined" size="small" />}
                    />
                  </Grid>

                  <Grid item xs={2} style={{ marginTop: "10px" }}>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => {
                        const newQMs = [...qms];
                        newQMs.splice(index, 1);
                        setQMs(newQMs);
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12} sm={12} md={12} lg={12} className={classes.addListItemBtn}>
                <IconButton
                  aria-label="add"
                  color="primary"
                  disabled={qms.some((qm) => qm.name === "")}
                  onClick={() => {
                    setQMs((prev) => [...prev, { id: 0, name: "" }]);
                  }}
                >
                  <AddCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        {/* TODO: Once a backend connection is established, this button needs to save the IP data into the according page*/}
        <Button onClick={handleClose}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInternalProjectDialog;
