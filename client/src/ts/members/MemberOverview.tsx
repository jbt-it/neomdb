// The MemberOverview-Component displays a all members and filter-options

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
} from "@material-ui/core";
import {
  AddCircle,
  RemoveCircle,
  UnfoldMore,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import api from "../utils/api";

/**
 * Function which proivdes the styles of the MemberOverview
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  memberOverviewRoot: {
    flexGrow: 1,
    padding: "5px",
    [theme.breakpoints.up("md")]: {
      marginTop: "75px",
      marginLeft: "280px",
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "96px",
    },
  },
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
      width: "165px",
    },
    [theme.breakpoints.down("md")]: {
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
    maxHeight: (window.screen.height - 40) * 0.8,
  },
  tableHeadCell: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
  },
  tableHeadSortBtn: {
    display: "flex",
    alignItems: "center",
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
}));

/**
 * Interface for the member object
 */
interface Member {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  ressort: string;
  lastchange: string;
}

/**
 * Depicts a table with all members and a filter section to filter the members
 */
const MemberOverview = () => {
  const classes = useStyles();

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ressortFilter, setRessortFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const [nameSort, setNameSort] = useState<string>("");
  const [statusSort, setStatusSort] = useState<string>("");


  // Retrieves the members
  const getMembers = () => {
    api.get("/users/", {
      headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
    })
    .then((res) => {
      if (res.status === 200){
        setMembers(res.data);
      } else {
        console.log("Login Failed");
      }
      console.log(res.data);
    }, (err) => {
      console.log(err);
    });
  };

  useEffect(() => getMembers(), []);

  /**
   * Handles the change event on the search filter input
   *
   * @param event
   */
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  /**
   * Handles the change event on the status filter input
   *
   * @param event
   */
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  /**
   * Handles the change event on the ressort filter input
   *
   * @param event
   */
  const handleRessortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRessortFilter(event.target.value);
  };

  /**
   * Handles the change event on the sort input
   *
   * @param event
   */
  const handleSortOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  /**
   * Filters and sorts the member data and returns it
   */
  const getFilteredAndSortedMembers = () => {
    let filteredMembers = members;

    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter(member => {
        return member.mitgliedstatus.toString() === statusFilter;
      });
    }
    if (ressortFilter !== "") {
      filteredMembers = filteredMembers.filter(member => {
        return member.ressort === ressortFilter;
      });
    }
    filteredMembers = filteredMembers.filter(member => {
      return (
        member.vorname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.nachname.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.handy.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });

    if (nameSort === "up") {
      filteredMembers = filteredMembers.sort((a,b) => {
        return a.nachname.localeCompare(b.nachname);
      });
    } else if (nameSort === "down") {
      filteredMembers = filteredMembers.sort((a,b) => {
        return -a.nachname.localeCompare(b.nachname);
      });
    }

    if (statusSort === "up") {
      filteredMembers = filteredMembers.sort((a,b) => {
        if(a.mitgliedstatus < b.mitgliedstatus) {
          return -1;
        } else if (a.mitgliedstatus > b.mitgliedstatus) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (statusSort === "down") {
      filteredMembers = filteredMembers.sort((a,b) => {
        if(a.mitgliedstatus < b.mitgliedstatus) {
          return 1;
        } else if (a.mitgliedstatus > b.mitgliedstatus) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    return filteredMembers;
  };

  /**
   * Handles the filter toggle
   */
  const toggleFilters = () => {
    setAddtionalFiltersState(!additionalFiltersState);
  };

  /**
   * Toggles between the name sort options
   */
  const toggleNameSort = () => {
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
        setNameSort("up");
        break;
      }
    }
  };

  /**
   * Returns the sort icon for the name column
   */
  const getNameSortIcon = () => {
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

  /**
   * Toggles between the status sort options
   */
  const toggleStatusSort = () => {
    switch (statusSort) {
      case "": {
        setStatusSort("up");
        break;
      }
      case "up": {
        setStatusSort("down");
        break;
      }
      case "down": {
        setStatusSort("up");
        break;
      }
    }
  };

  /**
   * Returns the sort icon for the status column
   */
  const getStatusSortIcon = () => {
      switch (statusSort) {
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
        <MenuItem value={"Zuletzt Aktualisiert (aufsteigend)"}>Zuletzt Aktualisiert (aufsteigend)</MenuItem>
        <MenuItem value={"Zuletzt Aktualisiert (absteigend)"}>Zuletzt Aktualisiert (absteigend)</MenuItem>
      </TextField>
    </div>
  );


  return (
      <div className={classes.memberOverviewRoot}>
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
          <Grid item xs={6} sm={3}>
            <TextField
              label="Status"
              className={classes.statusFilter}
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
          <Grid item xs={6} sm={3} className="ressort-filter-main">
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
          <IconButton aria-label="more filter options" className={classes.filterBtn} onClick={toggleFilters}>
            {additionalFiltersState ? <RemoveCircle fontSize="inherit" /> : <AddCircle fontSize="inherit" />}
          </IconButton>
        </form>
        {additionalFiltersState ? additionalFilters : null}
      </Paper>
      <Paper className={classes.amountOfEntries}>
        {`${getFilteredAndSortedMembers().length} Einträge`}
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
                  Handy
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                  >
                  Mail
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                  >
                  <div className={classes.tableHeadSortBtn} onClick={toggleStatusSort}>
                    Status
                    {getStatusSortIcon()}
                  </div>
                </TableCell>
                <TableCell
                  className={classes.tableHeadCell}
                  >
                  Ressort
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredAndSortedMembers().map((member, i) => (
                <TableRow hover key={i}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {`${member.vorname} ${member.nachname}`}
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
  );
};

export default MemberOverview;