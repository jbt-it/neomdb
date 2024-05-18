import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

import { Workshop } from "../../../types/eventTypes";
import { Link } from "react-router-dom";
import EventChip from "../EventChip";

interface WorkshopsOverviewTableProps {
  workshops: Workshop[];
}

/**
 * Component to display a table of all workshops
 * @param workshops - all workshops to display
 * @returns all workshops in a table
 */
const WorkshopsOverviewTable = ({ workshops }: WorkshopsOverviewTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Art</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Workshopname</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Beschreibung</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workshops.map((workshop, index) => (
            <TableRow key={workshop.schulungId} sx={{ backgroundColor: index % 2 === 0 ? "white" : "grey.200" }}>
              <TableCell sx={{ width: 100 }}>
                <Link to={`/workshops/${workshop.schulungId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <EventChip type={workshop.art} size="small" />
                </Link>
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link to={`/workshops/${workshop.schulungId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {workshop.schulungsName}
                </Link>
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {workshop.beschreibung}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkshopsOverviewTable;
