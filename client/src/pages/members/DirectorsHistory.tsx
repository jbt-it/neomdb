/**
 * The DirectorHistory-Component displays all old and current directors in a table and displays options for filtering and sorting them
 */

import React, { useState } from "react";
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
  useTheme,
  styled,
  Box,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import { transformSQLStringToGermanDate } from "../../utils/dateUtils";
import { NavLink } from "react-router-dom";
import useMembers from "../../hooks/members/useMembers";
import { Director } from "../../types/membersTypes";

// Create a styled component with the form
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
 * Depicts a table with all directors and a filter section to filter the directors
 */
const DirectorsHistory: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the DirectorHistory
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
      color: "white",
      fontWeight: "bold",
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
  };

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [kuerzelFilter, setkuerzelFilter] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");
  const { allDirectors } = useMembers();

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
  const getFilteredandSortedDirectors = (): Director[] => {
    let filtereddirectors = allDirectors;

    // Filters by kuerzel
    if (kuerzelFilter !== "") {
      filtereddirectors = filtereddirectors.filter((director) => {
        return director.kuerzel === kuerzelFilter;
      });
    }

    // Filters by search input
    filtereddirectors = filtereddirectors.filter((director) => {
      return (
        director.vorname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        director.nachname.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
    let sorteddirectors = filtereddirectors;

    // Sorts by lastname in ascending alphabetical order
    if (nameSort === "up") {
      sorteddirectors = sorteddirectors.sort((a, b) => {
        return a.nachname.localeCompare(b.nachname);
      });
      // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sorteddirectors = sorteddirectors.sort((a, b) => {
        return -a.nachname.localeCompare(b.nachname);
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
      <Paper sx={styles.filterContainer}>
        <StyledForm noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={6} sm={3}>
              <TextField label="Name" sx={styles.filterElement} color="primary" onChange={handleSearchInput} />
            </Grid>
            <Grid item xs={6} sm={3} sx={styles.kuerzelFilterMain}>
              <TextField
                label="Vorstandsposten"
                sx={styles.filterElement}
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
        </StyledForm>
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
              <TableCell sx={styles.tableHeadCell}>Vorstandsposten</TableCell>
              <TableCell sx={styles.tableHeadCell}>von</TableCell>
              <TableCell sx={styles.tableHeadCell}>bis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredandSortedDirectors().map((director, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  <NavLink
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/gesamtuebersicht/${director.mitgliedID}`}
                  >{`${director.vorname} ${director.nachname}`}</NavLink>
                </TableCell>
                <TableCell>{director.kuerzel}</TableCell>
                <TableCell>{transformSQLStringToGermanDate(director.von)}</TableCell>
                {<TableCell>{transformSQLStringToGermanDate(director.bis)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DirectorsHistory;
