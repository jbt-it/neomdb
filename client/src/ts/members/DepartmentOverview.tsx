/**
 * The RessortOverview-Component displays all members of a ressort/department and the actual leaders in a grid.
 */
import React, {
  useState,
  useEffect
} from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  IconButton,
  Grid,
  createStyles,
  Theme,
  makeStyles
} from "@material-ui/core";
import {
  UnfoldMore,
  ExpandLess,
  ExpandMore,
  Settings
} from "@material-ui/icons";
import PageBar from "../global/navigation/PageBar";
import api from "../utils/api";
import SettingsIcon from '@material-ui/icons/Settings';

/**
 * Function which proivdes the styles of the MemberOverview
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
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
    }
  },
  content: {
    // padding: "10px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    //alignContent: "space-between",
    //justifyContent: "space-between",

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
}));

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
}

/**
 * Interface for the directors
 */
interface Director {
  evpostenID: number;
  vorname: string;
  nachname: string;
}

const RessortOverview: React.FunctionComponent = () => {
  const classes = useStyles();

  const [members, setMembers] = useState<Member[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [directors, setCurrentDirectors] = useState<Director[]>([]);

  // Retrieves the departments
  const getDepartments: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/departments/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDepartments(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    // Clean-up function
    return () => { mounted = false; };
  };


  // Retrieves the department members
  const getDepartmentMembers: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/department-members/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    // Clean-up function
    return () => { mounted = false; };
  };

  // Retrieves the directors of the departments
  const getCurrentDircetors: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/current-directors", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setCurrentDirectors(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    // Clean-up function
    return () => { mounted = false; };
  };

  useEffect(() => {
    getDepartmentMembers();
    getDepartments();
    getCurrentDircetors();
  }, []);

  //Filters members in their departments
  const getMembersOfDeparment = (ressortID: number) => {
    switch (ressortID) {
      case 1: {
        return members.filter(member => { return member.ressort === 1; });
      }
      case 2: {
        return members.filter(member => { return member.ressort === 2; });
      }
      case 3: {
        return members.filter(member => { return member.ressort === 3; });
      }
      case 4: {
        return members.filter(member => { return member.ressort === 4; });
      }
      case 5: {
        return members.filter(member => { return member.ressort === 5; });
      }
      case 7: {
        return members.filter(member => { return member.ressort === 7; });
      }
      case 8: {
        return members.filter(member => { return member.ressort === 8; });
      }
      default: { return []; }
    }
  };

  //Filters cirectors in their departments
  const getDepartmentOfDirector = (evpostenID: number) => {
    switch (evpostenID) {
      case 1: {
        return directors.filter(director => { return director.evpostenID === 1; });
      }
      case 2: {
        return directors.filter(director => { return director.evpostenID === 2; });
      }
      case 3: {
        return directors.filter(director => { return director.evpostenID === 3; });
      }
      case 4: {
        return directors.filter(director => { return director.evpostenID === 4; });
      }
      case 5: {
        return directors.filter(director => { return director.evpostenID === 5; });
      }
      case 7: {
        return directors.filter(director => { return director.evpostenID === 7; });
      }
      case 8: {
        return directors.filter(director => { return director.evpostenID === 8; });
      }
      default: { return []; }
    }
  };

  return (
    <div>
      <div className="content-page">
        {departments.map((department, index) => {
          return (
            <Paper key={`department-${index}`} elevation={7} className={classes.paper}>
              <Grid container direction="row" spacing={2}>
                <Grid item xl={10}>
                  <div className={classes.header}>
                    <h1>{department.bezeichnung}</h1>
                    <IconButton aria-label="delete" disabled color="primary">
                      <SettingsIcon />
                    </IconButton>
                  </div>
                  <div className={classes.buttonGroup}>
                    <Button className={classes.button} variant="contained">Zum Wiki-Artikel</Button>
                    <div className={classes.spacing}></div>
                    <Button className={classes.button} variant="contained">Zu den Zielen</Button>
                    <div className={classes.spacing}></div>
                    <Button className={classes.button} variant="contained">Zur Organisation</Button>
                  </div>
                  <div className={classes.textFieldGroup}>
                    <TextField id="button-link-wiki" label="Wiki-Link einfügen"/>
                    <div className={classes.spacing}></div>
                    <TextField id="button-link-targets" label="Ziele-Link einfügen"/>
                    <div className={classes.spacing}></div>
                    <TextField id="button-link-orgaistation" label="Orga-Link einfügen"/>
                    <div className={classes.spacing}></div>
                    <Button className={classes.button} variant="contained">Speichern</Button>

                  </div>
                  <h3>Mitglieder:</h3>
                  {
                    getMembersOfDeparment(department.ressortID).map(member => {
                      return (<div>{member.vorname} {member.nachname} </div>);
                    })
                  }
                </Grid>
                <Grid className={classes.image}>
                  Picture
                  <div>
                    <h3>Ressortleiter:</h3>
                    {
                      getDepartmentOfDirector(department.ressortID).map(director => {
                        return (<div>{director.vorname} {director.nachname} </div>);
                      })
                    }
                  </div>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </div>
      <PageBar pageTitle="Ressorts" />
    </div>
  );
};
export default RessortOverview;