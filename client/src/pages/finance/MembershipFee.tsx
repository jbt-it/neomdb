/**
 * The MembershipFee-Component displays all members in a table and displays options for filtering and sorting the members
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
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
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
const MembershipFee: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the MembershipFee
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
  const [sortOption, setSortOption] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");
  const [checkedMembers, setCheckedMembers] = useState<number[]>([]);
  const [radioState, setRadioState] = useState<boolean>(false);

  const { dispatchAuth } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  // Calculate the current year
  const currentYear = new Date().getFullYear();

  // Calculate the date 19 days from now
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 19);
  const day = String(futureDate.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(futureDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = futureDate.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Retrieves the members
  const getMemberFinanceData: VoidFunction = useCallback(() => {
    const data = [
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
    ];
    setMemberFinanceData(data);
    setCheckedMembers(data.map((member) => member.memberId));
  }, [dispatchAuth]);

  useEffect(() => getMemberFinanceData(), [getMemberFinanceData]);

  /**
   * Handles the checkbox checking
   */
  const handleCheckboxChange = (memberId: number) => {
    setCheckedMembers((prevState) => {
      const newCheckedState = [...prevState];
      if (newCheckedState.includes(memberId)) {
        const index = newCheckedState.indexOf(memberId);
        newCheckedState.splice(index, 1);
      } else {
        newCheckedState.push(memberId);
      }
      return newCheckedState;
    });
  };

  /**
   * Handles the button to set all checkboxes
   */
  const handleCheckboxAll = () => {
    setCheckedMembers((prevState) => {
      let newCheckedState = [...prevState];
      if (newCheckedState.length > 0) {
        newCheckedState.length = 0;
      } else {
        newCheckedState = memberFinanceData.map((member) => member.memberId);
      }
      return newCheckedState;
    });
  };

  /**
   * Handles the changes of the radio buttons
   */
  const handleRadioChange: VoidFunction = () => {
    setRadioState(!radioState);
  };

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
      <Grid container spacing={4} sx={{ paddingBottom: "20px" }}>
        <Grid item>
          <Button sx={styles.button} variant="contained" component={Link} to={`/finanzuebersicht/`}>
            Zurück
          </Button>
        </Grid>
        <Grid item>
          <Button sx={styles.button} variant="contained" onClick={() => setOpenDialog(true)}>
            SEPA-XML erstellen
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ paddingBottom: "10px" }}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ paddingRight: "200px" }}>
            <strong>Wichtige Information:</strong> Um einen Beitrag per SEPA-Lastschrift einzuziehen, müssen die
            betroffenen Mitglieder 2 Wochen vorab informiert werden. Dazu wird beim Generieren der SEPA-XML-Datei eine{" "}
            <strong>E-Mail verschickt</strong>, die jeden JBT-ler informiert, der etwas bezahlen muss. In der E-Mail
            enthalten sind der zu zahlende Betrag, die IBAN, von der abgebucht wird (zur Kontrolle), sowie ein Hinweis
            darauf, dass innerhalb von 14 Tagen <strong>widersprochen</strong> werden kann. Deswegen muss mit dem
            weiteren Verwenden der XML-Datei 14 Tage <strong>gewartet</strong> werden! Erst dann kann die Lastschrift
            veranlasst werden (z.B. in StarMoney), wobei darauf geachtet werden muss, dass die Bank weitere 2 Tage vor
            der eigentlichen Durchführung der Lastschrift die Datei bekommen muss. Dementsprechend weit in der Zukunft
            (14+2 Tage plus Puffer plus Wochenende) sollte das Ausführungsdatum liegen.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item container alignItems="center" spacing={2} xs={12}>
              <Grid item sx={{ width: "200px" }}>
                <Typography variant="body1">Verwendungszweck:</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  fullWidth
                  defaultValue={`JBT-Jahresbeitrag ${currentYear}`}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "36px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 14px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container alignItems="center" spacing={2} xs={12}>
              <Grid item sx={{ width: "200px" }}>
                <Typography variant="body1">ID der Abbuchung:</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  fullWidth
                  defaultValue={`JBT-JB-${currentYear}`}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "36px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 14px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container alignItems="center" spacing={2} xs={12}>
              <Grid item sx={{ width: "200px" }}>
                <Typography variant="body1">Ausführungsdatum:</Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  fullWidth
                  defaultValue={formattedDate}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "36px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 14px",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2} xs={12}>
              <Grid item sx={{ width: "200px" }}>
                <Typography variant="body1">Mails versenden:</Typography>
              </Grid>
              <Grid item xs>
                <RadioGroup row defaultValue="ja">
                  <FormControlLabel value="ja" control={<Radio />} label="Ja" onChange={() => handleRadioChange()} />
                  <FormControlLabel
                    value="nein"
                    control={<Radio />}
                    label="Nein"
                    onChange={() => handleRadioChange()}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
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
          </Grid>
          <IconButton aria-label="more filter options" sx={styles.filterBtn} onClick={toggleFilters} size="large">
            {additionalFiltersState ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
          </IconButton>
        </StyledForm>
        {additionalFiltersState ? additionalFilters : null}
        <Box sx={styles.amountOfEntries}>{`${getFilteredAndSortedMembers().length} Einträge`}</Box>
      </Paper>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button sx={styles.button} variant="contained" onClick={() => handleCheckboxAll()}>
          Alle {checkedMembers.length > 0 ? "abwählen" : "auswählen"}
        </Button>
      </div>
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
              <TableCell sx={styles.tableHeadCell}>Jahresbeitrag (30,00€) einziehen</TableCell>
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedMembers.includes(member.memberId)}
                        onChange={() => handleCheckboxChange(member.memberId)}
                      />
                    }
                    label=""
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={() => handleDialogClose()}>
        <DialogTitle>Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {radioState
              ? "WARNUNG: Es werden KEINE E-Mails an die ausgewählten Mitglieder gesendet. Dies muss noch gemacht werden, um das Gesetz einzuhalten"
              : "WARNUNG: Es werden E-Mails an alle ausgewählten Mitglieder gesendet"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose()} color="primary">
            Abbrechen
          </Button>
          <Button onClick={() => handleDialogClose()} color="primary">
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MembershipFee;
