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
  Theme,
  Stack,
  Link,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { AddCircleOutline, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Trainee } from "../../../types/traineesTypes";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  })
);

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

// all checklist keys
const checklist = [
  "AngebotBeiEV",
  "APgehalten",
  "DLbeiEV",
  "Projektmanagement",
  "RhetorikPräsenationstechnik",
  "AkquiseVerhandlungstechnik",
  "FinanzenRecht",
  "Netzwerke",
  "Qualitätsmanagement",
  "MSPowerpoint",
  "StrategieOrganisation",
  "Datenschutzschulung",
  "Sicherheitsschulung",
  "ExcelGrundlagen",
];

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
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onClose}>Aufnehmen</Button>
      </DialogActions>
    </Dialog>
  );
};
interface Props {
  trainees: Trainee[];
}

/**
 * The TraineeSectionTable component displays the table to display the trainees of a generation and all checklists
 * @param props - trainees: Trainee[]
 * @returns the table to display the trainees of a generation
 */
const TraineeSectionTable: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [openAdmissionDialog, setOpenAdmissionDialog] = React.useState(false);
  const [selectedTrainee, setSelectedTrainee] = React.useState<Trainee | undefined>();
  const { trainees } = props;

  const handleAdmission = (trainee: Trainee) => {
    setOpenAdmissionDialog(true);
    setSelectedTrainee(trainee);
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 1200 }}>
      <AdmissionDialog
        open={openAdmissionDialog}
        onClose={() => setOpenAdmissionDialog(false)}
        trainee={selectedTrainee}
      />
      <Table size="small">
        <TableHead className={classes.tableHeader}>
          <TableRow sx={{ height: 300, verticalAlign: "bottom" }}>
            <TableCell sx={{ minWidth: 130, width: 150, border: 1, borderColor: "#fff" }}>
              <Typography color={"white"} fontWeight={"bold"}>
                Trainee
              </Typography>
            </TableCell>
            {columns.map((column) => (
              <TableCell sx={{ overflow: "hidden", border: 1, borderColor: "#fff" }}>
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
          {trainees.map((trainee: Trainee, index) => (
            <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e4e4e4" }}>
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
              {Object.entries(trainee).map(([key, value], index) => {
                if (checklist.includes(key)) {
                  return (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        width: 10,
                        border: 1,
                        borderColor: "#fff",
                        padding: 0,
                      }}
                    >
                      {value ? <CheckBox color="primary" /> : <CheckBoxOutlineBlank color="primary" />}
                    </TableCell>
                  );
                }
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
    </Paper>
  );
};

export default TraineeSectionTable;
