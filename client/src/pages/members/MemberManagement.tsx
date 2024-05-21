/**
 * The MemberManagement-Component lets admins manually add members and change the status of existing members
 */
import React, { useState, useEffect } from "react";
import {
  Paper,
  Divider,
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
  Button,
  useTheme,
  Box,
  styled,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import api from "../../utils/api";
import { showSuccessMessage, showErrorMessage } from "../../utils/toastUtils";
import { replaceSpecialCharacters } from "../../utils/stringUtils";
import { MemberPartialDto } from "../../types/membersTypes";

// Create a styed form component
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
 * Options to create a new member and to change the status of members
 */
const MemberManagement: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MemberManagement
   */
  const styles = {
    // Header text of a paper marking a section of a page
    paperHeaderText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    // Header divider of a paper marking a section of a page
    paperHeaderDivider: {
      marginLeft: theme.spacing(1),
      width: "100%",
    },
    inputContainer: {
      padding: theme.spacing(1),
    },
    inputField: {
      width: "100%",
    },
    inputButton: {
      margin: theme.spacing(1),
    },
    amountOfEntries: {
      marginBottom: "10px",
      padding: "7px",
      textAlign: "center",
      fontWeight: "bold",
    },
    paperContainer: {
      marginBottom: "10px",
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

  const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
  const [members, setMembers] = useState<MemberPartialDto[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ressortFilter, setRessortFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Retrieves the members
  const getMembers: VoidFunction = () => {
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
      .catch(() => {
        showErrorMessage("Laden der Benutzer fehlgeschlagen");
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(() => getMembers(), []);

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
  const getFilteredAndSortedMembers = (): MemberPartialDto[] => {
    let filteredMembers = members;

    // Filters by status
    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.memberStatus.name.toString() === statusFilter;
      });
    }

    // Filters by ressort
    if (ressortFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.department.name === ressortFilter;
      });
    }

    // Filters by search input
    filteredMembers = filteredMembers.filter((member) => {
      return (
        searchFilter === null ||
        (member.firstname !== null && member.firstname.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (member.lastname !== null && member.lastname.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (member.mobile !== null && member.mobile.includes(searchFilter))
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

  /**
   * Changes the status of the member specified with the id
   * @param id The id of the member
   * @param status The status
   */
  const changeMemberStatus = (id: number, status: string) => {
    const payload = {
      memberStatus: status,
    };
    api
      .patch(`/members/${id}/status`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 204) {
          getMembers();
          showSuccessMessage("Mitgliedsstatus erfolgreich geändert");
        } else {
          showErrorMessage("Mitgliedsstatus Änderung fehlgeschlagen");
        }
      })
      .catch((error) => {
        showErrorMessage(error.message);
      });
  };

  /**
   * Creates a new member
   */
  const addMember = () => {
    if (firstName.trim().length <= 0) {
      showErrorMessage("Der Vorname darf nicht leer sein");
      return;
    }
    if (lastName.trim().length <= 0) {
      showErrorMessage("Der Nachname darf nicht leer sein");
      return;
    }
    if (email.trim().length <= 0) {
      showErrorMessage("Die E-Mail darf nicht leer sein");
      return;
    }

    const firstNameSanitized = replaceSpecialCharacters(firstName.trim().replace(" ", "-")).toLowerCase();
    const lastNameSanitized = replaceSpecialCharacters(lastName.trim().replace(" ", "-")).toLowerCase();
    const payload = {
      name: firstNameSanitized + "." + lastNameSanitized,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthday: null,
      mobile: null,
      gender: null,
      generationId: null,
      email: email,
    };

    api
      .post("members/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 201) {
          getMembers();
          showSuccessMessage("Mitglied erfolgreich hinzugefügt");
        } else {
          showErrorMessage("Mitglied konnte nicht hinzugefügt werden");
        }
      })
      .catch((error) => {
        showErrorMessage(error.message);
      });
  };

  /**
   * Handles the change event of the first name field
   * @param event
   */
  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  /**
   * Handles the change event of the last name field
   * @param event
   */
  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  /**
   * Handles the change event of the email field
   * @param event
   */
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  /**
   * The add member form
   */
  const addMemberForm = (
    <Paper sx={styles.paperContainer}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" sx={styles.paperHeaderText}>
            Neues Mitglied hinzufügen
          </Typography>
          <Divider sx={styles.paperHeaderDivider} />
        </Grid>
        <Grid item container xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={styles.inputContainer}>
            <TextField
              label="Vorname"
              sx={styles.inputField}
              color="primary"
              onChange={handleFirstName}
              value={firstName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={styles.inputContainer}>
            <TextField
              label="Nachname"
              sx={styles.inputField}
              color="primary"
              onChange={handleLastName}
              value={lastName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={styles.inputContainer}>
            <TextField
              label="Private E-Mail-Adresse"
              sx={styles.inputField}
              color="primary"
              onChange={handleEmail}
              value={email}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button variant="outlined" color="primary" sx={styles.inputButton} onClick={addMember}>
            Benutzer anlegen
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  /**
   * The additional filters
   */
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

  /**
   * The change status filter
   */
  const changeStatusFilter = (
    <Paper sx={styles.paperContainer}>
      <StyledForm noValidate autoComplete="off">
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography variant="h5" sx={styles.paperHeaderText}>
              Status eines Mitglieds ändern
            </Typography>
            <Divider sx={styles.paperHeaderDivider} />
          </Grid>
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
        <IconButton aria-label="more filter options" sx={styles.filterBtn} onClick={toggleFilters}>
          {additionalFiltersState ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
        </IconButton>
      </StyledForm>
      {additionalFiltersState ? additionalFilters : null}
      <Box sx={styles.amountOfEntries}>{`${getFilteredAndSortedMembers().length} Einträge`}</Box>
    </Paper>
  );

  /**
   * The change status table
   */
  const changeStatusTable = (
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell sx={styles.tableHeadCell}>
              <Box sx={styles.tableHeadSortBtn} onClick={toggleNameSort}>
                <>
                  <Typography variant="h6">Name</Typography>
                  {getNameSortIcon()}
                </>
              </Box>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography variant="h6">Handy</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography variant="h6">Mail</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography variant="h6">Status</Typography>
            </TableCell>
            <TableCell sx={styles.tableHeadCell}>
              <Typography variant="h6">Ressort</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getFilteredAndSortedMembers().map((member, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row">
                {`${member.firstname} ${member.lastname}`}
              </TableCell>
              <TableCell>{member.mobile}</TableCell>
              <TableCell>{member.jbtEmail}</TableCell>
              <TableCell>
                <TextField
                  label="Status"
                  sx={styles.filterElement}
                  color="primary"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    changeMemberStatus(member.memberId, event.target.value);
                  }}
                  value={member.memberStatus.name}
                  select
                >
                  <MenuItem value={"Trainee"}>Trainee</MenuItem>
                  <MenuItem value={"aktives Mitglied"}>aktives Mitglied</MenuItem>
                  <MenuItem value={"Senior"}>Senior</MenuItem>
                  <MenuItem value={"Alumnus"}>Alumnus</MenuItem>

                  <MenuItem value={"passives Mitglied"}>passives Mitglied</MenuItem>
                  <MenuItem value={"Ausgetretene"}>ausgetretenes Mitglied</MenuItem>
                </TextField>
              </TableCell>
              <TableCell>{member.department.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      {addMemberForm}
      {changeStatusFilter}
      {changeStatusTable}
    </div>
  );
};

export default MemberManagement;
