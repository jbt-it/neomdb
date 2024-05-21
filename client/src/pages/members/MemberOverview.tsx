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
  Typography,
  useTheme,
  Box,
  styled,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useContext } from "react";
import * as membersTypes from "../../types/membersTypes";
import { authReducerActionType } from "../../types/globalTypes";
import { Link } from "react-router-dom";

// styled form component
const StyledForm = styled("form")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    alignItems: "flex-end",
  },
  [theme.breakpoints.down("xl")]: {
    display: "flex",
    alignItems: "center",
  },
}));

/**
 * Depicts a table with all members and a filter section to filter the members
 */
const MemberOverview: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MemberOverview
   */
  const styles = {
    amountOfEntries: {
      marginBottom: "10px",
      padding: "7px",
      textAlign: "center",
      fontWeight: "bold",
    },
    filterContainer: {
      marginBottom: "10px",
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
  };

  const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:hover {
      text-decoration: underline;
    }
  `;

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [members, setMembers] = useState<membersTypes.MemberPartialDto[]>([]);
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
      .get("/members/", {
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
  const getFilteredAndSortedMembers = (): membersTypes.MemberPartialDto[] => {
    let filteredMembers = members;

    // Filters by status
    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.memberStatus.name === statusFilter;
      });
    }

    // Filters by ressort
    if (ressortFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.department?.name === ressortFilter;
      });
    }

    // Filters by search input
    filteredMembers = filteredMembers.filter((member) => {
      return (
        member.firstname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.lastname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.mobile.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });

    let sortedMembers = filteredMembers;

    // Sorts by last changed in ascending order
    if (sortOption === "lastchange ASC") {
      sortedMembers = sortedMembers.sort((a, b) => {
        const dateA = new Date(a.lastChange);
        const dateB = new Date(b.lastChange);

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
        const dateA = new Date(a.lastChange);
        const dateB = new Date(b.lastChange);

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
        return a.lastname.localeCompare(b.lastname);
      });
      // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sortedMembers = sortedMembers.sort((a, b) => {
        return -a.lastname.localeCompare(b.lastname);
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
      <Grid item xs={6} sm={3} sx={styles.statusFilterAdditional}>
        <TextField
          label="Status"
          sx={styles.filterElement}
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
      <Grid item xs={6} sm={3} sx={styles.ressortFilterAdditional}>
        <TextField
          label="Ressort"
          sx={styles.filterElement}
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
        sx={styles.sortElement}
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
      <Paper sx={styles.filterContainer}>
        <StyledForm noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={6} sm={3}>
              <TextField label="Name/Mail/..." sx={styles.filterElement} color="primary" onChange={handleSearchInput} />
            </Grid>
            <Grid item xs={6} sm={3} sx={styles.statusFilterMain}>
              <TextField
                label="Status"
                sx={styles.filterElement}
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
            <Grid item xs={6} sm={3} sx={styles.ressortFilterMain}>
              <TextField
                label="Ressort"
                sx={styles.filterElement}
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
          <IconButton aria-label="more filter options" sx={styles.filterBtn} onClick={toggleFilters} size="large">
            {additionalFiltersState ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
          </IconButton>
        </StyledForm>
        {additionalFiltersState ? additionalFilters : null}
        <Box sx={styles.amountOfEntries}>{`${getFilteredAndSortedMembers().length} Einträge`}</Box>
      </Paper>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeadCell}>
                <Box sx={styles.tableHeadSortBtn} onClick={toggleNameSort}>
                  <>
                    Name
                    {getNameSortIcon()}
                  </>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableHeadCell}>Handy</TableCell>
              <TableCell sx={styles.tableHeadCell}>Mail</TableCell>
              <TableCell sx={styles.tableHeadCell}>Status</TableCell>
              <TableCell sx={styles.tableHeadCell}>Ressort</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredAndSortedMembers().map((member, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  <Typography color="secondary">
                    <StyledLink
                      to={`#/gesamtuebersicht/${member.memberId}`}
                    >{`${member.firstname}.${member.lastname}`}</StyledLink>
                  </Typography>
                </TableCell>
                <TableCell>{member.mobile}</TableCell>
                <TableCell>{member.jbtEmail}</TableCell>
                <TableCell>{member.memberStatus.name}</TableCell>
                {<TableCell>{member.department?.shortName}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberOverview;
