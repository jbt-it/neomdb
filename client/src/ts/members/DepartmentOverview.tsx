/*
 * The DepartmentOverview-Component displays all members of a ressort/department and the actual leaders in a grid.
 */
import React, { useState, useEffect } from "react";
import { Button, Grid, createStyles, makeStyles, Typography, Theme } from "@material-ui/core";
import PageBar from "../global/components/navigation/PageBar";
import api from "../utils/api";
import { NavLink } from "react-router-dom";
import InfoCard from "../global/components/InfoCard";
import DepartmentDialog from "../global/components/DepartmentDialog";
import { DepartmentDetails, DepartmentMember, Director } from "./membersTypes";

/**
 * Function which proivdes the styles of the DepartmentOverview
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacing: {
      margin: "10px",
    },
    buttonGroup: {
      display: "flex",
    },
    button: {
      border: "0",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:hover": {
        color: "black",
      },
    },
    memberArea: {
      marginTop: -20,
    },
    navLink: {
      textDecoration: "none",
      color: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  })
);

/**
 * Displays cards for every department
 * @returns Cards with department information and buttons
 */
const DepartmentOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  const [members, setMembers] = useState<DepartmentMember[]>([]);
  const [departments, setDepartments] = useState<DepartmentDetails[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [errorOpen, setErrorOpen] = useState<number>(0);
  const [dialogNETOpen, setDialogNETOpen] = useState<boolean>(false);
  const [dialogQMOpen, setDialogQMOpen] = useState<boolean>(false);
  const [dialogFROpen, setDialogFROpen] = useState<boolean>(false);
  const [dialogMITOpen, setDialogMITOpen] = useState<boolean>(false);
  const [dialogFKOpen, setDialogFKOpen] = useState<boolean>(false);
  const [dialogMAROpen, setDialogMAROpen] = useState<boolean>(false);
  const [dialogITOpen, setDialogITOpen] = useState<boolean>(false);

  /**
   * Retrieves the departments
   */
  const getDepartments: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/departments/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDepartments(res.data);
          }
        }
      })
      .catch(() => {
        setErrorOpen(errorOpen + 1);
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves the department members
   */
  const getDepartmentMembers: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/department-members/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(res.data);
          }
        }
      })
      .catch(() => {
        setErrorOpen(errorOpen + 1);
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves the directors of the departments
   */
  const getCurrentDirectors: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/current-directors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDirectors(res.data);
          }
        }
      })
      .catch(() => {
        setErrorOpen(errorOpen + 1);
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(() => getDepartmentMembers(), []);
  useEffect(() => getDepartments(), []);
  useEffect(() => getCurrentDirectors(), []);

  /**
   * Filters members according to the given department id
   * @param departmentID The id of the department from which all members should be
   */
  const getMembersOfDeparment = (departmentID: number) => {
    switch (departmentID) {
      case 1: {
        return members.filter((member) => {
          return member.ressort === 1;
        });
      }
      case 2: {
        return members.filter((member) => {
          return member.ressort === 2;
        });
      }
      case 3: {
        return members.filter((member) => {
          return member.ressort === 3;
        });
      }
      case 4: {
        return members.filter((member) => {
          return member.ressort === 4;
        });
      }
      case 5: {
        return members.filter((member) => {
          return member.ressort === 5;
        });
      }
      case 7: {
        return members.filter((member) => {
          return member.ressort === 7;
        });
      }
      case 8: {
        return members.filter((member) => {
          return member.ressort === 8;
        });
      }
      default: {
        return [];
      }
    }
  };

  /**
   * Filters directors according to the given department id
   * @param departmentID The id of the department from which the director should be
   */
  const getDirectorOfDepartment = (departmentID: number) => {
    switch (departmentID) {
      case 1: {
        return directors.filter((director) => {
          return director.ressortID === 1;
        });
      }
      case 2: {
        return directors.filter((director) => {
          return director.ressortID === 2;
        });
      }
      case 3: {
        return directors.filter((director) => {
          return director.ressortID === 3;
        });
      }
      case 4: {
        return directors.filter((director) => {
          return director.ressortID === 4;
        });
      }
      case 5: {
        return directors.filter((director) => {
          return director.ressortID === 5;
        });
      }
      case 7: {
        return directors.filter((director) => {
          return director.ressortID === 7;
        });
      }
      case 8: {
        return directors.filter((director) => {
          return director.ressortID === 8;
        });
      }
      default: {
        return [];
      }
    }
  };

  /**
   * Handles the click on the edit button of the department info card
   * @param event MouseEvent
   * @param departmentAlias The alias of the department
   */
  const handleDialogOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, departmentAlias: string) => {
    event.stopPropagation();
    switch (departmentAlias) {
      case "NET": {
        setDialogNETOpen(true);
        break;
      }
      case "F&R": {
        setDialogFROpen(true);
        break;
      }
      case "QM": {
        setDialogQMOpen(true);
        break;
      }
      case "MIT": {
        setDialogMITOpen(true);
        break;
      }
      case "FK": {
        setDialogFKOpen(true);
        break;
      }
      case "MAR": {
        setDialogMAROpen(true);
        break;
      }
      case "IT": {
        setDialogITOpen(true);
        break;
      }
    }
  };

  /**
   * Returns the state of the dialog of the department with the given alias
   * @param departmentAlias The alias of the department for which the corresponding dialog state should be returned
   * @returns The corresponding dialog state
   */
  const getDialogState = (departmentAlias: string): boolean => {
    switch (departmentAlias) {
      case "NET": {
        return dialogNETOpen;
      }
      case "F&R": {
        return dialogFROpen;
      }
      case "QM": {
        return dialogQMOpen;
      }
      case "MIT": {
        return dialogMITOpen;
      }
      case "FK": {
        return dialogFKOpen;
      }
      case "MAR": {
        return dialogMAROpen;
      }
      case "IT": {
        return dialogITOpen;
      }
      default: {
        return false;
      }
    }
  };

  /**
   * Returns the state change function of the dialog of the department with the given alias
   * @param departmentAlias The alias of the department for which the corresponding dialog state change function should be returned
   * @returns The corresponding dialog state change function
   */
  const getDialogStateChangeFunction = (departmentAlias: string) => {
    switch (departmentAlias) {
      case "NET": {
        setDialogNETOpen(false);
        break;
      }
      case "F&R": {
        setDialogFROpen(false);
        break;
      }
      case "QM": {
        setDialogQMOpen(false);
        break;
      }
      case "MIT": {
        setDialogMITOpen(false);
        break;
      }
      case "FK": {
        setDialogFKOpen(false);
        break;
      }
      case "MAR": {
        setDialogMAROpen(false);
        break;
      }
      case "IT": {
        setDialogITOpen(false);
        break;
      }
    }
  };

  return (
    <div>
      <div className="content-page">
        {departments.map((department, index) => (
          <div key={department.kuerzel}>
            <InfoCard
              title={department.bezeichnung}
              isEditable={true}
              handleEdit={(event) => handleDialogOpen(event, department.kuerzel)}
              defaultExpanded={false}
              isExpandable={false}
              key={index}
            >
              <div className={classes.buttonGroup}>
                <Button
                  className={classes.button}
                  variant="contained"
                  href={department.linkZielvorstellung}
                  target="_blank"
                >
                  Zu den Zielen
                </Button>
                <div className={classes.spacing}></div>
                <Button
                  className={classes.button}
                  variant="contained"
                  href={department.linkOrganigramm}
                  target="_blank"
                >
                  Zur Organisation
                </Button>
              </div>
              <br></br>
              <div>
                <Typography variant="h6">
                  <strong>Ressortleitung:</strong>
                </Typography>
                {getDirectorOfDepartment(department.ressortID).map((director, dirIndex) => (
                  <div key={`director-${dirIndex}`}>
                    <h3>
                      <NavLink
                        className={classes.navLink}
                        to={`/gesamtuebersicht/${director.mitgliedID}`}
                      >{`${director.vorname} ${director.nachname}`}</NavLink>
                    </h3>
                  </div>
                ))}
              </div>
              <br></br>
              <div>
                <Typography variant="h6">
                  <strong>Mitglieder:</strong>
                </Typography>
                <Grid container spacing={1} className={classes.memberArea}>
                  {getMembersOfDeparment(department.ressortID).map((member, membIndex) => (
                    <Grid item key={`member-${membIndex}`}>
                      <h3>
                        <NavLink
                          className={classes.navLink}
                          to={`/gesamtuebersicht/${member.mitgliedID}`}
                        >{`${member.vorname} ${member.nachname}`}</NavLink>
                      </h3>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </InfoCard>
            <DepartmentDialog
              title={department.bezeichnung}
              isOpen={getDialogState(department.kuerzel)}
              onClose={() => getDialogStateChangeFunction(department.kuerzel)}
              department={department}
            />
            <br></br>
          </div>
        ))}
      </div>
      <PageBar pageTitle="Ressorts" />
    </div>
  );
};

export default DepartmentOverview;
