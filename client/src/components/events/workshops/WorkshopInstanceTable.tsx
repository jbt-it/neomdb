import React from "react";
import { Divider, TableBody, Table, TableContainer, TableHead, TableRow, TableCell, Typography } from "@mui/material";

import { WorkshopInstance } from "../../../types/eventTypes";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface WorkshopInstanceTableProps {
  workshopInstances: WorkshopInstance[];
}

/**
 * Displays a table of workshop instances.
 * @param workshopInstances The workshop instances to display.
 * @returns A table of workshop instances.
 */
const WorkshopInstanceTable: React.FunctionComponent<WorkshopInstanceTableProps> = ({
  workshopInstances,
}: WorkshopInstanceTableProps) => {
  const workshopsWithNote = workshopInstances.filter(
    (workshop) => workshop.note !== null && workshop.note !== undefined
  );

  // Calculate average grade
  const average =
    workshopsWithNote.length > 0
      ? workshopsWithNote.reduce((acc, curr) => acc + curr.note, 0) / workshopsWithNote.length
      : "-";

  return (
    <>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Typography variant="h6" component="h2" gutterBottom fontWeight={"bold"}>
        Workshop-Termine
      </Typography>
      <TableContainer sx={{ mb: 5, borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", border: "1px solid white" }}>Datum</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", border: "1px solid white" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", border: "1px solid white" }}>Referenten</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", border: "1px solid white" }}># Teilnehmer</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", border: "1px solid white" }}>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workshopInstances.map((workshopInstance) => (
              <TableRow
                component={Link}
                to={`/workshops/${workshopInstance.schulungId}/${workshopInstance.schulungsinstanzID}`}
                key={workshopInstance.schulungsinstanzID}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0 }}>
                  {dayjs(workshopInstance.datum).format("DD.MM.YYYY")} / {workshopInstance.startzeit} -{" "}
                  {workshopInstance.endzeit}
                </TableCell>
                <TableCell sx={{ border: "1px solid grey", borderTop: 0 }}>{workshopInstance.status}</TableCell>
                <TableCell sx={{ border: "1px solid grey", borderTop: 0 }}>{workshopInstance.referenten}</TableCell>
                <TableCell sx={{ border: "1px solid grey", borderTop: 0 }}>
                  {workshopInstance.anzahlTeilnehmer}
                </TableCell>
                <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderRight: 0 }}>
                  {workshopInstance.note}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }}
              >
                Durchschnitt
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }} />
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }} />
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }} />
              <TableCell
                sx={{ fontWeight: "bold", border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }}
              >
                {average}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default WorkshopInstanceTable;
