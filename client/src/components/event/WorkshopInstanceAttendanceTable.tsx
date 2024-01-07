import React, { useState } from "react";
import { EventParticipant } from "../../types/eventTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopInstanceattendanceTableProps {
  participants: EventParticipant[];
  setIsEditingParticipants: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Table to display all participants of a workshop instance and select them for closing the admission
 * @param participants List of participants of a workshop instance
 * @param setIsEditingParticipants Function to set the state of the parent component to close the attendance list
 * @returns Table to display all participants of a workshop instance and select them for closing the admission
 */
const WorkshopInstanceAttendanceTable: React.FunctionComponent<WorkshopInstanceattendanceTableProps> = ({
  participants,
  setIsEditingParticipants,
}: WorkshopInstanceattendanceTableProps) => {
  const [selected, setSelected] = useState<EventParticipant[]>(
    participants.sort((a, b) => (a.anmeldedatum.isBefore(b.anmeldedatum) ? -1 : 1))
  );

  const isMobile = useResponsive("down", "sm");

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = participants;
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, participant: EventParticipant) => {
    const selectedIndex = selected.indexOf(participant);
    let newSelected: EventParticipant[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, participant);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (participant: EventParticipant) => selected.indexOf(participant) !== -1;

  const handleBack = () => {
    setIsEditingParticipants(false);
  };

  const handleComplete = () => {
    // POST request to close admission and send selected participants
    alert(
      "Anmeldung wurde geschlossen, folgende Teilnehmer wurden ausgewählt: " +
        selected.map((p) => p.vorname + p.nachname)
    );
    setIsEditingParticipants(false);
  };

  return (
    <>
      <Stack direction={isMobile ? "column" : "row"} alignItems={"flex-start"} sx={{ mb: 2 }} spacing={2}>
        <Stack direction={"row"} spacing={5}>
          <Button variant="contained" sx={{ fontWeight: 600 }} color="primary" onClick={handleBack}>
            Zurück
          </Button>
          <Button
            variant="contained"
            sx={{ fontWeight: 600 }}
            color="success"
            onClick={handleComplete}
            disabled={selected.length === 0}
          >
            Abschließen
          </Button>
        </Stack>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Teilnehmerliste
        </Typography>
      </Stack>
      <TableContainer component={Paper} sx={{ maxWidth: isMobile ? 350 : 500 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 18, maxWidth: isMobile ? 100 : 250 }}>
                Mitgliedstatus
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: 18, alignContent: "center", maxWidth: isMobile ? 20 : 200 }}
              >
                {isMobile ? "" : "Anwesend?"}
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < participants.length}
                  checked={participants.length > 0 && selected.length === participants.length}
                  onChange={handleSelectAllClick}
                  sx={{
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => {
              const isItemSelected = isSelected(participant);
              return (
                <TableRow
                  key={participant.mitgliedID}
                  selected={isItemSelected}
                  onClick={(event) => handleClick(event, participant)}
                >
                  <TableCell sx={{ height: 20 }}>
                    <Link
                      to={`/gesamtuebersicht/${participant.mitgliedID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {participant.vorname} {participant.nachname}
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ height: 20, maxWidth: isMobile ? 100 : 250 }}>
                    {participant.mitgliedstatus}
                  </TableCell>
                  <TableCell align="right" sx={{ height: 20, maxWidth: isMobile ? 20 : 250 }}>
                    <Checkbox checked={isItemSelected} sx={{ height: 20 }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default WorkshopInstanceAttendanceTable;
