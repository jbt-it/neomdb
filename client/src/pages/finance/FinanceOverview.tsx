/**
 * The FinanceOverview-Component displays all members in a table and displays options for filtering and sorting the members
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore, Edit, Save } from "@mui/icons-material";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { useContext } from "react";
import * as membersTypes from "../../types/membersTypes";
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
const FinanceOverview: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the FinanceOverview
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
    button: {
      marginTop: "20px",
      marginBottom: "20px",
      border: "0",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:hover": {
        color: "black",
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
    accountFilterMain: {
      "@media screen and (orientation:landscape)": {
        display: "block",
      },
      "@media screen and (orientation:portrait)": {
        display: "none",
      },
    },
    accountFilterAdditional: {
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
  const [memberFinanceData, setMemberFinanceData] = useState<membersTypes.MemberFinanceDataType[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [accountFilter, setAccountFilter] = useState<string>("allMembers");
  const [sortOption, setSortOption] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");

  const { dispatchAuth } = useContext(AuthContext);

  const [editState, setEditState] = useState<{ [key: number]: boolean }>({});
  const [editData, setEditData] = useState<{ [key: number]: { accountHolder: string; iban: string; bic: string } }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  const handleEditClick = (memberId: number, memberData: membersTypes.MemberFinanceDataType) => {
    setEditState({ ...editState, [memberId]: true });
    setEditData({
      ...editData,
      [memberId]: { accountHolder: memberData.accountHolder, iban: memberData.iban, bic: memberData.bic },
    });
  };

  const handleInputChange = (memberId: number, field: string, value: string) => {
    setEditData({ ...editData, [memberId]: { ...editData[memberId], [field]: value } });
  };

  const handleSaveClick = (memberId: number) => {
    setCurrentEditId(memberId);
    setOpenDialog(true);
  };

  const handleDialogClose = (confirm: boolean) => {
    if (confirm && currentEditId !== null) {
      const updatedMembers = memberFinanceData.map((member) => {
        if (member.memberId === currentEditId) {
          return { ...member, ...editData[currentEditId] };
        }
        return member;
      });
      setMemberFinanceData(updatedMembers);
    }
    setEditState({ ...editState, [currentEditId!]: false });
    setOpenDialog(false);
    setCurrentEditId(null);
  };

  // Retrieves the members
  const getMemberFinanceData: VoidFunction = useCallback(() => {
    setMemberFinanceData([
      {
        memberId: 1,
        lastName: "Smith",
        firstName: "John",
        memberStatus: "aktives Mitglied",
        accountHolder: "John Smith",
        iban: "DE89370400440532013000",
        bic: "COBADEFFXXX",
        lastchange: "2024-01-15T10:00:00Z",
      },
      {
        memberId: 2,
        lastName: "Doe",
        firstName: "Jane",
        memberStatus: "Trainee",
        accountHolder: "Jane Doe",
        iban: "FR7630006000011234567890189",
        bic: "AGRIFRPPXXX",
        lastchange: "2024-02-20T12:30:00Z",
      },
      {
        memberId: 3,
        lastName: "Brown",
        firstName: "Michael",
        memberStatus: "Senior",
        accountHolder: "Michael Brown",
        iban: "ES9121000418450200051332",
        bic: "BBVAESMMXXX",
        lastchange: "2024-03-10T14:45:00Z",
      },
      {
        memberId: 4,
        lastName: "Johnson",
        firstName: "Emily",
        memberStatus: "aktives Mitglied",
        accountHolder: "Emily Johnson",
        iban: "IT60X0542811101000000123456",
        bic: "INTBITMMXXX",
        lastchange: "2024-04-25T09:20:00Z",
      },
      {
        memberId: 5,
        lastName: "Williams",
        firstName: "Olivia",
        memberStatus: "passives Mitglied",
        accountHolder: "Olivia Williams",
        iban: "",
        bic: "DEUTDEFFXXX",
        lastchange: "2024-05-15T11:00:00Z",
      },
      {
        memberId: 6,
        lastName: "Taylor",
        firstName: "James",
        memberStatus: "Trainee",
        accountHolder: "James Taylor",
        iban: "NL91ABNA0417164300",
        bic: "",
        lastchange: "2024-06-01T08:50:00Z",
      },
    ]);
  }, [dispatchAuth]);

  useEffect(() => getMemberFinanceData(), [getMemberFinanceData]);

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
   * Handles the change event on the account filter input
   * @param event
   */
  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAccountFilter(event.target.value);
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
  const getFilteredAndSortedMembers = (): membersTypes.MemberFinanceDataType[] => {
    let filteredMembers = memberFinanceData;

    // Filters by status
    if (statusFilter !== "") {
      filteredMembers = filteredMembers.filter((member) => {
        return member.memberStatus.toString() === statusFilter;
      });
    }

    // Filters by account
    if (accountFilter !== "allMembers") {
      if (accountFilter === "hasAccount") {
        filteredMembers = filteredMembers.filter((member) => {
          return member.iban.toString() !== "" && member.bic.toString() !== "";
        });
      }
      if (accountFilter === "noAccount") {
        filteredMembers = filteredMembers.filter((member) => {
          return member.iban.toString() === "" || member.bic.toString() === "";
        });
      }
    }

    // Filters by search input
    filteredMembers = filteredMembers.filter((member) => {
      return (
        member.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchFilter.toLowerCase())
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
        return a.lastName.localeCompare(b.lastName);
      });
      // Sorts by lastname in descending alphabetical order
    } else if (nameSort === "down") {
      sortedMembers = sortedMembers.sort((a, b) => {
        return -a.lastName.localeCompare(b.lastName);
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
      <Grid container spacing={3}>
        <Grid item>
          <Button sx={styles.button} variant="contained" component={Link} to={`/jahresbeitrag/`}>
            Jahresbeitrag
          </Button>
        </Grid>
        <Grid item>
          <Button sx={styles.button} variant="contained" component={Link} to={`/wwbeitrag/`}>
            WW-Beitrag
          </Button>
        </Grid>
        <Grid item>
          <Button sx={styles.button} variant="contained" component={Link} to={`/sonstigereinzug/`}>
            Sonstiger Einzug
          </Button>
        </Grid>
      </Grid>
      <Paper sx={styles.filterContainer}>
        <StyledForm noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <TextField label="Name" sx={styles.filterElement} color="primary" onChange={handleSearchInput} />
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
            <Grid item xs={6} sm={3} sx={styles.accountFilterMain}>
              <TextField
                label="Kontodaten"
                sx={styles.filterElement}
                color="primary"
                onChange={handleAccountChange}
                value={accountFilter}
                select
              >
                <MenuItem value={"allMembers"}>alle Mitglieder</MenuItem>
                <MenuItem value={"noAccount"}>fehlende Kontodaten</MenuItem>
                <MenuItem value={"hasAccount"}>vorhandene Kontodaten</MenuItem>
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
              <TableCell sx={styles.tableHeadCell}>Status</TableCell>
              <TableCell sx={styles.tableHeadCell}>Inhaber</TableCell>
              <TableCell sx={styles.tableHeadCell}>IBAN</TableCell>
              <TableCell sx={styles.tableHeadCell}>BIC</TableCell>
              <TableCell sx={styles.tableHeadCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredAndSortedMembers().map((member, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  <Typography color="secondary">
                    <StyledLink
                      to={`/gesamtuebersicht/${member.memberId}`}
                    >{`${member.firstName} ${member.lastName}`}</StyledLink>
                  </Typography>
                </TableCell>
                <TableCell>{member.memberStatus}</TableCell>
                <TableCell>
                  {editState[member.memberId] ? (
                    <TextField
                      value={editData[member.memberId].accountHolder}
                      onChange={(e) => handleInputChange(member.memberId, "accountHolder", e.target.value)}
                    />
                  ) : (
                    member.accountHolder
                  )}
                </TableCell>
                <TableCell>
                  {editState[member.memberId] ? (
                    <TextField
                      value={editData[member.memberId].iban}
                      onChange={(e) => handleInputChange(member.memberId, "iban", e.target.value)}
                    />
                  ) : (
                    member.iban
                  )}
                </TableCell>
                <TableCell>
                  {editState[member.memberId] ? (
                    <TextField
                      value={editData[member.memberId].bic}
                      onChange={(e) => handleInputChange(member.memberId, "bic", e.target.value)}
                    />
                  ) : (
                    member.bic
                  )}
                </TableCell>
                <TableCell>
                  {editState[member.memberId] ? (
                    <IconButton onClick={() => handleSaveClick(member.memberId)}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditClick(member.memberId, member)}>
                      <Edit />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText>Änderungen speichern?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Nein
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinanceOverview;
