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
import { Trainee } from "./traineesTypes";
import { showErrorMessage } from "../utils/toastUtils";

// function to create DummyData
function createData(
  ID: number,
  name: string,
  Kickoff: string,
  Angebot: boolean,
  ZP: string,
  AP: string,
  Dokumentationsleitfaden: boolean
) {
  return { ID, name, Kickoff, Angebot, ZP, AP, Dokumentationsleitfaden };
}
// Dummy Data for the current internal projects. API needs to be created, once the backend is finished
const rows = [
  createData(1, "Controllingsystem für den BDSU", "03.06.2023", true, "", "", false),
  createData(2, "Imagefilm", "18.05.2023", true, "", "", false),
  createData(3, "Spendenakquise für HeyAlter", "12.05.2023", true, "", "", false),
];

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
      { memberID: 8880, vorname: "Philip", nachname: "Schmidt", traineeGeneration: 2023 },
      { memberID: 8883, vorname: "Florin", nachname: "Bayer", traineeGeneration: 2023 },
      { memberID: 8890, vorname: "Patrick", nachname: "Dittus", traineeGeneration: 2023 },
      { memberID: 8881, vorname: "Rufus-Antonius", nachname: "Hergel", traineeGeneration: 2023 },
      { memberID: 8891, vorname: "Philipp", nachname: "Kiriakidis", traineeGeneration: 2023 },
      { memberID: 8885, vorname: "Maximilian", nachname: "Klasen", traineeGeneration: 2023 },
      { memberID: 8886, vorname: "Julia", nachname: "Lange", traineeGeneration: 2023 },
      { memberID: 8884, vorname: "Finn", nachname: "Michel", traineeGeneration: 2023 },
      { memberID: 8889, vorname: "Marie-Claire", nachname: "Schnur", traineeGeneration: 2023 },
      { memberID: 8882, vorname: "Kim", nachname: "Siller", traineeGeneration: 2023 },
      { memberID: 8887, vorname: "Moritz", nachname: "Taeger", traineeGeneration: 2023 },
      { memberID: 8888, vorname: "Joshua", nachname: "Welsch", traineeGeneration: 2023 },
    ];
    setTrainees(dummyData);

    return () => {
      mounted = false;
    };
  };

  useEffect(() => getTrainee(), []);

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
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.Kickoff}</TableCell>
                  <TableCell align="right">
                    {row.Angebot ? (
                      <FormControlLabel control={<Checkbox defaultChecked />} label="" />
                    ) : (
                      <FormControlLabel disabled control={<Checkbox />} label="" />
                    )}
                  </TableCell>
                  <TableCell align="right">{row.ZP}</TableCell>
                  <TableCell align="right">{row.AP}</TableCell>
                  <TableCell align="right">
                    {row.Dokumentationsleitfaden ? (
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
