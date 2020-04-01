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
  RemoveCircle
} from "@material-ui/icons";
import api from "../utils/api";

// Dummy Data
const data = [
  {id: "1", name: "Lennart Rukower", handy: "00000001", mail: "l.rukower@mail.com", ressort: "IT", status: "Aktives Mitglied" },
  {id: "2", name: "Quentin Newald", handy: "00000002", mail: "q.newald@mail.com", ressort: "QM", status: "Aktives Mitglied" },
  {id: "3", name: "Christian Obst", handy: "00000003", mail: "c.obst@mail.com", ressort: "NET", status: "Aktives Mitglied" },
  {id: "4", name: "Lennart Rukower", handy: "00000001", mail: "l.rukower@mail.com", ressort: "IT", status: "Aktives Mitglied" },
  {id: "5", name: "Quentin Newald", handy: "00000002", mail: "q.newald@mail.com", ressort: "QM", status: "Aktives Mitglied" },
  {id: "6", name: "Christian Obst", handy: "00000003", mail: "c.obst@mail.com", ressort: "NET", status: "Aktives Mitglied" },
  {id: "7", name: "Lennart Rukower", handy: "00000001", mail: "l.rukower@mail.com", ressort: "IT", status: "Aktives Mitglied" },
  {id: "8", name: "Quentin Newald", handy: "00000002", mail: "q.newald@mail.com", ressort: "QM", status: "Aktives Mitglied" },
  {id: "9", name: "Christian Obst", handy: "00000003", mail: "c.obst@mail.com", ressort: "NET", status: "Aktives Mitglied" },
  {id: "10", name: "Lennart Rukower", handy: "00000001", mail: "l.rukower@mail.com", ressort: "IT", status: "Aktives Mitglied" },
  {id: "11", name: "Quentin Newald", handy: "00000002", mail: "q.newald@mail.com", ressort: "QM", status: "Aktives Mitglied" },
  {id: "12", name: "Christian Obst", handy: "00000003", mail: "c.obst@mail.com", ressort: "NET", status: "Aktives Mitglied" }
];

// Theme used to specify color for TextFields (and other MUI-components)
const theme = createMuiTheme({
  palette: {
    primary: {
      // Ci-orange as hex
      main: "#f6891f",
    },
  },
});

/**
 * Depicts a table with all members and a filter section to filter the members
 */
const MemberOverview = () => {

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [members, setMembers] = useState(data);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ressortFilter, setRessortFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Retrieves the members
  const getMembers = () => {
    // Api call
  };

  useEffect(() => getMembers(), []);

  // Handles the change event on the search filter input
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  // Handles the change event on the status filter input
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  // Handles the change event on the ressort filter input
  const handleRessortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRessortFilter(event.target.value);
  };

  // Handles the change event on the sort input
  const handleSortOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  // Filters the member data and returns it
  const getfilteredMembers = () => {
    let filteredMembers = members;

    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter(member => {
        return member.status === statusFilter;
      });
    }
    if (ressortFilter !== "") {
      filteredMembers = filteredMembers.filter(member => {
        return member.ressort === ressortFilter;
      });
    }
    filteredMembers = filteredMembers.filter(member => {
      return (
        member.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.mail.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.handy.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
    return filteredMembers;
  };

  // Handles the filter toggle
  const toggleFilters = () => {
    setAddtionalFiltersState(!additionalFiltersState);
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
    <ThemeProvider theme={theme}>
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
        {`${getfilteredMembers().length} Einträge`}
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
                    Name
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
                  Status
                </TableCell>
                <TableCell
                  className="table-head-cell"
                >
                  Ressort
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getfilteredMembers().map((member, i) => (
                <TableRow hover key={i}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {member.name}
                  </TableCell>
                  <TableCell>{member.handy}</TableCell>
                  <TableCell>{member.mail}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>{member.ressort}</TableCell>
                </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
    </ThemeProvider>
  );
};

export default MemberOverview;