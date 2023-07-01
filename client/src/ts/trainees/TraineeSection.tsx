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
  createStyles,
  makeStyles,
  Box,
  Grid,
  styled,
} from "@material-ui/core";
import React, { useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { NavLink } from "react-router-dom";
import { Trainee, InternalProject } from "./traineesTypes";
import { showErrorMessage } from "../utils/toastUtils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: "#f6891f",
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

//Preparation, for upcoming implementation of API

//const TraineeOverview: React.FunctionComponent = () => {
//  const classes = useStyles;
//  const [trainees, setTrainees] = useState<Trainee[]>([]);
//
//  const getTrainee: VoidFunction = () => {
//    let mounted = true;
//    api
//      .get("(users/trainees/", {
//        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//      })
//      .then((res) => {
//        if (res.status === 200) {
//          if (mounted) {
//            setTrainees(res.data);
//          }
//        }
//      })
//      .catch((error) => {
//        setErrorOpen(errorOpen + 1);
//      });
//
//    return () => {
//      mounted = false;
//    };
//  };
//
//  useEffect(() => getTrainee(), []);
//
//  const getTraineeOfGeneration = (generationID: number) => {
//    switch (generationID) {
//      case 1: {
//        return trainees.filter((trainee) => {
//          return trainee.generation === "";
//        });
//      }
//    }
//  };
//

// creation of Traineesection, with  dummyData and preparation for API, API can be updated and activated, once backend is ready

const TraineeSection = () => {
  const classes = useStyles();

  const [IP, setInternalProject] = useState<InternalProject[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>([]);

  const getTrainee: VoidFunction = () => {
    let mounted = true;
    //  api
    //    .get("(trainees/", {
    //      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //    })
    //    .then((res) => {
    //      if (res.status === 200) {
    //        if (mounted) {
    //          setTrainees(res.data);
    //        }
    //      }
    //    })
    //    .catch((error) => {
    //      // TODO: Error handling
    //    });

    const dummyData: Trainee[] = [
      { memberID: 9001, vorname: "Jeffrey", nachname: "Corn", traineeGeneration: 2023 },
      { memberID: 9002, vorname: "Jard", nachname: "Kemp", traineeGeneration: 2023 },
      { memberID: 9003, vorname: "Jimmie", nachname: "O'Brien", traineeGeneration: 2023 },
      { memberID: 9004, vorname: "Kellan", nachname: "Mclaughin", traineeGeneration: 2023 },
      { memberID: 9005, vorname: "Talha", nachname: "Driscoll", traineeGeneration: 2023 },
      { memberID: 9006, vorname: "Miruna", nachname: "Decker", traineeGeneration: 2023 },
      { memberID: 9007, vorname: "Jorja", nachname: "Bautista", traineeGeneration: 2023 },
      { memberID: 9008, vorname: "Radhika", nachname: "Norton", traineeGeneration: 2023 },
      { memberID: 9009, vorname: "Mariana", nachname: "McDonald", traineeGeneration: 2023 },
      { memberID: 9010, vorname: "Emily", nachname: "Johnson", traineeGeneration: 2023 },
      { memberID: 9011, vorname: "Liam", nachname: "Davis", traineeGeneration: 2023 },
      { memberID: 9012, vorname: "Sophia", nachname: "Martinez", traineeGeneration: 2023 },
    ];
    setTrainees(dummyData);

    return () => {
      mounted = false;
    };
  };

  const getInternalProject: VoidFunction = () => {
    let mounted = true;
    //  api
    //    .get("(IP/", {
    //      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //    })
    //    .then((res) => {
    //      if (res.status === 200) {
    //        if (mounted) {
    //          setInternalProject(res.data);
    //        }
    //      }
    //    })
    //    .catch((error) => {
    //      //TODO: Error handling
    //    });

    const DummyData: InternalProject[] = [
      {
        internalprojectID: 1,
        name: "Controllingsystem für den BDSU",
        Kickoff: "03.06.2023",
        Angebot: true,
        ZP: "",
        AP: "",
        Dokumentationsleitfaden: false,
      },
      {
        internalprojectID: 2,
        name: "Imagefilm",
        Kickoff: "18.05.2023",
        Angebot: true,
        ZP: "",
        AP: "",
        Dokumentationsleitfaden: false,
      },
      {
        internalprojectID: 3,
        name: "Spendenakquise für HeyAlter",
        Kickoff: "12.05.2023",
        Angebot: true,
        ZP: "",
        AP: "",
        Dokumentationsleitfaden: false,
      },
    ];
    setInternalProject(DummyData);

    return () => {
      mounted = false;
    };
  };

  useEffect(() => getTrainee(), []);
  useEffect(() => getInternalProject(), []);

  // Creation of table with all the information about the internal project and the grid
  // with all the names of the trainee generation

  return (
    <div>
      <div className="content-page">
        <TableContainer component={Paper}>
          <Table style={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow className={classes.tableTop}>
                <TableCell>
                  <Typography className={classes.tableTop}>Traineegeneration Sommersemester 2023</Typography>
                </TableCell>
              </TableRow>
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
              {IP.map((IP) => (
                <TableRow key={IP.name}>
                  <TableCell align="left">
                    <NavLink
                      className="navLink" //link to members page
                      to={`/internes-projekt/${IP.internalprojectID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >{`${IP.name}`}</NavLink>
                  </TableCell>
                  <TableCell align="right">{IP.Kickoff}</TableCell>
                  <TableCell align="right">
                    {IP.Angebot ? (
                      <FormControlLabel control={<Checkbox defaultChecked />} label="" />
                    ) : (
                      <FormControlLabel disabled control={<Checkbox />} label="" />
                    )}
                  </TableCell>
                  <TableCell align="right">{IP.ZP}</TableCell>
                  <TableCell align="right">{IP.AP}</TableCell>
                  <TableCell align="right">
                    {IP.Dokumentationsleitfaden ? (
                      <FormControlLabel control={<Checkbox defaultChecked />} label="" />
                    ) : (
                      <FormControlLabel disabled control={<Checkbox />} label="" />
                    )}
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
                  {trainees.map((trainee, Index) => (
                    <Grid item key={`trainee-${Index}`} xs={4}>
                      <Item>
                        <NavLink
                          className="navLink" //link to members page
                          to={`/gesamtuebersicht/${trainee.memberID}`}
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

export default TraineeSection;
