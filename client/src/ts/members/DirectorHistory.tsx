/**
 * The DirectorHistory-Component displays all old and current directors in a table and displays options for filtering and sorting them
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
} from "@material-ui/core";
import {
  UnfoldMore,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import PageBar from "../global/navigation/PageBar";
import api from "../utils/api";

/**
 * Function which proivdes the styles of the DirectorHistory
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
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
    [theme.breakpoints.down("md")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  filterElement: {
    [theme.breakpoints.up("md")]: {
      margin: "7px",
      width: "155px",
    },
    [theme.breakpoints.down("md")]: {
      margin: "7px",
      width: "120px",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "7px",
      width: "120px",
    },
  },
  statusFilter: {
    [theme.breakpoints.up("md")]: {
      margin: "7px",
      width: "165px",
    },
    [theme.breakpoints.down("md")]: {
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
    [theme.breakpoints.down("md")]: {
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
}));

/**
 * Interface for the director object
 */
interface Director {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  von: string;
  bis: string;
  kuerzel: string;
  lastchange: string;
}

/**
 * Depicts a table with all directors and a filter section to filter the directors
 */
const DirectorHistory: React.FunctionComponent = () => {
  const classes = useStyles();

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [directors, setdirectors] = useState<Director[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [kuerzelFilter, setkuerzelFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const [nameSort, setNameSort] = useState<string>("");

  // Retrieves the directors
  const getdirectors: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get("/users/directors", {
      headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
    })
    .then((res) => {
      if (res.status === 200){
        if(mounted) {
          setdirectors(res.data);
        }
      }
    }).catch((error) => {
      console.log(error);
    });

    // Clean-up function
    return () => {mounted = false;};
  };

  useEffect(() => getdirectors(), []);

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
   * Handles the change event on the kuerzel filter input
   * @param event
   */
  const handlekuerzelChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setkuerzelFilter(event.target.value);
  };

  /**
   * Handles the change event on the sort input
   * @param event
   */
  const handleSortOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSortOption(event.target.value);
  };

  /**
   * Filters and sorts the director data and returns it
   */
  const getFilteredandSortedDirectors = ():Director[] => {
    let filtereddirectors = directors;


    // Filters by kuerzel
    if (kuerzelFilter !== "") {
      filtereddirectors = filtereddirectors.filter(director => {
        return director.kuerzel === kuerzelFilter;
      });
    }

    // Filters by search input
    filtereddirectors = filtereddirectors.filter(director => {
      return (
        director.vorname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        director.nachname.toLowerCase().includes(searchFilter.toLowerCase()) 
      );
    });

    let sorteddirectors = filtereddirectors;

    // Sorts by lastname in ascending alphabetical order
    if (nameSort === "up") {
      sorteddirectors = sorteddirectors.sort((a,b) => {
        return a.nachname.localeCompare(b.nachname);
      });
    // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sorteddirectors = sorteddirectors.sort((a,b) => {
        return -a.nachname.localeCompare(b.nachname);
      });
    }
    return sorteddirectors;
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
  const toggleNameSort:VoidFunction = () => {
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
  const getNameSortIcon:VoidFunction = () => {
      switch (nameSort) {
        case "" : {
          return <UnfoldMore/>;
        }
        case "up" : {
          return <ExpandLess/>;
        }
        case "down" : {
          return <ExpandMore/>;
        }
      }
  };

  // The additional filters
  const additionalFilters = (
    <div>
     
      <Grid item xs={6} sm={3} className={classes.kuerzelFilterAdditional}>
        <TextField
          label="kuerzel"
          className={classes.filterElement}
          color="primary"
          onChange={handlekuerzelChange}
          value={kuerzelFilter}
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
        {additionalFiltersState ? additionalFilters : null}
        <div className={classes.amountOfEntries}>
        {`${getFilteredandSortedDirectors().length} Einträge`}
        </div>
      </Paper>
      <TableContainer
          component={Paper}
          className={classes.tableContainer}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableHeadCell}
                >
                  <div className={classes.tableHeadSortBtn} onClick={toggleNameSort}>
                    Name
                    {getNameSortIcon()}
                  </div>
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                >
                  Vorstandsposten
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                  >
                  von
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                  >
                  bis
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredandSortedDirectors().map((director, index) => (
                <TableRow hover key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {`${director.vorname} ${director.nachname}`}
                  </TableCell>
                  
                  <TableCell>{director.kuerzel}</TableCell>
                  <TableCell>{director.von}</TableCell>
                  {<TableCell>{director.bis}</TableCell>}
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

export default DirectorHistory;