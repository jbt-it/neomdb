// Trainee Section Admin

import {
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  IconButton,
  Typography,
  Theme,
  Link,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import * as traineeTypes from "./traineesTypes";
import * as memberTypes from "../../types/membersTypes";
import * as globalTypes from "../../types/globalTypes";
import { AddCircle } from "@mui/icons-material";
import PageBar from "../../components/navigation/PageBar";
import InfoCard from "../../components/general/InfoCard";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AddCircleOutline, Clear } from "@mui/icons-material";
import { Autocomplete } from "@mui/lab";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
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

interface TraineeProps {
  listOfPermissions: globalTypes.Permission[];
  isOwner: boolean;
  internalProjects: traineeTypes.InternalProject[];
  trainees: traineeTypes.Trainee[];
  generation: memberTypes.Member[];
  generationFilter: number;
}
interface UserOption {
  id: number;
  name: string;
}
//TODO: This array consists of dummy data. It needs to be changed once backend connection is established
//For the "users" trainees need to be retrieved
//For the "qms" active members need to be retrieved
const options: UserOption[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Shitting Toothpaste" },
];

const TraineeSectionAdmin: React.FunctionComponent<TraineeProps> = (props: TraineeProps) => {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [qms, setQMs] = useState<UserOption[]>([]);
  const classes = useStyles();
  const { internalProjects, trainees, generationFilter } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQMs([]);
    setUsers([]);
  };

  //Function to filter the members based on the wanted generation

  const filteredMembers: traineeTypes.Trainee[] = generationFilter
    ? trainees.filter((member) => member.generation === generationFilter)
    : trainees;

  // Creation of table with all the information about the internal project and the grid
  // with all the names of the trainee generation

  //On the Button add internal project the link to the created pop up box in another issue needs to be implemented
  //On the Button Aufnahme, a reference to change status issue needs to be implemented
  return (
    <div>
      <TableContainer component={Paper}>
        <InfoCard
          title={"Interne Projekte"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the user is owner or has the permission to
            manage all members they can edit this section */
          isEditable={props.isOwner || doesPermissionsHaveSomeOf(props.listOfPermissions, [15])}
        >
          <Table style={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow className={classes.tableTop}>
                <Button variant="outlined" startIcon={<AddCircle />} onClick={handleClickOpen}>
                  Internes Projekt Hinzufügen
                </Button>
                {/* TODO: Only show this button, when the current generation is selected*/}
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Informationen zum internen Projekt</DialogTitle>
                  <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={1} justifyContent="center">
                        <Grid
                          item
                          xs={12}
                          md={3.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <Typography>Name:</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={8.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <TextField fullWidth id="name" variant="outlined" size="small" />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <Typography>Kürzel:</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={8.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <TextField fullWidth id="kuerzel" variant="outlined" size="small" />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={3.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <Typography>Traineegeneration:</Typography>
                        </Grid>
                        {/* TODO: Once a backend connection is established, this text field needs to show the current Traineegeneration*/}
                        <Grid
                          item
                          xs={12}
                          md={8.5}
                          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                        >
                          <TextField
                            fullWidth
                            disabled
                            id="traineegeneration"
                            variant="outlined"
                            size="small"
                            defaultValue="Sommersemester 2023"
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
                          {users.map((user, index) => (
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
                                  value={user}
                                  onChange={(event, newValue: UserOption | null) => {
                                    if (newValue) {
                                      const newUsers = [...users];
                                      newUsers[index] = newValue;
                                      setUsers(newUsers);
                                    }
                                  }}
                                  id={`members-${index}`}
                                  options={options.filter((option) => !users.includes(option))}
                                  getOptionLabel={(option: UserOption) => option.name}
                                  className={classes.fullWidth}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Name" variant="outlined" size="small" />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={2} style={{ marginTop: "10px" }}>
                                <IconButton
                                  aria-label="delete"
                                  color="primary"
                                  onClick={() => {
                                    const newUsers = [...users];
                                    newUsers.splice(index, 1);
                                    setUsers(newUsers);
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
                              disabled={users.some((user) => user.name === "")}
                              onClick={() => {
                                setUsers((prev) => [...prev, { id: 0, name: "" }]);
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
                                  onChange={(event, newValue: UserOption | null) => {
                                    if (newValue) {
                                      const newQMs = [...qms];
                                      newQMs[index] = newValue;
                                      setQMs(newQMs);
                                    }
                                  }}
                                  id={`members-${index}`}
                                  options={options.filter((option) => !qms.includes(option))}
                                  getOptionLabel={(option: UserOption) => option.name}
                                  className={classes.fullWidth}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Name" variant="outlined" size="small" />
                                  )}
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
              </TableRow>
              <br></br>
              <TableRow>
                <TableCell className={classes.tableHeader} align="left">
                  Internes Projekt
                </TableCell>
                <TableCell className={classes.tableHeader} align="right">
                  Kick-Off
                </TableCell>
                <TableCell className={classes.tableHeader} align="right">
                  Angebot abgegeben
                </TableCell>
                <TableCell className={classes.tableHeader} align="right">
                  ZP
                </TableCell>
                <TableCell className={classes.tableHeader} align="right">
                  AP
                </TableCell>
                <TableCell className={classes.tableHeader} align="right">
                  Dokumentationsleitfaden
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {internalProjects.map((IP) => (
                <TableRow key={IP.projektname}>
                  <TableCell align="left">
                    <Link
                      color="textprimary" //link to members page
                      underline="hover"
                      href={`/IP/${IP.internesprojektID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >{`${IP.projektname}`}</Link>
                  </TableCell>
                  <TableCell align="right">{IP.kickoff}</TableCell>
                  <TableCell align="right">
                    <FormControlLabel control={<Checkbox defaultChecked={IP.AngebotBeiEV} />} label="" />
                  </TableCell>
                  <TableCell align="right">{IP.ZPgehalten}</TableCell>
                  <TableCell align="right">{IP.APgehalten}</TableCell>
                  <TableCell align="right">
                    <FormControlLabel control={<Checkbox defaultChecked={IP.DLbeiEV} />} label="" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfoCard>
      </TableContainer>
      <br></br>
      <TableContainer component={Paper}>
        <InfoCard
          title={"Mitglieder der Traineegeneration"}
          isExpandable={true}
          defaultExpanded={true}
          /* When the user is owner or has the permission to
            manage all members they can edit this section */
          isEditable={props.isOwner || doesPermissionsHaveSomeOf(props.listOfPermissions, [15])}
        >
          <Table style={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader} align="left">
                  Trainee
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Angebot abgegeben
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  AP gehalten und abgegeben
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  DL abgegeben
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Projektmanagement
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Rhetorik & Präsentationstechnik
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Akquise & Verhandlungstechnik
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Finanzen & Recht
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Netzwerke
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Qualitätsmanagement
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  MS Powerpoint
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Strategie und Organisation
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Datenschutzschulung
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Sicherheitsschulung
                </TableCell>
                <TableCell className={classes.tableHeader} align="left">
                  Excel Grundlagen
                </TableCell>
                {doesPermissionsHaveSomeOf(props.listOfPermissions, [18]) && (
                  <TableCell className={classes.tableHeader} align="left">
                    Aufnahme
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.mitgliedID}>
                  <TableCell align="left">
                    <Link color="textPrimary" underline="hover" href={`#/gesamtuebersicht/${member.mitgliedID}`}>
                      {member.vorname} {member.nachname}{" "}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.AngebotBeiEV} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.APgehalten} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.DLbeiEV} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.Projektmanagement} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.RhetorikPräsenationstechnik} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.AkquiseVerhandlungstechnik} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.FinanzenRecht} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.Netzwerke} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.Qualitätsmanagement} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel disabled control={<Checkbox defaultChecked={member.MSPowerpoint} />} label="" />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.StrategieOrganisation} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.Datenschutzschulung} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.Sicherheitsschulung} />}
                      label=""
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      disabled
                      control={<Checkbox defaultChecked={member.ExcelGrundlagen} />}
                      label=""
                    />
                  </TableCell>
                  {doesPermissionsHaveSomeOf(props.listOfPermissions, [18]) && (
                    <TableCell align="center">
                      <Button variant="outlined" startIcon={<AddCircle />}>
                        aufnehmen
                      </Button>
                      {/* TODO: Once a backend connection is established, this button should only be usable when all boxes are ticked*/}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfoCard>
      </TableContainer>
    </div>
  );
};

export default TraineeSectionAdmin;
