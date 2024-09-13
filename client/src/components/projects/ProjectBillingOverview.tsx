import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";
import React from "react";
import useProjects from "../../hooks/projects/useProjects";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";

/**
 * ProjectBillingOverview component to display the billing overview of all projects
 * @returns - A table with the billing overview of all projects
 */
const ProjectBillingOverview = () => {
  const { projectsInBilling } = useProjects();
  const theme = useTheme();

  // styles for the table
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
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={styles.tableHeader}>
          <TableCell sx={styles.tableHeaderCell}>Name</TableCell>
          <TableCell sx={styles.tableHeaderCell}>Status</TableCell>
          <TableCell sx={styles.tableHeaderCell}>APda</TableCell>
          <TableCell sx={styles.tableHeaderCell}>APmm</TableCell>
          <TableCell sx={styles.tableHeaderCell}>EE</TableCell>
          <TableCell sx={styles.tableHeaderCell}>DL</TableCell>
          <TableCell sx={styles.tableHeaderCell}>An</TableCell>
          <TableCell sx={styles.tableHeaderCell}>BV</TableCell>
          <TableCell sx={styles.tableHeaderCell}>TV</TableCell>
          <TableCell sx={styles.tableHeaderCell}>QM</TableCell>
          <TableCell sx={styles.tableHeaderCell}>VfM</TableCell>
          <TableCell sx={styles.tableHeaderCell}>GÜ</TableCell>
        </TableHead>
        <TableBody>
          {projectsInBilling.map((project) => (
            <TableRow
              key={project.projectId}
              sx={styles.tableRow}
              component={Link}
              to={`/projekte/${project.projectId}/projektabrechnung`}
            >
              <TableCell>{project.projectName}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>
                {project.APatEV ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.APHold ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.evaluationAtEV ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.DLatEV ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.offerInAlfresco ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.consultingContractProvided ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.teamContractProvided ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.qmApproval ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.freelancerContractExistingForAllMembers ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
              <TableCell>
                {project.moneyTransferredForAllMembers ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectBillingOverview;
