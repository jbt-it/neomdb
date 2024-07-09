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
import { TraineeProgressDto } from "../../../types/traineesTypes";
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
  "Angebot bei EV": "offerAtEv",
  "AP gehalten und abgegeben": "apHeld",
  "DL abgegeben": "dlAtEv",
  Projektmanagement: "projectManagement",
  "Rhetorik & Präsentationstechnik": "rhetoricPresentationTechnique",
  "Akquise & Verhandlungstechnik": "acquisitionNegotiationTechnique",
  "F&R": "departmentFinanceAndLaw",
  NET: "departmentNetwork",
  QM: "departmentQualityManagement",
  "MS PPT": "msPowerpoint",
  "Strategie und Organisation": "strategyAndOrganisation",
  Datenschutzschulung: "dataPrivacyTraining",
  Sicherheitsschulung: "safetyTraining",
  "MS Excel": "excelBasics",
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  trainee: TraineeProgressDto | undefined;
  admitTrainee: (memberID: number) => void;
}

/**
 * The AdmissionDialog component displays a dialog to confirm the admission of a trainee
 * @param open - boolean if the dialog is open
 * @param onClose - function to close the dialog
 * @param trainee - the trainee to be admitted
 * @param admitTrainee - (memberID: number) => void
 * @returns the dialog to confirm the admission of a trainee
 */
const AdmissionDialog: React.FunctionComponent<DialogProps> = ({ open, onClose, trainee, admitTrainee }) => {
  const handleAdmission = () => {
    if (trainee) {
      admitTrainee(trainee.memberID);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aufnahme</DialogTitle>
      <DialogContent>
        {trainee?.firstname} {trainee?.lastname} aufnehmen?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Abbrechen
        </Button>
        <Button onClick={handleAdmission} variant="contained">
          Aufnehmen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
interface Props {
  trainees: TraineeProgressDto[];
  admitTrainee: (memberID: number) => void;
}

/**
 * The TraineeSectionTable component displays the table to display the trainees of a generation and all checklists
 * @param trainees - Array of TraineeProgressDto
 * @param admitTrainee - function to admit a trainee
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
  const [selectedTrainee, setSelectedTrainee] = React.useState<TraineeProgressDto | undefined>();
  const { trainees, admitTrainee } = props;

  const handleAdmission = (trainee: TraineeProgressDto) => {
    setOpenAdmissionDialog(true);
    setSelectedTrainee(trainee);
  };

  // Check if all booleans are true and all dates are set
  function checkTraineeProgress(trainee: TraineeProgressDto): boolean {
    // Check if all booleans are true
    const booleanProperties = [
      trainee.offerAtEv,
      trainee.zpAtEv,
      trainee.apAtEv,
      trainee.dlAtEv,
      trainee.projectManagement,
      trainee.rhetoricPresentationTechnique,
      trainee.acquisitionNegotiationTechnique,
      trainee.departmentFinanceAndLaw,
      trainee.departmentNetwork,
      trainee.departmentQualityManagement,
      trainee.msPowerpoint,
      trainee.strategyAndOrganisation,
      trainee.dataPrivacyTraining,
      trainee.safetyTraining,
      trainee.excelBasics,
    ];

    const allBooleansTrue = booleanProperties.every((value) => Boolean(value) === true);

    // Check if all dates are set (not null)
    const dateProperties = [trainee.zpHeld, trainee.apHeld];

    const allDatesSet = dateProperties.every((date) => date !== null);

    return allBooleansTrue && allDatesSet;
  }

  return (
    <>
      <AdmissionDialog
        open={openAdmissionDialog}
        onClose={() => setOpenAdmissionDialog(false)}
        trainee={selectedTrainee}
        admitTrainee={admitTrainee}
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
            <TableRow key={trainee.memberID} sx={{ backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e4e4e4" }}>
              <TableCell sx={{ width: 150, border: 1, borderColor: "#fff" }}>
                <Link
                  component={RouterLink}
                  to={`/gesamtuebersicht/${trainee.memberID}`}
                  underline="none"
                  color="inherit"
                  sx={{ fontWeight: "bold" }}
                >
                  {trainee.firstname} {trainee.lastname}
                </Link>
              </TableCell>
              {columns.map((column) => {
                const key = columnKeyMapping[column];
                return (
                  <TableCell
                    key={`${trainee.memberID}-${key}`}
                    align="center"
                    sx={{
                      width: 10,
                      border: 1,
                      borderColor: "#fff",
                      padding: 0,
                    }}
                  >
                    {trainee[key as keyof TraineeProgressDto] ? (
                      <CheckBox color="primary" />
                    ) : (
                      <CheckBoxOutlineBlank color="primary" />
                    )}
                  </TableCell>
                );
              })}
              <TableCell sx={{ maxWidth: 100, width: 80, border: 1, borderColor: "#fff" }} align="right">
                {trainee.memberStatus?.name === "Trainee" && checkTraineeProgress(trainee) ? (
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
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TraineeSectionTable;
