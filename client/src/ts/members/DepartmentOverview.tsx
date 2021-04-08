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
} from "@material-ui/icons";
import PageBar from "../global/navigation/PageBar";
import api from "../utils/api";

/**
 * Function which proivdes the styles of the MemberOverview
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  spacing: {
    margin: "10px",
  },
  paper: {
    marginTop: "7px",
    maxHeight: "500px",
    display: "paper",
    gridTemplateColumns: "2fr, 1fr",
    gridTemplateRows: "1fr",
    gap: "0px, 0px",
    gridTemplateAreas:
      "content, bild",
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
    paperArea: "content",
    padding: "20px",
  },
  image: {
    paperArea: "bild",
    marginLeft: "auto",
    marginRight: "10%",
    marginTop: "auto",
    marginBottom: "auto",
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
  ressort: string;
  bezeichnung: string;
}

interface Department {
  ressortID: number;
  bezeichnung: string;
}

const RessortOverview: React.FunctionComponent = () => {
  const classes = useStyles();

  const [members, setMembers] = useState<Member[]>([]);

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

  useEffect(() => getDepartmentMembers(), []);

  const getMembersOfDeparment = (ressortID: string) => {
    switch (ressortID) {
      case "1": {
        return members.filter(member => { return member.ressort.toString() === "1"; });
      }
      case "2": {
        return members.filter(member => { return member.ressort.toString() === "2"; });
      }
      case "3": {
        return members.filter(member => { return member.ressort.toString() === "3"; });
      }
      case "4": {
        return members.filter(member => { return member.ressort.toString() === "4"; });
      }
      case "5": {
        return members.filter(member => { return member.ressort.toString() === "5"; });
      }
      case "7": {
        return members.filter(member => { return member.ressort.toString() === "7"; });
      }
      case "8": {
        return members.filter(member => { return member.ressort.toString() === "8"; });
      }
      default: { return []; }
    }
  };

  const departments: Department[]=[];
  return (
    <div>
      <div className="content-page">
        {departments.map(department => {
          return (
            <Paper elevation={3} className={classes.paper}>
              <Grid container spacing={2}>
                <Grid className={classes.content}>
                  <h1>{department.bezeichnung}</h1>
                  <div className={classes.buttonGroup}>
                    <Button className={classes.button} variant="contained">Zum Wiki-Artikel</Button>
                    <div className={classes.spacing}></div>
                    <Button className={classes.button} variant="contained">Zu den Zielen</Button>
                    <div className={classes.spacing}></div>
                    <Button className={classes.button} variant="contained">Zur Organisation</Button>
                  </div>
                  <h3>Mitglieder:</h3>
                  {
                    getMembersOfDeparment("1").map(departmentIT => {
                      return (<div>{departmentIT.vorname}</div>);
                    })
                  }
                </Grid>
                <Grid className={classes.image}>
                  Picture
              <h3>Ressortleiter:</h3>
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