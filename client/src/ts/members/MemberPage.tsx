/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React from "react";
import {
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";

/**
 * Function which proivdes the styles of the MemberPage
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: "5px",
      marginTop: "58px",
      [theme.breakpoints.up("md")]: {
        marginTop: "65px",
        marginLeft: "280px",
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: "65px",
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

/**
 * Displays the member details
 */
const MemberPage:React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>Bild</Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography>Allgemeine Angaben</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography>Verein</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <ExpansionPanel >
            <ExpansionPanelSummary
              aria-controls="project-list-of-member"
              id="project-list"
            >
              <div>
                <Typography>Projekte (Anzahl #)</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} sm={12}>
        <ExpansionPanel >
            <ExpansionPanelSummary
              aria-controls="workshop-list-of-member"
              id="workshop-list"
              >
              <div>
                <Typography>Workshops (Anzahl #)</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography>Qualifikationen</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Typography>Zahlungsinformationen</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography>Studium</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography>Studien- oder Büroanschrift</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography>Heimatanschrift</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MemberPage;