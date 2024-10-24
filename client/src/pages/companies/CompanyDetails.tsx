/**
 * The CompanyDetails-Component displays all companies in a table and displays options for filtering and sorting the companies
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
import { Link, useParams } from "react-router-dom";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { CompanyDetailsDto } from "../../types/projectTypes";
import useCompanyDetails from "../../hooks/useCompanyDetails";
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
const CompanyDetails: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which provides the styles of the CompanyDetails
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

  const { id } = useParams();
  const { companyDetails } = useCompanyDetails(Number(id));
  const { allProjects } = useProjects();
  const filteredProjects = allProjects.filter((project) => project.client.companyId === Number(id));
  const { auth } = useContext(AuthContext);
  const hasCrmPermissions = doesPermissionsHaveSomeOf(auth.permissions, [13]);

  return (
    <div>
      {hasCrmPermissions && (
        <Grid container spacing={3} marginBottom={"50px"}>
          <Grid item>
            <Button sx={styles.button} variant="contained" component={Link} to={`/unternehmen/${id}/bearbeiten`}>
              Kunden bearbeiten
            </Button>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Name:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.name}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Branche:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.industry.description}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Kurzbeschreibung:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.shortDescription}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Adresszusatz:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.addressAdditional}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Straße/Nr:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.street}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">PLZ:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.postalCode}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Ort:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.city}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Website:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.url}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Wichtige Informationen:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.importantInformation}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Geheim:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.classified ? "Ja" : "Nein"}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeadCell}>Name</TableCell>
              <TableCell sx={styles.tableHeadCell}>Ansprechpartner</TableCell>
              <TableCell sx={styles.tableHeadCell}>Kernkompetenz</TableCell>
              <TableCell sx={styles.tableHeadCell}>Beginn</TableCell>
              <TableCell sx={styles.tableHeadCell}>Ende</TableCell>
              <TableCell sx={styles.tableHeadCell}>BT</TableCell>
              <TableCell sx={styles.tableHeadCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  <Typography color="secondary">
                    <StyledLink to={`/projekte/${project.projectId}`}>{`${project.projectName}`}</StyledLink>
                  </Typography>
                </TableCell>
                <TableCell>{`${project.projectName}`}</TableCell>
                <TableCell>{`${project.projectName}`}</TableCell>
                <TableCell>{`${project.kickoff}`}</TableCell>
                <TableCell>{`${project.projectEnd}`}</TableCell>
                <TableCell>{`${project.soldBT}`}</TableCell>
                <TableCell>{`${project.status}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyDetails;
