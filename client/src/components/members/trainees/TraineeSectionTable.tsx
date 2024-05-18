import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Stack,
  Link,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Trainee, TraineeProgress } from "../../../types/traineesTypes";
import { Link as RouterLink } from "react-router-dom";

// all columns of the table
const columns = [
  "Angebot bei EV",
  "AP gehalten und abgegeben",
  "DL abgegeben",
  "Projektmanagement",
  "Rhetorik & Präsentationstechnik",
  "Akquise & Verhandlungstechnik",
  "F&R",
  "NET",
  "QM",
  "MS PPT",
  "Strategie und Organisation",
  "Datenschutzschulung",
  "Sicherheitsschulung",
  "MS Excel",
];

const columnKeyMapping: { [key: string]: string } = {
  "Angebot bei EV": "AngebotBeiEV",
  "AP gehalten und abgegeben": "APgehalten",
  "DL abgegeben": "DLbeiEV",
  Projektmanagement: "Projektmanagement",
  "Rhetorik & Präsentationstechnik": "Präsentationstechnik",
  "Akquise & Verhandlungstechnik": "AkquiseVerhandlungstechnik",
  "F&R": "FinanzenRecht",
  NET: "Netzwerke",
  QM: "Qualitätsmanagement",
  "MS PPT": "MSPowerpoint",
  "Strategie und Organisation": "StrategieOrganisation",
  Datenschutzschulung: "Datenschutzschulung",
  Sicherheitsschulung: "Sicherheitsschulung",
  "MS Excel": "ExcelGrundlagen",
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  trainee: Trainee | undefined;
}

/**
 * The AdmissionDialog component displays a dialog to confirm the admission of a trainee
 * @param param - open: boolean, onClose: () => void, trainee: Trainee | undefined
 * @returns the dialog to confirm the admission of a trainee
 */
const AdmissionDialog: React.FunctionComponent<DialogProps> = ({ open, onClose, trainee }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aufnahme</DialogTitle>
      <DialogContent>
        {trainee?.vorname} {trainee?.nachname} aufnehmen?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Abbrechen
        </Button>
        <Button onClick={onClose} variant="contained">
          Aufnehmen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
interface Props {
  trainees: TraineeProgress[];
}

/**
 * The TraineeSectionTable component displays the table to display the trainees of a generation and all checklists
 * @param props - trainees: Trainee[]
 * @returns the table to display the trainees of a generation
 */
const TraineeSectionTable: React.FunctionComponent<Props> = (props: Props) => {
  const theme = useTheme();

  const styles = {
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  };
  const [openAdmissionDialog, setOpenAdmissionDialog] = React.useState(false);
  const [selectedTrainee, setSelectedTrainee] = React.useState<Trainee | undefined>();
  const { trainees } = props;

  const handleAdmission = (trainee: Trainee) => {
    setOpenAdmissionDialog(true);
    setSelectedTrainee(trainee);
  };

  return (
    <>
      <AdmissionDialog
        open={openAdmissionDialog}
        onClose={() => setOpenAdmissionDialog(false)}
        trainee={selectedTrainee}
      />
      <Table size="small" component={Paper} sx={{ maxWidth: 1200 }}>
        <TableHead sx={styles.tableHeader}>
          <TableRow sx={{ height: 300, verticalAlign: "bottom" }}>
            <TableCell sx={{ minWidth: 130, width: 150, border: 1, borderColor: "#fff" }}>
              <Typography color={"white"} fontWeight={"bold"}>
                Trainee
              </Typography>
            </TableCell>
            {columns.map((column, index) => (
              <TableCell sx={{ overflow: "hidden", border: 1, borderColor: "#fff" }} key={index}>
                <Box sx={{ transform: "rotate(-90deg)" }}>
                  <Typography sx={{ maxWidth: 10, width: 3, color: "white", mb: 1 }} fontWeight="regular">
                    {column}
                  </Typography>
                </Box>
              </TableCell>
            ))}
            <TableCell sx={{ maxWidth: 80, width: 60, border: 1, borderColor: "#fff" }}>
              <Typography color={"white"} fontWeight={"regular"}>
                Aufnehmen
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainees.map((trainee, index) => (
            <TableRow key={trainee.mitgliedID} sx={{ backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e4e4e4" }}>
              <TableCell sx={{ width: 150, border: 1, borderColor: "#fff" }}>
                <Link
                  component={RouterLink}
                  to={`/gesamtuebersicht/${trainee.mitgliedID}`}
                  underline="none"
                  color="inherit"
                  sx={{ fontWeight: "bold" }}
                >
                  {trainee.vorname} {trainee.nachname}
                </Link>
              </TableCell>
              {columns.map((column) => {
                const key = columnKeyMapping[column];
                return (
                  <TableCell
                    key={`${trainee.mitgliedID}-${key}`}
                    align="center"
                    sx={{
                      width: 10,
                      border: 1,
                      borderColor: "#fff",
                      padding: 0,
                    }}
                  >
                    {trainee[key as keyof TraineeProgress] ? (
                      <CheckBox color="primary" />
                    ) : (
                      <CheckBoxOutlineBlank color="primary" />
                    )}
                  </TableCell>
                );
              })}
              <TableCell sx={{ maxWidth: 100, width: 80, border: 1, borderColor: "#fff" }} align="right">
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={1}
                  component={Button}
                  onClick={() => handleAdmission(trainee)}
                >
                  <Typography fontWeight={"bold"} fontSize={12} color={"black"}>
                    Aufnehmen
                  </Typography>
                  <AddCircleOutline color="primary" fontSize="small" />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TraineeSectionTable;
