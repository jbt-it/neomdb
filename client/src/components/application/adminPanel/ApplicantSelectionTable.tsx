import {
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { TraineeEvaluationDto } from "../../../types/applicationTypes";
import { Link } from "react-router-dom";
import { Cancel, CheckCircle, Mail } from "@mui/icons-material";

/**
 * The ApplicantSelectionTableProps interface defines the props for the ApplicantSelectionTable component
 */
interface ApplicantSelectionTableProps {
  applicantsEvaluations: TraineeEvaluationDto[];
  selectedApplicants: TraineeEvaluationDto[];
  setSelectedApplicants: React.Dispatch<React.SetStateAction<TraineeEvaluationDto[]>>;
  handleInviteApplicants: () => void;
}

/**
 * The ApplicantSelectionTable component displays a table with all applicants and the possibility to select them for the selection weekend
 * @param param0
 * @returns
 */
const ApplicantSelectionTable = ({
  applicantsEvaluations,
  selectedApplicants,
  setSelectedApplicants,
  handleInviteApplicants,
}: ApplicantSelectionTableProps) => {
  const styles = {
    tableHeader: {
      backgroundColor: "primary.main",
      color: "primary.contrastText",
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
  };

  // Sort the applicants by the sum of their evaluations
  const applicants = applicantsEvaluations.sort(
    (a, b) =>
      b.evaluations.reduce((acc, curr) => acc + curr.evaluation, 0) -
      a.evaluations.reduce((acc, curr) => acc + curr.evaluation, 0)
  );

  /**
   * The handleSelectApplicant function selects or deselects an applicant
   * @param traineeApplicantId The id of the trainee applicant
   */
  const handleSelectApplicant = (traineeApplicantId: number) => {
    const selected = selectedApplicants.some((selected) => selected.traineeApplicantId === traineeApplicantId);
    if (selected) {
      const newSelectedApplicants = selectedApplicants.filter(
        (selected) => selected.traineeApplicantId !== traineeApplicantId
      );
      setSelectedApplicants(newSelectedApplicants);
    } else {
      const newSelectedApplicants = [
        ...selectedApplicants,
        applicantsEvaluations.find((applicant) => applicant.traineeApplicantId === traineeApplicantId)!,
      ];
      setSelectedApplicants(newSelectedApplicants);
    }
  };

  /**
   * The functionAvailabilityText function returns the text for the availability
   * @param availability The availability of the applicant for the selection weekend
   * @returns The text for the availability
   */
  const functionAvailabilityText = (availability: "nichtFR" | "nichtSA" | "nichtSO" | "kannImmer" | null) => {
    switch (availability) {
      case "kannImmer":
        return "Kann immer";
      case "nichtFR":
        return "Nicht Freitag";
      case "nichtSA":
        return "Nicht Samstag";
      case "nichtSO":
        return "Nicht Sonntag";
      default:
        return "Nicht definiert";
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="h6" fontWeight={"bold"}>
          Bewerberauswahl
        </Typography>
        <Button variant="contained" size="small" onClick={handleInviteApplicants}>
          <Mail sx={{ mr: 2 }} />
          Einladungen abschicken
        </Button>
      </Stack>
      <Typography>
        Bitte wähle die Bewerber aus, die du zum Auswahlwochenende einladen möchtest. Alle Änderungen werden{" "}
        <strong>sofort gespeichert</strong>.
        <br />
        Wenn du fertig bist, kannst du mit den obigen Buttons eine PDF-Datei zum Ausdrucken aller eingeladenen Bewerber
        (für das Auswahlwochenende) erstellen und eine Mail an alle ausgewählten Bewerber schicken.
        <br />
        <br />
        <strong>Wichtig:</strong> Alle Bewerber sollten von allen Bewertern bewertet worden sein. Da sich die
        Gesamtbewertung als Summe berechnet, hätte ein Bewerber sonst weniger Punkte.
        <br />
        <br />
        Es wurden {selectedApplicants.length} von {applicantsEvaluations.length} Bewerbern ausgewählt.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>Einladen?</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Bewerber</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Gesamtbewertung</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Anzahl Bewertungen</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Auswahlwochenende</TableCell>
              <TableCell sx={styles.tableHeaderCell}>WW</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((evaluation, index) => (
              <TableRow key={`${evaluation.firstName}-${evaluation.lastName}-${index}`} sx={styles.tableRow}>
                <TableCell>
                  <Checkbox
                    checked={selectedApplicants.some(
                      (selected) => selected.traineeApplicantId === evaluation.traineeApplicantId
                    )}
                    size="small"
                    onChange={() => handleSelectApplicant(evaluation.traineeApplicantId)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    to={`/traineebewerbungen/${evaluation.traineeApplicantId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {evaluation.lastName + ", " + evaluation.firstName}
                  </Link>
                </TableCell>
                <TableCell>{evaluation.evaluations.reduce((acc, curr) => acc + curr.evaluation, 0)}</TableCell>
                <TableCell>{evaluation.evaluations.length}</TableCell>
                <TableCell>{functionAvailabilityText(evaluation.availabilitySelectionWeekend)}</TableCell>
                <TableCell>
                  {evaluation.workingWeekend ? <CheckCircle color="success" /> : <Cancel color="error" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default ApplicantSelectionTable;
