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
    '&:hover': {
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
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

function RessortOverview() {
  const classes = useStyles();
  return (
    <div>
      <div className="content-page">
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={2}>
            <Grid className={classes.content}>
              <h1>1.Vorstand</h1>
              <div className={classes.buttonGroup}>
                <Button className={classes.button} variant="contained">Zum Wiki-Artikel</Button>
                <div className={classes.spacing}></div>
                <Button className={classes.button} variant="contained">Zu den Zielen</Button>
                <div className={classes.spacing}></div>
                <Button className={classes.button} variant="contained">Zur Organisation</Button>
              </div>
              <h3>Mitglieder:</h3>
            </Grid>
            <Grid className={classes.image}>
              Picture
            <h3>Ressortleiter:</h3>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <PageBar pageTitle="Ressorts"/>
    </div>
  );
};
export default RessortOverview;