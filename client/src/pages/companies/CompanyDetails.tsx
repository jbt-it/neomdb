/**
 * The CompanyDetails-Component displays all companies in a table and displays options for filtering and sorting the companies
 */

import React, { useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  useTheme,
  styled,
  Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import useCompanyDetails from "../../hooks/useCompanyDetails";
import useProjectDetails from "../../hooks/projects/useProjectDetails";
import dayjs from "dayjs";

/**
 * Depicts a table with all companies and a filter section to filter the companies
 */
const CompanyDetails: React.FunctionComponent = () => {
  const theme = useTheme();

  /**
   * Function which provides the styles of the CompanyDetails
   */
  const styles = {
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
    tableContainer: {
      maxHeight: (window.screen.height - 75) * 0.8,
    },
    tableHeadCell: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
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
  const { companyDetails, allContactPartners } = useCompanyDetails(Number(id));
  const { allProjectDetails } = useProjectDetails(0);
  const filteredProjects = allProjectDetails.filter((project) => project.client.companyId === Number(id));
  const filteredContactPartners = allContactPartners.filter(
    (contactPartner) => contactPartner.companyId === Number(id)
  );
  const contactPartnerNames = filteredContactPartners.map((contactPartner) => contactPartner.name).join(", ");
  const coreCompetencies = filteredProjects
    .flatMap((project) => project.coreCompetencies.map((competency) => competency.designation))
    .join(", ");
  const { auth } = useContext(AuthContext);
  const hasCrmPermissions = doesPermissionsHaveSomeOf(auth.permissions, [13]);

  return (
    <div>
      <Grid container spacing={1} marginBottom={"50px"}>
        {hasCrmPermissions && (
          <Grid item>
            <Button sx={styles.button} variant="contained" component={Link} to={`/unternehmen/${id}/bearbeiten`}>
              Kunden bearbeiten
            </Button>
          </Grid>
        )}
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
        {hasCrmPermissions && (
          <Grid item container alignItems="center" spacing={0} xs={12}>
            <Grid item sx={{ width: "200px" }}>
              <Typography variant="body1">Wichtige Informationen:</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{companyDetails?.importantInformation}</Typography>
            </Grid>
          </Grid>
        )}
        <Grid item container alignItems="center" spacing={0} xs={12}>
          <Grid item sx={{ width: "200px" }}>
            <Typography variant="body1">Geheim:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{companyDetails?.classified ? "Ja" : "Nein"}</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" spacing={0} xs={12}>
          <Grid item sx={{ width: "200px" }}>
            <Typography variant="body1">Kontaktpersonen:</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{contactPartnerNames}</Typography>
          </Grid>
        </Grid>
      </Grid>
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
                <TableCell>{`${project.contactPerson?.name}`}</TableCell>
                <TableCell>{`${coreCompetencies}`}</TableCell>
                <TableCell>{dayjs(project.kickoff).format("DD.MM.YYYY")}</TableCell>
                <TableCell>{dayjs(project.projectEnd).format("DD.MM.YYYY")}</TableCell>
                <TableCell>{`${project.soldBT}`}</TableCell>
                <TableCell>{`${project.status}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item container marginBottom={"50px"}></Grid>
    </div>
  );
};

export default CompanyDetails;
