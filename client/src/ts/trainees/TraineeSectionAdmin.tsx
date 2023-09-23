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
  Theme,
  Button,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import { NavLink } from "react-router-dom";
import * as traineeTypes from "./traineesTypes";
import * as memberTypes from "../members/membersTypes";
import * as globalTypes from "../global/globalTypes";
import { AddCircle } from "@mui/icons-material";
import PageBar from "../global/components/navigation/PageBar";
import InfoCard from "../global/components/InfoCard";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";

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

const TraineeSectionAdmin: React.FunctionComponent<TraineeProps> = (props: TraineeProps) => {
  const classes = useStyles();
  const { internalProjects, trainees, generationFilter } = props;

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
                <Button variant="outlined" startIcon={<AddCircle />}>
                  Internes Projekt Hinzufügen
                </Button>
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
                    {member.vorname} {member.nachname}
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
                  <TableCell align="center">
                    <Button variant="outlined" startIcon={<AddCircle />}>
                      aufnehmen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfoCard>
      </TableContainer>
      <PageBar pageTitle="Traineebereich" />
    </div>
  );
};

export default TraineeSectionAdmin;
