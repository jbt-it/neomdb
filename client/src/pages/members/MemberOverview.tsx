/**
 * The MemberOverview-Component displays all members in a table and displays options for filtering and sorting the members
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
  IconButton,
  Grid,
  Theme,
  Typography,
  Link,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import PageBar from "../../components/navigation/PageBar";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useContext } from "react";
import * as membersTypes from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";

/**
 * Function which proivdes the styles of the MemberOverview
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
      color: theme.palette.primary.contrastText,
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
    statusFilterAdditional: {
      display: "none",
      "@media screen and (max-width: 350px)": {
        display: "block",
      },
    },
    ressortFilterMain: {
      "@media screen and (orientation:landscape)": {
        display: "block",
      },
      "@media screen and (orientation:portrait)": {
        display: "none",
      },
    },
    ressortFilterAdditional: {
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
 * Depicts a table with all members and a filter section to filter the members
 */
const MemberOverview: React.FunctionComponent = () => {
  const classes = useStyles();

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [members, setMembers] = useState<membersTypes.Member[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ressortFilter, setRessortFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const [nameSort, setNameSort] = useState<string>("");

  const { dispatchAuth } = useContext(AuthContext);

  // Retrieves the members
  const getMembers: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  useEffect(() => getMembers(), [getMembers]);

  /**
   * Handles the change event on the search filter input
   * @param event
   */
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchFilter(event.target.value);
  };

  /**
   * Handles the change event on the status filter input
   * @param event
   */
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setStatusFilter(event.target.value);
  };

  /**
   * Handles the change event on the ressort filter input
   * @param event
   */
  const handleRessortChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRessortFilter(event.target.value);
  };

  /**
   * Handles the change event on the sort input
   * @param event
   */
  const handleSortOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSortOption(event.target.value);
  };

  /**
   * Filters and sorts the member data and returns it
   */
  const getFilteredAndSortedMembers = (): membersTypes.Member[] => {
    let filteredMembers = members;

    // Filters by status
    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.mitgliedstatus.toString() === statusFilter;
      });
    }

    // Filters by ressort
    if (ressortFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.ressort === ressortFilter;
      });
    }

    // Filters by search input
    filteredMembers = filteredMembers.filter((member) => {
      return (
        member.vorname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.nachname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.handy.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });

    let sortedMembers = filteredMembers;

    // Sorts by last changed in ascending order
    if (sortOption === "lastchange ASC") {
      sortedMembers = sortedMembers.sort((a, b) => {
        const dateA = new Date(a.lastchange);
        const dateB = new Date(b.lastchange);

        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        } else {
          return 0;
        }
      });

      // Sorts by last changed in descending order
    } else if (sortOption === "lastchange DESC") {
      sortedMembers = sortedMembers.sort((a, b) => {
        const dateA = new Date(a.lastchange);
        const dateB = new Date(b.lastchange);

        if (dateA < dateB) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    // Sorts by lastname in ascending alphabetical order
    if (nameSort === "up") {
      sortedMembers = sortedMembers.sort((a, b) => {
        return a.nachname.localeCompare(b.nachname);
      });
      // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sortedMembers = sortedMembers.sort((a, b) => {
        return -a.nachname.localeCompare(b.nachname);
      });
    }
    return sortedMembers;
  };

  /**
   * Handles the filter toggle
   */
  const toggleFilters: VoidFunction = () => {
    setAddtionalFiltersState(!additionalFiltersState);
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

  // The additional filters
  const additionalFilters = (
    <div>
      <Grid item xs={6} sm={3} className={classes.statusFilterAdditional}>
        <TextField
          label="Status"
          className={classes.filterElement}
          color="primary"
          onChange={handleStatusChange}
          value={statusFilter}
          select
        >
          <MenuItem value={""}>-</MenuItem>
          <MenuItem value={"Trainee"}>Trainee</MenuItem>
          <MenuItem value={"aktives Mitglied"}>aktives Mitglied</MenuItem>
          <MenuItem value={"Senior"}>Senior</MenuItem>
          <MenuItem value={"passives Mitglied"}>passives Mitglied</MenuItem>
          <MenuItem value={"Alumnus"}>Alumnus</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6} sm={3} className={classes.ressortFilterAdditional}>
        <TextField
          label="Ressort"
          className={classes.filterElement}
          color="primary"
          onChange={handleRessortChange}
          value={ressortFilter}
          select
        >
          <MenuItem value={""}>-</MenuItem>
          <MenuItem value={"NET"}>NET</MenuItem>
          <MenuItem value={"QM"}>QM</MenuItem>
          <MenuItem value={"F&R"}>F&R</MenuItem>
          <MenuItem value={"FK"}>FK</MenuItem>
          <MenuItem value={"MIT"}>MIT</MenuItem>
          <MenuItem value={"MAR"}>MAR</MenuItem>
          <MenuItem value={"IT"}>IT</MenuItem>
        </TextField>
      </Grid>
      <TextField
        className={classes.sortElement}
        color="primary"
        onChange={handleSortOptionChange}
        value={sortOption}
        select
        label="Sortieren nach..."
      >
        <MenuItem value={""}>-</MenuItem>
        <MenuItem value={"lastchange ASC"}>Zuletzt Aktualisiert (aufsteigend)</MenuItem>
        <MenuItem value={"lastchange DESC"}>Zuletzt Aktualisiert (absteigend)</MenuItem>
      </TextField>
    </div>
  );

  return (
    <div>
      <div className="content-page">
        <Paper className={classes.filterContainer}>
          <form className={classes.filters} noValidate autoComplete="off">
            <Grid container spacing={8}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Name/Mail/..."
                  className={classes.filterElement}
                  color="primary"
                  onChange={handleSearchInput}
                />
              </Grid>
              <Grid item xs={6} sm={3} className={classes.statusFilterMain}>
                <TextField
                  label="Status"
                  className={classes.filterElement}
                  color="primary"
                  onChange={handleStatusChange}
                  value={statusFilter}
                  select
                >
                  <MenuItem value={""}>-</MenuItem>
                  <MenuItem value={"Trainee"}>Trainee</MenuItem>
                  <MenuItem value={"aktives Mitglied"}>aktives Mitglied</MenuItem>
                  <MenuItem value={"Senior"}>Senior</MenuItem>
                  <MenuItem value={"passives Mitglied"}>passives Mitglied</MenuItem>
                  <MenuItem value={"Alumnus"}>Alumnus</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={3} className={classes.ressortFilterMain}>
                <TextField
                  label="Ressort"
                  className={classes.filterElement}
                  color="primary"
                  onChange={handleRessortChange}
                  value={ressortFilter}
                  select
                >
                  <MenuItem value={""}>-</MenuItem>
                  <MenuItem value={"NET"}>NET</MenuItem>
                  <MenuItem value={"QM"}>QM</MenuItem>
                  <MenuItem value={"F&R"}>F&R</MenuItem>
                  <MenuItem value={"FK"}>FK</MenuItem>
                  <MenuItem value={"MIT"}>MIT</MenuItem>
                  <MenuItem value={"MAR"}>MAR</MenuItem>
                  <MenuItem value={"IT"}>IT</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <IconButton
              aria-label="more filter options"
              className={classes.filterBtn}
              onClick={toggleFilters}
              size="large"
            >
              {additionalFiltersState ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
            </IconButton>
          </form>
          {additionalFiltersState ? additionalFilters : null}
          <div className={classes.amountOfEntries}>{`${getFilteredAndSortedMembers().length} Einträge`}</div>
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
                <TableCell className={classes.tableHeadCell}>Handy</TableCell>
                <TableCell className={classes.tableHeadCell}>Mail</TableCell>
                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableHeadCell}>Ressort</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredAndSortedMembers().map((member, index) => (
                <TableRow hover key={index}>
                  <TableCell component="th" scope="row">
                    <Typography color="secondary">
                      <Link
                        color="textPrimary"
                        underline="hover"
                        href={`#/gesamtuebersicht/${member.mitgliedID}`}
                      >{`${member.vorname}.${member.nachname}`}</Link>
                    </Typography>
                  </TableCell>
                  <TableCell>{member.handy}</TableCell>
                  <TableCell>{member.jbt_email}</TableCell>
                  <TableCell>{member.mitgliedstatus}</TableCell>
                  {<TableCell>{member.ressort}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <PageBar pageTitle="Mitgliederübersicht" />
    </div>
  );
};

export default MemberOverview;
