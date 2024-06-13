import React from "react";
import { ProjectOverviewDto } from "../../../types/projectTypes";
import { Paper, useTheme, Table, TableCell, TableHead, TableRow, TableContainer, useMediaQuery } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";
import ProjectChip from "../projectCard/ProjectChip";
import { Link } from "react-router-dom";
import ProjectTableHeadCell from "../ProjectTableHeadCell";

interface AllProjectsTableProps {
  projects: ProjectOverviewDto[];
  sortedBy: string;
  onChangeSortBy: (column: string) => void;
}

/**
 * AllProjectsTable component to display all projects in a table
 * @param param - Projects to be displayed in a table
 * @returns - A table with all projects
 */
const AllProjectsTable = ({ projects, onChangeSortBy, sortedBy }: AllProjectsTableProps) => {
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

  // Display a smaller table for mobile devices
  if (isMobile) {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <ProjectTableHeadCell column="Projektname" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
              <ProjectTableHeadCell column="Status" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            </TableRow>
          </TableHead>
          {projects.map((project) => (
            <TableRow
              key={project.projectId}
              sx={styles.tableRow}
              component={Link}
              to={`/projekt/${project.projectId}`}
            >
              <TableCell sx={[styles.tableCell, { maxWidth: 150 }]}>{project.projectName}</TableCell>
              <TableCell sx={[styles.tableCell, { maxWidth: 200 }]}>
                <ProjectChip status={project.status} />
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
            <ProjectTableHeadCell column="Projektname" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Branche" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Unternehmen" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Kernkompetenz" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Beginn" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Ende" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="BT" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
            <ProjectTableHeadCell column="Status" sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
          </TableRow>
        </TableHead>
        {projects.map((project) => (
          <TableRow key={project.projectId} sx={styles.tableRow} component={Link} to={`/projekt/${project.projectId}`}>
            <TableCell sx={[styles.tableCell, { maxWidth: 200 }]}>{project.projectName}</TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 100 }]}>{project.industry.description}</TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 100 }]}>{project.client.name}</TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 100 }]}>
              {Array.isArray(project.coreCompetencies)
                ? project.coreCompetencies.map((cc) => cc.designation)
                : project.coreCompetencies.designation}
            </TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 100 }]}>
              {project.kickoff
                ? project.kickoff.format("DD.MM.YYYY")
                : project.tenderDate
                ? project.tenderDate.format("DD.MM.YYYY")
                : ""}
            </TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 100 }]}>
              {project.projectEnd ? project.projectEnd.format("DD.MM.YYYY") : ""}
            </TableCell>
            <TableCell align="right" sx={[styles.tableCell, { maxWidth: 50 }]}>
              {project.soldBT ? project.soldBT : `${project.estimatedProjectBTmin} - ${project.estimatedProjectBTmax}`}
            </TableCell>
            <TableCell sx={[styles.tableCell, { maxWidth: 200 }]}>
              <ProjectChip status={project.status} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </TableContainer>
  );
};

export default AllProjectsTable;
