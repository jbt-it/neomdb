import React from "react";
import { workingWeekendParticipants as participants } from "../../mock/events/workingWeekendParticipants";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

type WorkingWeekendParticipant = {
  mitglied_mitgliedID: number;
  name: string;
  anreise: string;
  abreise: string;
  auto: boolean;
  plaetze: number;
  vegetarier: boolean;
  kommentar: string;
};

const WorkingWeekendParticipantsTable: React.FunctionComponent = () => {
  const [workingWeekendParticipants, setWorkingWeekendParticipants] = React.useState<WorkingWeekendParticipant[]>([]);

  React.useEffect(() => {
    setWorkingWeekendParticipants(participants);
  }, []);

  function mapAnUndAbreise(tag: string) {
    switch (tag) {
      case "FrF":
        return "Fr früh";
      case "FrM":
        return "Fr Mittag";
      case "FrA":
        return "Fr Abend";
      case "SaF":
        return "Sa Vormittag";
      case "SaM":
        return "Sa Mittag";
      case "SaA":
        return "Sa Abend";
      case "So":
        return "So";
      default:
        return "Fehler";
    }
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Anreise</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Geplante <br /> Abreise
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Auto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Vegetarier</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kommentar</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Optionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workingWeekendParticipants.map((participant) => (
            <TableRow key={participant.mitglied_mitgliedID}>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{mapAnUndAbreise(participant.anreise)}</TableCell>
              <TableCell>{participant.abreise}</TableCell>
              <TableCell>{participant.auto ? "Ja, " + participant.plaetze : "Nein"}</TableCell>
              <TableCell>{participant.vegetarier ? "Ja" : "Nein"}</TableCell>
              <TableCell>{participant.kommentar}</TableCell>
              <TableCell>Abmelden</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkingWeekendParticipantsTable;
