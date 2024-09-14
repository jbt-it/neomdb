/**
 * The CompanyOverview-Component displays all companies in a table and displays options for filtering and sorting the companies
 */

import React, { useState, useContext } from "react";
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
  Typography,
  useTheme,
  Box,
  styled,
  Button,
} from "@mui/material";
import { UnfoldMore, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { CompanyDto } from "../../types/projectTypes";
import useCompanies from "../../hooks/useCompanies";
import useProjects from "../../hooks/projects/useProjects";

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
 * Depicts a table with all companies and a filter section to filter the companies
 */
const CompanyOverview: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which proivdes the styles of the CompanyOverview
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
    industryFilter: {
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
    industryFilterMain: {
      display: "block",
      "@media screen and (max-width: 350px)": {
        display: "none",
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
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [nameSort, setNameSort] = useState<string>("");
  const { allCompanies, allContactPartners } = useCompanies();
  const { allIndustries } = useProjects();
  const [sortOption, setSortOption] = useState<{ attribute: string; direction: "asc" | "desc" }>({
    attribute: "name",
    direction: "asc",
  });

  const { auth } = useContext(AuthContext);
  const hasCrmPermissions = doesPermissionsHaveSomeOf(auth.permissions, [13]);

  /**
   * Handles the change event on the search filter input
   * @param event
   */
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchFilter(event.target.value);
  };

  /**
   * Handles the change event on the industry filter input
   * @param event
   */
  const handleIndustryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIndustryFilter(event.target.value);
  };

  /**
   * Groups the contact partners by their company and returns a map
   */
  const getContactPartnersByCompany = (): { [key: number]: string } => {
    return allContactPartners.reduce((acc, contactPartner) => {
      const { companyId, name } = contactPartner;
      // If the company already exists in the accumulator, append the name to the existing string
      if (acc[companyId]) {
        acc[companyId] += `, ${name}`;
      } else {
        // Otherwise, create a new entry for the company
        acc[companyId] = name;
      }
      return acc;
    }, {} as { [key: number]: string });
  };

  const contactPartnersMap = getContactPartnersByCompany();

  /**
   * Filters and sorts the company data and returns it
   */
  const getFilteredAndSortedCompanies = (): CompanyDto[] => {
    let filteredCompanies = allCompanies;

    // Filter by industry
    if (industryFilter !== "") {
      filteredCompanies = filteredCompanies.filter((company) => {
        return company.industry.description.toString() === industryFilter;
      });
    }

    // Filter by search input
    filteredCompanies = filteredCompanies.filter((company) => {
      const contactPartners = contactPartnersMap[company.companyId] || "";
      return (
        company.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        company.url.toLowerCase().includes(searchFilter.toLowerCase()) ||
        company.industry.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        contactPartners.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });

    const sortByAttribute = (attribute: string, direction: "asc" | "desc") => {
      return (a: CompanyDto, b: CompanyDto) => {
        const aValue = a[attribute as keyof CompanyDto];
        const bValue = b[attribute as keyof CompanyDto];

        if (aValue === undefined) return direction === "asc" ? 1 : -1;
        if (bValue === undefined) return direction === "asc" ? -1 : 1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;

        return 0;
      };
    };

    //  return filteredCompanies.sort(sortByAttribute(sortOption.attribute, sortOption.direction));

    let sortedCompanies = filteredCompanies;

    // Sort by name
    if (nameSort === "up") {
      sortedCompanies = sortedCompanies.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (nameSort === "down") {
      sortedCompanies = sortedCompanies.sort((a, b) => {
        return -a.name.localeCompare(b.name);
      });
    }
    return sortedCompanies;
  };

  const handleSortChange = (attribute: string) => {
    setSortOption((prev) => ({
      attribute,
      direction: prev.attribute === attribute && prev.direction === "asc" ? "desc" : "asc",
    }));
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
      {hasCrmPermissions && (
        <Grid container spacing={3}>
          <Grid item>
            <Button sx={styles.button} variant="contained" component={Link} to={`/unternehmen/neu`}>
              Neuen Kunden anlegen
            </Button>
          </Grid>
        </Grid>
      )}
      <Paper sx={styles.filterContainer}>
        <StyledForm noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <TextField label="Suche" sx={styles.filterElement} color="primary" onChange={handleSearchInput} />
            </Grid>
            <Grid item xs={6} sm={3} sx={styles.industryFilterMain}>
              <TextField
                label="Branche"
                sx={styles.filterElement}
                color="primary"
                onChange={handleIndustryChange}
                value={industryFilter}
                select
              >
                <MenuItem value={""}>-</MenuItem>
                {Array.from(new Set(allIndustries.map((industry) => industry.description.toString()))).map(
                  (description, index) => (
                    <MenuItem key={index} value={description}>
                      {description}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
          </Grid>
        </StyledForm>
        <Box sx={styles.amountOfEntries}>{`${getFilteredAndSortedCompanies().length} Einträge`}</Box>
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
              <TableCell sx={styles.tableHeadCell}>Branche</TableCell>
              <TableCell sx={styles.tableHeadCell}>Webseite</TableCell>
              <TableCell sx={styles.tableHeadCell}>Ansprechpartner</TableCell>
              <TableCell sx={styles.tableHeadCell}>#Projekte</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredAndSortedCompanies().map((company, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  <Typography color="secondary">
                    <StyledLink to={`/unternehmen/${company.companyId}`}>{company.name}</StyledLink>
                  </Typography>
                </TableCell>
                <TableCell>{company.industry.description}</TableCell>
                <TableCell>{company.url}</TableCell>
                <TableCell>{contactPartnersMap[company.companyId]}</TableCell>
                <TableCell>{company.numberProjects}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyOverview;
