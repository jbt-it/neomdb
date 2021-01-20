/**
 * The PermissionsOverview-Component displays all members in a table and displays options for filtering and sorting the members
 */

import React, {
  useState,
  useEffect
} from "react";
import {
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
  makeStyles,
  Typography,
  Divider,
} from "@material-ui/core";
import {
  UnfoldMore,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import PageBar from "../global/navigation/PageBar";
import api from "../utils/api";

/**
 * Function which proivdes the styles of the PermissionsOverview
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  paperRoot: {
    padding: theme.spacing(2),
  },

  // Header text of a paper marking a section of a page
  paperHeaderText: {
    marginTop: theme.spacing(1),
  },
  // Header divider of a paper marking a section of a page
  paperHeaderDivider: {
  },
  contentContainer: {
  },
}));
const PermissionsOverview: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div>
      <div className="content-page">
        <Paper className={classes.paperRoot}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" className={classes.paperHeaderText}>
                Neues Mitglied hinzufügen
                </Typography>
              <Divider className={classes.paperHeaderDivider} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Grid container className={classes.contentContainer}>
                <Grid item xs={4} sm={4}>
                  <Typography>
                    Dokumentenablage
                  </Typography>
                </Grid>
                <Grid item xs={8} sm={8}>
                  <Typography>
                    RL QM
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <PageBar pageTitle="Mitgliederübersicht" />
    </div>
  );
};

export default PermissionsOverview;