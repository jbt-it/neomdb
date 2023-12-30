import React from "react";
import {
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  IconButton,
  Typography,
  Theme,
  Link,
  Card,
  Stack,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { AddCircleOutline, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

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

const rows = [
  {
    name: "Trainee 1",
    AngebotBeiEV: true,
    APgehalten: true,
    DLAbgegeben: true,
    Projektmanagement: true,
    Rhetorik: true,
    Akquise: true,
    FNR: true,
    NET: true,
    QM: true,
    MSPPT: true,
    Strategie: true,
    Datenschutz: true,
    Sicherheit: true,
    MSEXCEL: true,
  },
  {
    name: "Peter Zwegat",
    AngebotBeiEV: false,
    APgehalten: false,
    DLAbgegeben: false,
    Projektmanagement: false,
    Rhetorik: false,
    Akquise: false,
    FNR: false,
    NET: false,
    QM: false,
    MSPPT: false,
    Strategie: false,
    Datenschutz: false,
    Sicherheit: false,
    MSEXCEL: false,
  },
  {
    name: "Trainee 3",
    AngebotBeiEV: true,
    APgehalten: true,
    DLAbgegeben: true,
    Projektmanagement: true,
    Rhetorik: true,
    Akquise: true,
    FNR: true,
    NET: true,
    QM: true,
    MSPPT: true,
    Strategie: true,
    Datenschutz: true,
    Sicherheit: true,
    MSEXCEL: true,
  },
];

interface Row {
  [key: string]: string | boolean;
  name: string;
  AngebotBeiEV: boolean;
  APgehalten: boolean;
  DLAbgegeben: boolean;
  Projektmanagement: boolean;
  Rhetorik: boolean;
  Akquise: boolean;
  FNR: boolean;
  NET: boolean;
  QM: boolean;
  MSPPT: boolean;
  Strategie: boolean;
  Datenschutz: boolean;
  Sicherheit: boolean;
  MSEXCEL: boolean;
}

/**
 *
 * @returns the table to display the trainees of a generation
 */
const TraineeSectionTraineesTable = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Paper sx={{ padding: 3, maxWidth: 1200 }}>
      <Table size="small">
        <TableHead className={classes.tableHeader}>
          <TableRow sx={{ height: 300, verticalAlign: "bottom" }}>
            <TableCell sx={{ width: 150, border: 1, borderColor: "#fff" }}>
              <Typography color={"white"} fontWeight={"bold"}>
                Trainee
              </Typography>
            </TableCell>
            {columns.map((column) => (
              <TableCell sx={{ overflow: "hidden", border: 1, borderColor: "#fff" }}>
                <Box sx={{ transform: "rotate(-90deg)" }}>
                  <Typography sx={{ width: 10, color: "white", mb: 1 }} fontWeight="regular">
                    {column}
                  </Typography>
                </Box>
              </TableCell>
            ))}
            <TableCell sx={{ width: 30, border: 1, borderColor: "#fff" }}>
              <Typography color={"white"} fontWeight={"regular"}>
                Aufnehmen
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: Row, index) => (
            <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e4e4e4" }}>
              {Object.entries(row).map(([key, value], index) => {
                if (key === "name") {
                  return (
                    <TableCell key={index} sx={{ width: 150, border: 1, borderColor: "#fff" }}>
                      {value}
                    </TableCell>
                  );
                } else {
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
                      {/* <Checkbox defaultChecked={value as boolean} /> */}
                    </TableCell>
                  );
                }
              })}
              <TableCell sx={{ width: 30, border: 1, borderColor: "#fff" }}>
                <Box
                  onClick={() => {
                    console.log("aufgenommen");
                  }}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Typography fontWeight={"bold"} fontSize={12}>
                      Aufnehmen
                    </Typography>
                    <AddCircleOutline color="primary" fontSize="small" />
                  </Stack>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TraineeSectionTraineesTable;
