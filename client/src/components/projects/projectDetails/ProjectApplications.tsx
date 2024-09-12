import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
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
import { Cancel, GroupAdd, RestartAlt, Send } from "@mui/icons-material";

interface ProjectApplicationsProps {
  applicants: ProjectMembersDto[];
  handleShareApplications: () => void;
  handleTeamComposition: () => void;
  handleStartSecondApplicationPhase: () => void;
  handleCallOffProject: () => void;
  isApplicationOpen: boolean;
  isSecondApplicationPhase: boolean;
}

/**
 * ProjectApplications component for displaying project applications in a table
 * @param applicants - The list of members who applied for the project
 * @returns ProjectApplications component
 */
const ProjectApplications = ({
  applicants,
  handleShareApplications,
  handleTeamComposition,
  handleStartSecondApplicationPhase,
  handleCallOffProject,
  isApplicationOpen,
  isSecondApplicationPhase,
}: ProjectApplicationsProps) => {
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
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ borderColor: "#f6891f", mb: 2 }} />
      {isApplicationOpen ? null : (
        <Stack direction={"row"} sx={{ mb: 2 }} gap={4}>
          <Button
            variant="outlined"
            color="info"
            sx={{ fontWeight: 600, minHeight: 40 }}
            startIcon={<Send />}
            onClick={handleShareApplications}
            size={isMobile ? "large" : "small"}
          >
            {isMobile ? null : "Bewerbungen teilen"}
          </Button>
          <Button
            variant="outlined"
            color="success"
            sx={{ fontWeight: 600, minHeight: 40 }}
            startIcon={<GroupAdd />}
            onClick={handleTeamComposition}
            size={isMobile ? "large" : "small"}
          >
            {isMobile ? null : "Teamzusammenstellung"}
          </Button>
          {isSecondApplicationPhase ? null : (
            <Button
              variant="outlined"
              color="info"
              sx={{ fontWeight: 600, minHeight: 40 }}
              startIcon={<RestartAlt />}
              onClick={handleStartSecondApplicationPhase}
              size={isMobile ? "large" : "small"}
            >
              {isMobile ? null : "Zweite Bewerbungsphase"}
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            sx={{ fontWeight: 600, minHeight: 40 }}
            startIcon={<Cancel />}
            onClick={handleCallOffProject}
            size={isMobile ? "large" : "small"}
          >
            {isMobile ? null : "Absagen"}
          </Button>
        </Stack>
      )}
      <Typography sx={{ mb: 2 }}>Folgende Mitglieder haben sich bisher beworben:</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>Name, Vorname</TableCell>
              {!isMobile ? (
                <TableCell sx={styles.tableHeaderCell}>Mitgliedstatus</TableCell>
              ) : (
                <TableCell sx={styles.tableHeaderCell}>Details</TableCell>
              )}
              {!isMobile ? <TableCell sx={styles.tableHeaderCell}>Datum</TableCell> : null}
              {!isMobile ? <TableCell sx={styles.tableHeaderCell}>Details</TableCell> : null}
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
                {!isMobile ? <TableCell>{applicant.memberStatus.name}</TableCell> : null}
                {!isMobile ? <TableCell>{dayjs(applicant.applicationDate).format("DD.MM.YYYY")}</TableCell> : null}
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
