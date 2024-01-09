import React from "react";
import { Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Box } from "@mui/material";
import { Frage, ReferentenBewertung } from "../../types/eventTypes";
import { Link } from "react-router-dom";

interface WorkshopInstanceEvaluationTableProps {
  fragen: Frage[];
  referenten: ReferentenBewertung[];
  gesamt: number;
}

const WorkshopInstanceEvaluationTable: React.FunctionComponent<WorkshopInstanceEvaluationTableProps> = ({
  fragen,
  referenten,
  gesamt,
}) => {
  const uniqueSchulungsfeedbackIds = Array.from(
    new Set(fragen.flatMap((frage) => frage.bewertungen.map((b) => b.schulungsfeedback_has_schulungsfeedbackID)))
  );

  const averages = uniqueSchulungsfeedbackIds.map((id) => {
    const notes = [
      ...fragen.map((frage) => {
        const bewertung = frage.bewertungen.find((b) => b.schulungsfeedback_has_schulungsfeedbackID === id);
        return bewertung ? bewertung.note : 0;
      }),
      ...referenten.map((ref) => {
        const bewertung = ref.bewertungen.find((b) => b.schulungsfeedback_has_schulungsfeedbackID === id);
        return bewertung ? bewertung.note : 0;
      }),
    ].filter((note) => note !== 0 && note !== undefined);

    const sum = notes.reduce((a, b) => a + b, 0);
    const avg = sum / (notes.length || 1);

    return avg.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  return fragen.length > 0 ? (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ p: 0 }} />
            {fragen.map((frage) => (
              <TableCell
                key={frage.feedbackfrage_feedbackfrageID}
                style={{ verticalAlign: "bottom", fontWeight: "bold" }}
                align="center"
              >
                <Box sx={{ writingMode: "sideways-lr", whiteSpace: "normal", maxHeight: 200 }}>
                  Frage {frage.feedbackfrage_feedbackfrageID}
                </Box>
              </TableCell>
            ))}
            {referenten.map((ref) => (
              <TableCell key={ref.mitglied_mitgliedID} style={{ padding: 0, paddingBottom: 5, fontWeight: "bold" }}>
                <Link
                  to={`/gesamtuebersicht/${ref.mitglied_mitgliedID}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Box sx={{ writingMode: "sideways-lr", whiteSpace: "normal", maxHeight: 200, maxWidth: 50 }}>
                    {ref.vorname}
                    {ref.nachname}
                  </Box>
                </Link>
              </TableCell>
            ))}
            <TableCell style={{ verticalAlign: "bottom", fontWeight: "bold" }}>Durchschnitt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {uniqueSchulungsfeedbackIds.map((id, index) => (
            <TableRow key={id}>
              <TableCell sx={{ p: 0, fontWeight: "bold" }}> {index + 1}</TableCell>
              {fragen.map((frage) => {
                const bewertung = frage.bewertungen.find((b) => b.schulungsfeedback_has_schulungsfeedbackID === id);
                return (
                  <TableCell
                    key={frage.feedbackfrage_feedbackfrageID}
                    sx={{ paddingLeft: 1, borderLeft: 1, borderLeftColor: "#e4e4e4" }}
                    align="center"
                  >
                    {bewertung?.note === 0 ? "-" : bewertung?.note.toLocaleString("de-DE")}
                  </TableCell>
                );
              })}
              {referenten.map((ref) => {
                const bewertung = ref.bewertungen.find((b) => b.schulungsfeedback_has_schulungsfeedbackID === id);
                return (
                  <TableCell
                    key={ref.mitglied_mitgliedID}
                    sx={{ borderLeft: 1, borderLeftColor: "#e4e4e4" }}
                    align="center"
                  >
                    {bewertung?.note === 0 ? "-" : bewertung?.note.toLocaleString("de-DE")}
                  </TableCell>
                );
              })}
              <TableCell sx={{ borderLeft: 1, borderLeftColor: "#e4e4e4" }}>{averages[index]}</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ p: 0, borderTopColor: "black", borderTop: 2 }}>
            <TableCell sx={{ p: 0, pr: 1, color: "primary.main", fontWeight: "bold" }} align="left">
              Ø
            </TableCell>
            {fragen.map((frage) => (
              <TableCell sx={{ p: 0, fontWeight: "bold" }} align="center">
                {frage.durchschnitt.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            ))}
            {referenten.map((ref) => (
              <TableCell sx={{ p: 0, fontWeight: "bold" }} align="center">
                {ref.durchschnitt.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: "bold" }}>
              {gesamt.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

export default WorkshopInstanceEvaluationTable;
