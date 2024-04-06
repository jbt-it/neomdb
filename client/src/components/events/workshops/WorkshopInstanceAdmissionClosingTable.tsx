import React, { useState } from "react";
import { EventParticipant } from "../../../types/eventTypes";
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
import useResponsive from "../../../hooks/useResponsive";

interface WorkshopInstanceAdmissionClosingTableProps {
  participants: EventParticipant[];
  setIsRegistrationClosing: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Table to display all participants of a workshop instance and select them for closing the admission
 * @param participants List of participants of a workshop instance
 * @param setIsRegistrationClosing Function to set the state of the parent component to close the admission
 * @returns Table to display all participants of a workshop instance and select them for closing the admission
 */
const WorkshopInstanceAdmissionClosingTable: React.FunctionComponent<WorkshopInstanceAdmissionClosingTableProps> = ({
  participants,
  setIsRegistrationClosing,
}: WorkshopInstanceAdmissionClosingTableProps) => {
  const [selected, setSelected] = useState<EventParticipant[]>(
    participants.sort((a, b) => (a.anmeldedatum.isBefore(b.anmeldedatum) ? -1 : 1))
  );

  const isMobile = useResponsive("down", "sm");

  // Function to select all participants
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = participants;
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Function to select a participant
  const handleClick = (event: React.MouseEvent<unknown>, participant: EventParticipant) => {
    const selectedIndex = selected.indexOf(participant);
    let newSelected: EventParticipant[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, participant);
    } else {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  // Function to check if a participant is selected
  const isSelected = (participant: EventParticipant) => selected.indexOf(participant) !== -1;

  // Function to go back to the previous page
  const handleBack = () => {
    setIsRegistrationClosing(false);
  };

  // Function to close admission and send selected participants
  const handleCloseAdmission = () => {
    // POST request to close admission and send selected participants
    alert(
      "Anmeldung wurde geschlossen, folgende Teilnehmer wurden ausgewählt: " +
        selected.map((p) => p.vorname + p.nachname)
    );
    setIsRegistrationClosing(false);
  };

  return (
    <>
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={"flex-start"}
        sx={{ mb: 2 }}
        spacing={isMobile ? 2 : 6}
      >
        <Stack direction={"row"} spacing={5}>
          <Button variant="contained" sx={{ fontWeight: 600 }} color="primary" onClick={handleBack}>
            Zurück
          </Button>
          <Button
            variant="contained"
            sx={{ fontWeight: 600 }}
            color="success"
            onClick={handleCloseAdmission}
            disabled={selected.length === 0}
          >
            Abschließen
          </Button>
        </Stack>
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Teilnehmerliste
        </Typography>
      </Stack>
      <TableContainer component={Paper} sx={{ maxWidth: isMobile ? 350 : 700 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: isMobile ? 14 : 18, maxWidth: isMobile ? 80 : 250 }}>
                Name
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: isMobile ? 14 : 18, maxWidth: isMobile ? 30 : 250 }}
              >
                {isMobile ? "Status" : "Mitgliedstatus"}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: isMobile ? 14 : 18, maxWidth: isMobile ? 50 : 250 }}
              >
                {isMobile ? "Anmeldung" : "Anmeldedatum"}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? 14 : 18,
                  alignContent: "center",
                  maxWidth: isMobile ? 20 : 250,
                }}
              >
                {isMobile ? "" : "Nimmt Teil"}
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
                  <TableCell sx={{ height: 20, maxWidth: isMobile ? 80 : 250 }}>
                    <Link
                      to={`/gesamtuebersicht/${participant.mitgliedID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {participant.vorname} {participant.nachname}
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ height: 20, maxWidth: isMobile ? 30 : 250 }}>
                    {participant.mitgliedstatus}
                  </TableCell>
                  <TableCell align="right" sx={{ height: 20, maxWidth: isMobile ? 50 : 250 }}>
                    {participant.anmeldedatum.format("DD.MM.YYYY HH:mm")}
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

export default WorkshopInstanceAdmissionClosingTable;
