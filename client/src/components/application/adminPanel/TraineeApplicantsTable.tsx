import {
  Button,
  Grid,
  IconContainerProps,
  Paper,
  Rating,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { EvaluationDto } from "../../../types/applicationTypes";
import {
  Cancel,
  CheckCircle,
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

/**
 * The styled Rating component is used to style the rating icons
 */
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

/**
 * The customIcons object contains the icons for the different ratings
 */
const customIcons: {
  [index: string]: {
    icon: React.ReactElement<any>;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfied color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfied color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfied color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAlt color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfied color="success" />,
    label: "Very Satisfied",
  },
};

/**
 * The interface TraineeApplicantsTableProps defines the props for the TraineeApplicantsTable component
 */
interface TraineeApplicantsTableProps {
  applicantsEvaluations: EvaluationDto[];
}

/**
 * The TraineeApplicantsTable component displays the table with the trainee applicants and the evaluations
 * @param param0
 * @returns
 */
const TraineeApplicantsTable = ({ applicantsEvaluations }: TraineeApplicantsTableProps) => {
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
      ":hover": { cursor: "pointer" },
    },
    tableRow: {
      "&:nth-of-type(odd)": { backgroundColor: "#fff" },
      "&:nth-of-type(even)": { backgroundColor: "#ededed" },
      textDecoration: "none",
    },
  };

  /**
   * The IconContainer component displays the rating icons
   * @param props The props for the IconContainer component
   * @returns The IconContainer component
   */
  function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  return (
    <Stack>
      <Typography>
        Es sind bereits {applicantsEvaluations.length} Bewerbungen eingegangen. Bitte gib hier deine Bewertungen ab.
        Alle Änderungen werden sofort gespeichert.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCell}>Bewerber</TableCell>
              <TableCell sx={styles.tableHeaderCell}>Meine Bewertung</TableCell>
              <TableCell sx={styles.tableHeaderCell}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography fontWeight={"bold"} fontSize={14}>
                      Bewerbungsgespräch möglich
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14}>
                          Freitag
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14}>
                          Samstag
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14}>
                          Sonntag
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell sx={styles.tableHeaderCell}>Dabei beim WW?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicantsEvaluations.map((evaluation, index) => (
              <TableRow key={`${evaluation.firstName}-${evaluation.lastName}-${index}`} sx={styles.tableRow}>
                <TableCell>
                  <Link
                    to={`/traineebewerbungen/${evaluation.traineeApplicantId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {evaluation.lastName + ", " + evaluation.firstName}
                  </Link>
                </TableCell>
                <TableCell>
                  <StyledRating
                    defaultValue={evaluation.evaluation}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                  />
                </TableCell>
                <TableCell>
                  <Grid container>
                    <Grid item xs={4}>
                      {evaluation.availabilitySelectionWeekend === "nichtFR" ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {evaluation.availabilitySelectionWeekend === "nichtSA" ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {evaluation.availabilitySelectionWeekend === "nichtSO" ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Stack alignItems={"cneter"} direction={"row"} spacing={3}>
                    {evaluation.workingWeekend ? <Cancel color="error" /> : <CheckCircle color="success" />}
                    <Button size="small" variant="outlined" color="error">
                      Löschen
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default TraineeApplicantsTable;
