/*
 * The DepartmentOverview-Component displays all members of a ressort/department and the actual leaders in a grid.
 */
import React, { useState, useEffect } from "react";
import { Button, Paper, Grid, createStyles, Theme, makeStyles } from "@material-ui/core";
import PageBar from "../global/navigation/PageBar";
import api from "../utils/api";
import { NavLink } from "react-router-dom";

/**
 * Function which proivdes the styles of the DepartmentOverview
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacing: {
      margin: "10px",
    },
    paper: {
      paddingLeft: "30px",
      paddingTop: "5px",
      marginBottom: "25px",
      minHeight: "200px",
    },
    textFieldGroup: {
      display: "flex",
      flexDirection: "row",
      marginRight: "10px",
      paddingRight: "10px",
    },
    buttonGroup: {
      display: "flex",
    },
    button: {
      border: "0",
      backgroundColor: "#F6891F",
      color: "white",
      "&:hover": {
        color: "black",
      },
    },
    memberArea: {
      marginTop: -20,
    },
    header: {
      display: "flex",
      flexDirection: "row",
    },
    image: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      maxWidth: "200px",
      marginLeft: "auto",
      marginRight: "10%",
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    navLink: {
      textDecoration: "none",
      color: "red",
    },
  })
);

/**
 * Interface for the member object
 */
interface Member {
  mitgliedID: number;
  vorname: string;
  nachname: string;
  ressort: number;
  bezeichnung: string;
}
/**
 * Interface for the department object
 */
interface Department {
  ressortID: number;
  bezeichnung: string;
  kuerzel: string;
  jbt_email: string;
  linkZielvorstellung: string;
  linkOrganigramm: string;
}

/**
 * Interface for the directors
 */
interface Director {
  evpostenID: number;
  ressortID: number;
  mitgliedID: number;
  vorname: string;
  nachname: string;
}

/**
 * Displays cards for every department
 * @returns Cards with department information and buttons
 */
const DepartmentOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  const [members, setMembers] = useState<Member[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [errorOpen, setErrorOpen] = useState<number>(0);

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
      .catch((error) => {
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
      .catch((error) => {
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
      .catch((error) => {
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

  return (
    <div>
      <div className="content-page">
        {departments.map((department, index) => {
          return (
            <Paper key={`department-${index}`} elevation={7} className={classes.paper}>
              <div className={classes.header}>
                <h1>{department.bezeichnung}</h1>
              </div>
              <div className={classes.buttonGroup}>
                <Button className={classes.button} variant="contained">
                  Zum Wiki-Artikel
                </Button>
                <div className={classes.spacing}></div>
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
              <div>
                <h2>Ressortleitung:</h2>
                {getDirectorOfDepartment(department.ressortID).map((director) => {
                  return (
                    <div>
                      <h3>
                        <NavLink
                          className="navLink"
                          to={`/gesamtuebersicht/${director.mitgliedID}`}
                        >{`${director.vorname} ${director.nachname}`}</NavLink>
                      </h3>
                    </div>
                  );
                })}
              </div>
              <div>
                <h2>Mitglieder:</h2>
                <Grid container spacing={1} className={classes.memberArea}>
                  {getMembersOfDeparment(department.ressortID).map((member) => {
                    return (
                      <Grid item>
                        <h3>
                          <NavLink
                            className="navLink"
                            to={`/gesamtuebersicht/${member.mitgliedID}`}
                          >{`${member.vorname} ${member.nachname}`}</NavLink>
                        </h3>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </Paper>
          );
        })}
      </div>
      <PageBar pageTitle="Ressorts" />
    </div>
  );
};
export default DepartmentOverview;
