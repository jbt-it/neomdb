/**
 * The MemberManagement-Component lets admins manually add members and set status of existing members to resigned
 */
import React, {
    useState,
    useEffect
  } from "react";
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
    createStyles,
    Theme,
    makeStyles,
    Typography,
    Button,
  } from "@material-ui/core";
  import {
    UnfoldMore,
    ExpandLess,
    ExpandMore,
  } from "@material-ui/icons";
  import PageBar from "../global/navigation/PageBar";
  import api from "../utils/api";

  /**
   * Function which proivdes the styles of the MemberManagement
   */
  const useStyles = makeStyles((theme: Theme) => createStyles({
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
  const MemberManagement: React.FunctionComponent = () => {
    const classes = useStyles();

    const [additionalFiltersState, setAddtionalFiltersState] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [ressortFilter, setRessortFilter] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");
    const [nameSort, setNameSort] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [mentor, setMentor] = useState<string>("");
    const [traineeGeneration, setTraineeGeneration] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    // Retrieves the members
    const getMembers: VoidFunction = () => {
      // Variable for checking, if the component is mounted
      let mounted = true;
      api.get("/users/", {
        headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
      })
      .then((res) => {
        if (res.status === 200){
          if(mounted) {
            setMembers(res.data);
          }
        }
      }).catch((error) => {
        console.log(error);
      });

      // Clean-up function
      return () => {mounted = false;};
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
    const getFilteredAndSortedMembers = ():Member[] => {
      let filteredMembers = members;

      // Filters by status
      if (statusFilter !== "") {
        filteredMembers = filteredMembers.filter(member => {
          return member.mitgliedstatus.toString() === statusFilter;
        });
      }

      // Filters by ressort
      if (ressortFilter !== "") {
        filteredMembers = filteredMembers.filter(member => {
          return member.ressort === ressortFilter;
        });
      }

      // Filters by search input
      filteredMembers = filteredMembers.filter(member => {
        return (
          member.vorname.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.nachname.toLowerCase().includes(searchFilter.toLowerCase()) ||
          member.handy.toLowerCase().includes(searchFilter.toLowerCase())
        );
      });

      let sortedMembers = filteredMembers;

      // Sorts by last changed in ascending order
      if (sortOption === "lastchange ASC") {
        sortedMembers = sortedMembers.sort((a,b) => {
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
        sortedMembers = sortedMembers.sort((a,b) => {
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
        sortedMembers = sortedMembers.sort((a,b) => {
          return a.nachname.localeCompare(b.nachname);
        });
      // Sorts by lastname in descending alphabetical order
      } else if (nameSort === "down") {
        sortedMembers = sortedMembers.sort((a,b) => {
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
     * Handles the change event of the mentor field
     * @param event
     */
    const handleMentor = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setMentor(event.target.value);
    };

    /**
     * Handles the change event of the trainee generation field
     * @param event
     */
    const handleTraineeGeneration = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setTraineeGeneration(event.target.value);
    };

    /**
     * Handles the change event of the email field
     * @param event
     */
     const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEmail(event.target.value);
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
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.paperHeaderText}>
                    Neues Mitglied hinzufügen
                  </Typography>
                  <Divider className={classes.paperHeaderDivider}/>
                </Grid>
                <Grid container xs={12} sm={12} md={6} lg={6}>
                  <Grid item xs={12} sm={12} md={12} lg={6} className={classes.inputContainer}>
                    <TextField
                      label="Vorname"
                      className={classes.inputField}
                      color="primary"
                      onChange={handleFirstName}
                      value={firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6} className={classes.inputContainer}>
                    <TextField
                      label="Nachname"
                      className={classes.inputField}
                      color="primary"
                      onChange={handleLastName}
                      value={lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6} className={classes.inputContainer}>
                    <TextField
                      label="Private E-Mail-Adresse"
                      className={classes.inputField}
                      color="primary"
                      onChange={handleEmail}
                      value={email}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} sm={12} md={6} lg={6}>
                  <Grid item xs={12} sm={12} md={12} lg={6} className={classes.inputContainer}>
                      <TextField
                        label="Mentor"
                        className={classes.inputField}
                        color="primary"
                        onChange={handleMentor}
                        value={mentor}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} className={classes.inputContainer}>
                      <TextField
                        label="Trainee Generation"
                        className={classes.inputField}
                        color="primary"
                        onChange={handleTraineeGeneration}
                        value={traineeGeneration}
                        select
                      />
                    </Grid>
                  </Grid>

                <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="primary" className={classes.inputButton}>Benutzer anlegen</Button>
                  </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography variant="h5" className={classes.paperHeaderText}>
                    Status eines Mitglieds ändern
                  </Typography>
                  <Divider className={classes.paperHeaderDivider}/>
                </Grid>
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
              <IconButton aria-label="more filter options" className={classes.filterBtn} onClick={toggleFilters}>
                {additionalFiltersState ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
              </IconButton>
            </form>
            {additionalFiltersState ? additionalFilters : null}
            <div className={classes.amountOfEntries}>
            {`${getFilteredAndSortedMembers().length} Einträge`}
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
                      <Typography variant="h6">Name</Typography>
                      {getNameSortIcon()}
                    </div>
                  </TableCell>
                  <TableCell
                    className={classes.tableHeadCell}
                  >
                    <Typography variant="h6">Handy</Typography>
                  </TableCell>
                  <TableCell
                    className={classes.tableHeadCell}
                    >
                    <Typography variant="h6">Mail</Typography>
                  </TableCell>
                  <TableCell
                    className={classes.tableHeadCell}
                    >
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell
                    className={classes.tableHeadCell}
                    >
                    <Typography variant="h6">Ressort</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredAndSortedMembers().map((member, index) => (
                  <TableRow hover key={index}>
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
        <PageBar pageTitle="Mitgliederübersicht" />
      </div>
    );
  };

  export default MemberManagement;