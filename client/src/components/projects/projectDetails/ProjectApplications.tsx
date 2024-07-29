import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { ProjectMembersDto } from "../../../types/projectTypes";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface ProjectApplicationsProps {
  applicants: ProjectMembersDto[];
}

const ProjectApplications = ({ applicants }: ProjectApplicationsProps) => {
  const isMobile = useResponsive("down", "sm");
  const theme = useTheme();

  const styles = {
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
    },
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
    tableCell: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      paddingRight: 0,
    },
  };

  return (
    <Box>
      <Typography sx={{ mb: 2 }}>Folgende Mitglieder haben sich bisher beworben:</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>Name, Vorname</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Mitgliedstatus</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Datum</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.memberId} sx={styles.tableRow}>
                <TableCell>
                  <Link
                    to={`/gesamtuebersicht/${applicant.memberId}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {applicant.lastname}, {applicant.firstname}
                  </Link>
                </TableCell>
                <TableCell>{applicant.memberStatus.name}</TableCell>
                <TableCell>{dayjs(applicant.applicationDate).format("DD.MM.YYYY")}</TableCell>
                <TableCell>
                  <Link
                    to={`/projekte/bewerbung/${applicant.memberId}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectApplications;
