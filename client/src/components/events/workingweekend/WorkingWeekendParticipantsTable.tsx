import React from "react";
import { workingWeekendParticipants as participants } from "../../../mock/events/workingWeekendParticipants";
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { RemoveCircleOutline } from "@mui/icons-material";

/**
 * @typedef WorkingWeekendParticipant
 */
type WorkingWeekendParticipant = {
  event_eventID: number;
  mitglied_mitgliedID: number;
  name: string;
  anreise: string;
  abreise: string;
  auto: boolean;
  plaetze: number;
  vegetarier: boolean;
  kommentar: string;
  status: string;
};

/**
 * Table for displaying the participants of the working weekend and their respective information.
 * @returns table with participants of the working weekend
 */
const WorkingWeekendParticipantsTable: React.FunctionComponent = () => {
  const [workingWeekendParticipants, setWorkingWeekendParticipants] = React.useState<WorkingWeekendParticipant[]>([]);

  React.useEffect(() => {
    setWorkingWeekendParticipants(participants);
  }, []);

  // Function to map the arrival and departure of a participant to a string
  const mapAnUndAbreise = (tag: string, anreise: boolean): string => {
    switch (tag) {
      case "FrF":
        return "Fr früh";
      case "FrM":
        return "Fr Mittag";
      case "FrA":
        return "Fr Abend";
      case "SaF":
        return anreise ? "Sa Frühstück" : "Sa Vormittag";
      case "SaM":
        return "Sa Mittag";
      case "SaA":
        return "Sa Abend";
      case "So":
        return "So";
      default:
        return "Fehler";
    }
  };

  // Function to handle the sign out of a participant
  const handleSignOut = (id: number) => {
    alert("Abgemeldet " + id);
  };

  return (
    <TableContainer sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                border: "1px solid white",
                borderBottom: "1px solid black",
                minWidth: 200,
              }}
            >
              Name
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Anreise
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Geplante <br /> Abreise
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Auto
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Vegetarier
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Kommentar
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold", border: "1px solid white", borderBottom: "1px solid black" }}
            >
              Optionen
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workingWeekendParticipants.map((participant) => (
            <TableRow key={participant.mitglied_mitgliedID}>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0 }}>{participant.name}</TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, minWidth: 100 }}>
                {mapAnUndAbreise(participant.anreise, true)}
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, minWidth: 100 }}>
                {mapAnUndAbreise(participant.abreise, false)}
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0 }}>
                {participant.auto ? "Ja, " + participant.plaetze : "Nein"}
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0 }}>
                {participant.vegetarier ? "Ja" : "Nein"}
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0 }}>
                {participant.kommentar}
              </TableCell>
              <TableCell sx={{ border: "1px solid grey", borderTop: 0, borderLeft: 0, borderRight: 0 }}>
                <Chip
                  label="Abmelden"
                  color="error"
                  variant="outlined"
                  icon={<RemoveCircleOutline />}
                  onClick={() => handleSignOut(participant.mitglied_mitgliedID)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkingWeekendParticipantsTable;
