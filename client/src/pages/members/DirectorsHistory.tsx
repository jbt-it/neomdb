/**
 * The DirectorHistory-Component displays all old and current directors in a table and displays options for filtering and sorting them
 */

import React, { useState, useEffect, useCallback } from "react";
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
  Grid,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import PageBar from "../../components/navigation/PageBar";
import api from "../../utils/api";
import { transformSQLStringToGermanDate } from "../../utils/dateUtils";
import { showErrorMessage } from "../../utils/toastUtils";
import { NavLink } from "react-router-dom";
import { DirectorDto } from "../../types/membersTypes";

/**
 * Function which proivdes the styles of the DirectorHistory
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    amountOfEntries: {
      marginBottom: "10px",
      padding: "7px",
      textAlign: "center",
      fontWeight: "bold",
    },
    filterContainer: {
      marginBottom: "10px",
    },
    filters: {
      [theme.breakpoints.up("md")]: {
        display: "flex",
        alignItems: "flex-end",
      },
      [theme.breakpoints.down("xl")]: {
        display: "flex",
        alignItems: "center",
      },
    },
    filterElement: {
      [theme.breakpoints.up("md")]: {
        margin: "7px",
        width: "155px",
      },
      [theme.breakpoints.down("xl")]: {
        margin: "7px",
        width: "120px",
      },
      [theme.breakpoints.down("lg")]: {
        margin: "7px",
        width: "120px",
      },
    },
    statusFilter: {
      [theme.breakpoints.up("md")]: {
        margin: "7px",
        width: "165px",
      },
      [theme.breakpoints.down("xl")]: {
        margin: "7px",
        width: "100px",
      },
    },
    filterBtn: {
      [theme.breakpoints.up("md")]: {
        marginTop: "12px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "50px",
      },
      [theme.breakpoints.down("xl")]: {
        marginTop: "15px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "25px",
      },
    },
    sortElement: {
      margin: "7px",
      width: "205px",
    },
    tableContainer: {
      maxHeight: (window.screen.height - 75) * 0.8,
    },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.secondary,
    },
    tableHeadSortBtn: {
      display: "flex",
      alignItems: "center",
    },
    statusFilterMain: {
      display: "block",
      "@media screen and (max-width: 350px)": {
        display: "none",
      },
    },
    kuerzelFilterMain: {
      "@media screen and (orientation:landscape)": {
        display: "block",
      },
      "@media screen and (orientation:portrait)": {
        display: "none",
      },
    },
    kuerzelFilterAdditional: {
      "@media screen and (orientation:landscape)": {
        display: "none",
      },
      "@media screen and (orientation:portrait)": {
        display: "block",
      },
    },
  })
);

/**
 * Depicts a table with all directors and a filter section to filter the directors
 */
const DirectorsHistory: React.FunctionComponent = () => {
  const classes = useStyles();
  const [directors, setdirectors] = useState<DirectorDto[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [kuerzelFilter, setkuerzelFilter] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");

  // Retrieves the directors
  const getdirectors = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/members/directors?current=false", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setdirectors(res.data);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Internal Server Error");
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => getdirectors(), [getdirectors]);

  /**
   * Handles the change event on the search filter input
   * @param event
   */
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchFilter(event.target.value);
  };

  /**
   * Handles the change event on the kuerzel filter input
   * @param event
   */
  const handlekuerzelChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setkuerzelFilter(event.target.value);
  };

  /**
   * Filters and sorts the director data and returns it
   */
  const getFilteredandSortedDirectors = (): DirectorDto[] => {
    let filtereddirectors = directors;

    // Filters by kuerzel
    if (kuerzelFilter !== "") {
      filtereddirectors = filtereddirectors.filter((director) => {
        return director.department.shortName === kuerzelFilter;
      });
    }

    // Filters by search input
    filtereddirectors = filtereddirectors.filter((director) => {
      return (
        director.firstname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        director.lastname.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
    let sorteddirectors = filtereddirectors;

    // Sorts by lastname in ascending alphabetical order
    if (nameSort === "up") {
      sorteddirectors = sorteddirectors.sort((a, b) => {
        return a.lastname.localeCompare(b.lastname);
      });
      // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sorteddirectors = sorteddirectors.sort((a, b) => {
        return -a.lastname.localeCompare(b.lastname);
      });
    }
    return sorteddirectors;
  };

  /**
   * Toggles between the name sort options
   */
  const toggleNameSort: VoidFunction = () => {
    switch (nameSort) {
      case "": {
        setNameSort("up");
        break;
      }
      case "up": {
        setNameSort("down");
        break;
      }
      case "down": {
        setNameSort("");
        break;
      }
    }
  };

  /**
   * Returns the sort icon for the name column
   */
  const getNameSortIcon: VoidFunction = () => {
    switch (nameSort) {
      case "": {
        return <UnfoldMore />;
      }
      case "up": {
        return <ExpandLess />;
      }
      case "down": {
        return <ExpandMore />;
      }
    }
  };

  return (
    <div>
      <div className="content-page">
        <Paper className={classes.filterContainer}>
          <form className={classes.filters} noValidate autoComplete="off">
            <Grid container spacing={8}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Name"
                  className={classes.filterElement}
                  color="primary"
                  onChange={handleSearchInput}
                />
              </Grid>
              <Grid item xs={6} sm={3} className={classes.kuerzelFilterMain}>
                <TextField
                  label="Vorstandsposten"
                  className={classes.filterElement}
                  color="primary"
                  onChange={handlekuerzelChange}
                  value={kuerzelFilter}
                  select
                >
                  <MenuItem value={""}>-</MenuItem>
                  <MenuItem value={"RL NET"}>NET</MenuItem>
                  <MenuItem value={"RL QM"}>QM</MenuItem>
                  <MenuItem value={"RL F&R"}>F&R</MenuItem>
                  <MenuItem value={"RL FK"}>FK</MenuItem>
                  <MenuItem value={"RL MIT"}>MIT</MenuItem>
                  <MenuItem value={"RL MAR"}>MAR</MenuItem>
                  <MenuItem value={"RL IT"}>IT</MenuItem>
                  <MenuItem value={"1V"}>1V</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>
                  <div className={classes.tableHeadSortBtn} onClick={toggleNameSort}>
                    Name
                    {getNameSortIcon()}
                  </div>
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Vorstandsposten</TableCell>
                <TableCell className={classes.tableHeadCell}>von</TableCell>
                <TableCell className={classes.tableHeadCell}>bis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredandSortedDirectors().map((director, index) => (
                <TableRow hover key={index}>
                  <TableCell component="th" scope="row">
                    <NavLink
                      to={`/gesamtuebersicht/${director.memberId}`}
                    >{`${director.firstname} ${director.lastname}`}</NavLink>
                  </TableCell>
                  <TableCell>{director.department.shortName}</TableCell>
                  <TableCell>{transformSQLStringToGermanDate(director.from.toString())}</TableCell>
                  {<TableCell>{transformSQLStringToGermanDate(director.until.toString())}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <PageBar pageTitle="Ewige EV-Liste" />
    </div>
  );
};

export default DirectorsHistory;
