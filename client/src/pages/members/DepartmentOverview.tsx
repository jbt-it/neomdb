/*
 * The DepartmentOverview-Component displays all members of a ressort/department and the actual leaders in a grid.
 */
import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import api from "../../utils/api";
import InfoCard from "../../components/general/InfoCard";
import DepartmentDialog from "../../components/members/DepartmentDialog";
import { DepartmentDetails, DepartmentMember, Director } from "../../types/membersTypes";
import { showErrorMessage } from "../../utils/toastUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { doesRolesHaveSomeOf } from "../../utils/authUtils";
import { Link } from "react-router-dom";

/**
 * Displays cards for every department
 * @returns Cards with department information and buttons
 */
const DepartmentOverview: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the DepartmentOverview
   */
  const styles = {
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
  };
  const { auth } = useContext(AuthContext);

  const [members, setMembers] = useState<DepartmentMember[]>([]);
  const [departments, setDepartments] = useState<DepartmentDetails[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
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
      .get("/members/departments/", {
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
        showErrorMessage("Fehler beim Laden der Ressorts");
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
      .get("/members/department-members/", {
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
        showErrorMessage("Fehler beim Laden der Ressortmitglieder");
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
      .get("/members/directors?current=true", {
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
        showErrorMessage("Fehler beim Laden der Ressortleitungen");
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
    return members.filter((member) => {
      return member.ressort === departmentID;
    });
  };

  /**
   * Filters directors according to the given department id
   * @param departmentID The id of the department from which the director should be
   */
  const getDirectorOfDepartment = (departmentID: number) => {
    return directors.filter((director) => {
      return director.ressortID === departmentID;
    })[0];
  };

  /**
   * Checks if the current user is the director of the given department
   * @param departmentID The id of the department which should be checked
   * @returns true if the current user is the director of the given department
   * @returns false if the current user is not the director of the given department
   * @returns false if the director of the given department is undefined
   */
  const isDepartmentEditable = (departmentID: number) => {
    const directorIDofDepartment = getDirectorOfDepartment(departmentID)?.evpostenID;
    if (directorIDofDepartment === undefined) {
      return false;
    }
    return doesRolesHaveSomeOf(auth.roles, [directorIDofDepartment]);
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

  /**
   * Renders the director of the given department
   * @param department The department for which the director should be rendered
   * @param director The director of the given department
   * @returns The rendered director information
   * @returns null if the director is undefined
   */
  const renderDirector = (department: DepartmentDetails, director: Director) => {
    return (
      <div>
        <Typography variant="h6">
          <strong>Ressortleitung:</strong>
        </Typography>
        {director ? (
          <div key={`director-${department.bezeichnung}`}>
            <h3>
              <Link
                style={styles.navLink}
                to={`/gesamtuebersicht/${director.mitgliedID}`}
              >{`${director.vorname} ${director.nachname}`}</Link>
            </h3>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      {departments.map((department, index) => (
        <div key={department.kuerzel}>
          <InfoCard
            title={department.bezeichnung}
            isEditable={isDepartmentEditable(department.ressortID)}
            handleEdit={(event) => handleDialogOpen(event, department.kuerzel)}
            defaultExpanded={false}
            isExpandable={false}
            key={index}
          >
            <Box sx={styles.buttonGroup}>
              <Button sx={styles.button} variant="contained" href={department.linkZielvorstellung} target="_blank">
                Zu den Zielen
              </Button>
              <Box sx={styles.spacing}></Box>
              <Button sx={styles.button} variant="contained" href={department.linkOrganigramm} target="_blank">
                Zur Organisation
              </Button>
            </Box>
            <br></br>
            {renderDirector(department, getDirectorOfDepartment(department.ressortID))}
            <br></br>
            <div>
              <Typography variant="h6">
                <strong>Mitglieder:</strong>
              </Typography>
              <Grid container spacing={1} sx={{ marginTop: -3 }}>
                {getMembersOfDeparment(department.ressortID).map((member, membIndex) => (
                  <Grid item key={`member-${membIndex}`}>
                    <h3>
                      <Link
                        style={styles.navLink}
                        to={`/gesamtuebersicht/${member.mitgliedID}`}
                      >{`${member.vorname} ${member.nachname}`}</Link>
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
  );
};

export default DepartmentOverview;
