// TraineeSection internal projects and members of all trainee gernerations

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
  Theme,
  Typography,
  Box,
  Grid,
  styled,
  Button,
  Link,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import { NavLink } from "react-router-dom";
import * as traineeTypes from "./traineesTypes";
import * as membersTypes from "../../types/membersTypes";
import * as globalTypes from "../../types/globalTypes";
import PageBar from "../../components/navigation/PageBar";
import InfoCard from "../../components/general/InfoCard";

const useStyles = makeStyles((theme: Theme) =>
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

const Item = styled(Paper)(({ theme }) => ({}));

interface TraineeProps {
  listOfPermissions: globalTypes.Permission[];
  isOwner: boolean;
  internalProjects: traineeTypes.InternalProject[];
  trainees: traineeTypes.Trainee[];
  generation: traineeTypes.Generation[];
}

const TraineeSectionMember: React.FunctionComponent<TraineeProps> = (props: TraineeProps) => {
  const classes = useStyles();
  const { internalProjects, trainees, generation } = props;

  //Function to filter the members based on the wanted generation

  // Find the newest generation by getting the one with the highest ID
  const newestGeneration = Math.max(...generation.map((gen) => gen.generationID));

  // Filter trainees to show only the newest generation
  const currentTrainees = trainees.filter((member) => member.generation === newestGeneration);

  // Get the Bezeichnung (name) of the current generation
  const currentGenerationName = generation.find((gen) => gen.generationID === newestGeneration)?.Bezeichnung;

  // Filter internal projects to show only the newest generation
  const currentInternalProjects = internalProjects.filter((project) => project.generation === newestGeneration);

  // Creation of table with all the information about the internal project and the grid
  // with all the names of the trainee generation

  return (
    <div>
      <div className="content-page">
        <TableContainer component={Paper}>
          <InfoCard
            title={`Traineegeneration ${currentGenerationName}`}
            isExpandable={true}
            defaultExpanded={true}
            isEditable={false}
          >
            <Table style={{ minWidth: 400 }} aria-label="customized table">
              <TableHead>
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
                {currentInternalProjects.map((IP) => (
                  <TableRow key={IP.projektname}>
                    <TableCell align="left">
                      <NavLink
                        className="navLink" //link to members page
                        to={`/IP/${IP.internesprojektID}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >{`${IP.projektname}`}</NavLink>
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
        <TableContainer component={Paper} style={{ overflow: "hidden" }}>
          <Table style={{ minWidth: 250 }} aria-label="customized table">
            <TableHead>
              <TableRow className={classes.tableTop}>
                <TableCell>
                  <Typography className={classes.tableTop}>Mitglieder der Traineegeneration</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.traineegrid}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid className={classes.traineegrid} container spacing={2}>
                  {currentTrainees.map((trainee, Index) => (
                    <Grid item key={`trainee-${Index}`} xs={4}>
                      <Item>
                        <NavLink
                          className="navLink" //link to members page
                          to={`/gesamtuebersicht/${trainee.mitgliedID}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >{`${trainee.vorname} ${trainee.nachname}`}</NavLink>
                      </Item>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TraineeSectionMember;
