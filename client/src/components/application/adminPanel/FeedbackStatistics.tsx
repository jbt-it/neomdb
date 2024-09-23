import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { FeedbackStatisticsDto } from "../../../types/applicationTypes";

/**
 * The interface FeedbackStatisticsProps
 */
interface FeedbackStatisticsProps {
  feedbackStatistics: FeedbackStatisticsDto;
}

/**
 * The FeedbackStatistics component displays the feedback statistics
 * @param feedbackStatistics The feedback statistics
 * @returns The FeedbackStatistics component
 */
const FeedbackStatistics = ({ feedbackStatistics }: FeedbackStatisticsProps) => {
  const theme = useTheme();

  const styles = {
    tableHeader: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
      ":hover": { cursor: "pointer" },
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
  };

  return (
    <>
      <Typography variant="h6" fontWeight={"bold"} textAlign={"start"} marginBottom={2}>
        Feedback
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow sx={{ maxWidth: 100 }}>
              <TableCell sx={styles.tableHeaderCell}>Werbekanal</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Anzahl Nennungen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Flyer</TableCell>
              <TableCell>{feedbackStatistics.flyer}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Plakate</TableCell>
              <TableCell>{feedbackStatistics.posters}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Vorlesungen</TableCell>
              <TableCell>{feedbackStatistics.lectures}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Freunde</TableCell>
              <TableCell>{feedbackStatistics.friends}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Internet</TableCell>
              <TableCell>{feedbackStatistics.internet}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Socialmedia</TableCell>
              <TableCell>{feedbackStatistics.socialMedia}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Infostand</TableCell>
              <TableCell>{feedbackStatistics.informationStand}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Campus Rallye</TableCell>
              <TableCell>{feedbackStatistics.campusRally}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Kooperationspartner</TableCell>
              <TableCell>{feedbackStatistics.partner}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Sonstiges (Anzahl)</TableCell>
              <TableCell>{feedbackStatistics.others}</TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Sonstiges (Nennungen)</TableCell>
              <TableCell>
                {feedbackStatistics.othersText.map(
                  (text, index) => `${text}${index < feedbackStatistics.othersText.length - 1 ? ", " : ""}`
                )}
              </TableCell>
            </TableRow>
            <TableRow sx={styles.tableRow}>
              <TableCell sx={{ fontWeight: "bold" }}>Gesamtbewerberzahl</TableCell>
              <TableCell>{feedbackStatistics.totalApplicants}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FeedbackStatistics;
