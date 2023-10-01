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
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import { NavLink } from "react-router-dom";
import * as traineeTypes from "../../types/traineesTypes";
import * as membersTypes from "../../types/membersTypes";
import * as globalTypes from "../../types/globalTypes";
import PageBar from "../../components/navigation/PageBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: "#f6891f",
      color: "white",
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
  generation: traineeTypes.Trainee[];
  generationFilter: number;
}

const TraineeSectionMember: React.FunctionComponent<TraineeProps> = (props: TraineeProps) => {
  const classes = useStyles();
  const { internalProjects, trainees, generationFilter } = props;

  //Function to filter the members based on the wanted generation

  const filteredMembers: traineeTypes.Trainee[] = generationFilter
    ? trainees.filter((member) => member.generation === generationFilter)
    : trainees;

  // Creation of table with all the information about the internal project and the grid
  // with all the names of the trainee generation

  return (
    <div>
      <div className="content-page">
        <TableContainer component={Paper}>
          <Table style={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow className={classes.tableTop}></TableRow>
              <TableRow className={classes.tableHeader}>
                <TableCell align="left">Internes Projekt</TableCell>
                <TableCell align="right">Kick-Off</TableCell>
                <TableCell align="right">Angebot abgegeben</TableCell>
                <TableCell align="right">ZP</TableCell>
                <TableCell align="right">AP</TableCell>
                <TableCell align="right">Dokumentationsleitfaden</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {internalProjects.map((IP) => (
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
                  {filteredMembers.map((trainee, Index) => (
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
      <PageBar pageTitle="Traineebereich" />
    </div>
  );
};

export default TraineeSectionMember;
