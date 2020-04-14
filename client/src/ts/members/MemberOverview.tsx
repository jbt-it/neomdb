// The MemberOverview-Component displays a all members and filter-options

import React, {
  useState,
  useContext,
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
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core";
import {
  AddCircle,
  RemoveCircle,
  UnfoldMore,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import api from "../utils/api";

/**
 * Interface for the member object
 */
interface Member {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: number;
  ressort: string;

}

/**
 * Depicts a table with all members and a filter section to filter the members
 */
const MemberOverview = () => {

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
    <div className="additional-filters">
      <Grid item xs={6} sm={3} className="ressort-filter-additional">
        <TextField
          label="Ressort"
          className="filter-element"
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
        className="sort-element"
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
      <div className="member-overview-root">
      <Paper className="filter-container">
        <form className="filters" noValidate autoComplete="off">
        <Grid container spacing={8}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Name/Mail/..."
              className="filter-element"
              color="primary"
              onChange={handleSearchInput}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Status"
              className="status-filter"
              color="primary"
              onChange={handleStatusChange}
              value={statusFilter}
              select
            >
              <MenuItem value={""}>-</MenuItem>
              <MenuItem value={"Trainee"}>Trainee</MenuItem>
              <MenuItem value={"Aktives Mitglied"}>Aktives Mitglied</MenuItem>
              <MenuItem value={"Senior"}>Senior</MenuItem>
              <MenuItem value={"Passives Mitglied"}>Passives Mitglied</MenuItem>
              <MenuItem value={"Alumnus"}>Alumnus</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} className="ressort-filter-main">
            <TextField
              label="Ressort"
              className="filter-element"
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
          <IconButton aria-label="more filter options" className="filter-btn" onClick={toggleFilters}>
            {additionalFiltersState ? <RemoveCircle fontSize="inherit" /> : <AddCircle fontSize="inherit" />}
          </IconButton>
        </form>
        {additionalFiltersState ? additionalFilters : null}
      </Paper>
      <Paper className="amount-of-entries">
        {`${getFilteredAndSortedMembers().length} Einträge`}
      </Paper>
      <TableContainer
          component={Paper}
          style={
            // Table gets a fixed percentage of the total screen height
            { maxHeight: (window.screen.height - 40) * 0.8 }
          }
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  className="table-head-cell"
                >
                  <div className="table-head-sort-btn" onClick={toggleNameSort}>
                    Name
                    {getNameSortIcon()}
                  </div>
                </TableCell>
                <TableCell
                  className="table-head-cell"
                >
                  Handy
                </TableCell>
                <TableCell
                  className="table-head-cell"
                >
                  Mail
                </TableCell>
                <TableCell
                  className="table-head-cell"
                >
                  <div className="table-head-sort-btn" onClick={toggleStatusSort}>
                    Status
                    {getStatusSortIcon()}
                  </div>
                </TableCell>
                <TableCell
                  className="table-head-cell"
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