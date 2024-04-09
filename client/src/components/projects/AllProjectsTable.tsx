import React from "react";
import { ProjectOverview } from "../../types/projectTypes";
import { Paper, useTheme, Table, TableCell, TableHead, TableRow, TableContainer } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import ProjectChip from "./projectCard/ProjectChip";
import { Link } from "react-router-dom";

interface AllProjectsTableProps {
  projects: ProjectOverview[];
}

/**
 * AllProjectsTable component to display all projects in a table
 * @param param - Projects to be displayed in a table
 * @returns - A table with all projects
 */
const AllProjectsTable = ({ projects }: AllProjectsTableProps) => {
  const theme = useTheme();
  const isMobile = useResponsive("down", "sm");

  // styles for the table
  const styles = {
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    tableHeaderCell: {
      fontWeight: "bold",
      color: "white",
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
  };

  // Display a smaller table for mobile devices
  if (isMobile) {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>Projektname</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          {projects.map((project) => (
            <TableRow
              key={project.projectID}
              sx={styles.tableRow}
              component={Link}
              to={`/projekt/${project.projectID}`}
            >
              <TableCell>{project.projectName}</TableCell>
              <TableCell>
                <ProjectChip status={project.projectStatus} />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    );
  }

  // Display a larger table for desktop devices
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={styles.tableHeader}>
          <TableRow>
            <TableCell sx={styles.tableHeaderCell}>Projektname</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Branche</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Unternehmen</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Kernkompetenz</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Beginn</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Ende</TableCell>
            <TableCell sx={styles.tableHeaderCell}>BT</TableCell>
            <TableCell sx={styles.tableHeaderCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        {projects.map((project) => (
          <TableRow key={project.projectID} sx={styles.tableRow} component={Link} to={`/projekt/${project.projectID}`}>
            <TableCell>{project.projectName}</TableCell>
            <TableCell>{project.projectSector}</TableCell>
            <TableCell>{project.projectCompany}</TableCell>
            <TableCell>{project.projectCoreCompetence}</TableCell>
            <TableCell>{project.projectStartDate.format("DD.MM.YYYY")}</TableCell>
            <TableCell>{project.projectEndDate.format("DD.MM.YYYY")}</TableCell>
            <TableCell>{project.projectNumberOfBT}</TableCell>
            <TableCell>
              <ProjectChip status={project.projectStatus} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </TableContainer>
  );
};

export default AllProjectsTable;
