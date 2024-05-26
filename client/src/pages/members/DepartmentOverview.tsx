/*
 * The DepartmentOverview-Component displays all members of a ressort/department and the actual leaders in a grid.
 */
import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import api from "../../utils/api";
import InfoCard from "../../components/general/InfoCard";
import DepartmentDialog from "../../components/members/DepartmentDialog";
import { DepartmentDetailsDto, DepartmentMemberDto, DirectorDto } from "../../types/membersTypes";
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

  const [members, setMembers] = useState<DepartmentMemberDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDetailsDto[]>([]);
  const [directors, setDirectors] = useState<DirectorDto[]>([]);
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
      return member.department?.departmentId === departmentID;
    });
  };

  /**
   * Filters directors according to the given department id
   * @param departmentID The id of the department from which the director should be
   */
  const getDirectorOfDepartment = (departmentID: number) => {
    return directors.filter((director) => {
      return director.department?.departmentId === departmentID;
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
    const directorIDofDepartment = getDirectorOfDepartment(departmentID)?.directorId;
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
  const renderDirector = (department: DepartmentDetailsDto, director: DirectorDto) => {
    return (
      <div>
        <Typography variant="h6" fontWeight={"bold"}>
          Ressortleitung:
        </Typography>
        {director ? (
          <Typography
            variant="h6"
            fontWeight={"bold"}
            component={Link}
            style={styles.navLink}
            to={`/gesamtuebersicht/${director.memberId}`}
          >{`${director.firstname} ${director.lastname}`}</Typography>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      {departments.map((department, index) => (
        <Box key={department.shortName} sx={{ marginBottom: 3 }}>
          <InfoCard
            title={department.name}
            isEditable={isDepartmentEditable(department.departmentId)}
            handleEdit={(event) => handleDialogOpen(event, department.shortName)}
            defaultExpanded={false}
            isExpandable={false}
            key={index}
          >
            <Box sx={styles.buttonGroup}>
              <Button
                sx={styles.button}
                variant="contained"
                component={Link}
                to={department.linkObjectivePresentation}
                target="_blank"
              >
                Zu den Zielen
              </Button>
              <Box sx={styles.spacing}></Box>
              <Button
                sx={styles.button}
                variant="contained"
                component={Link}
                to={department.linkOrganigram}
                target="_blank"
              >
                Zur Organisation
              </Button>
            </Box>
            <br></br>
            {renderDirector(department, getDirectorOfDepartment(department.departmentId))}
            <br></br>
            <Box>
              <Typography variant="h6">
                <strong>Mitglieder:</strong>
              </Typography>
              <Grid spacing={1} container>
                {getMembersOfDeparment(department.departmentId).map((member, membIndex) => (
                  <Grid item key={`member-${membIndex}`}>
                    <Typography
                      component={Link}
                      variant="h6"
                      fontWeight={"bold"}
                      style={styles.navLink}
                      to={`/gesamtuebersicht/${member.memberId}`}
                    >{`${member.firstname} ${member.lastname}`}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </InfoCard>
          <DepartmentDialog
            title={department.name}
            isOpen={getDialogState(department.shortName)}
            onClose={() => getDialogStateChangeFunction(department.shortName)}
            department={department}
          />
        </Box>
      ))}
    </div>
  );
};

export default DepartmentOverview;
