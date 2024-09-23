import {
  Box,
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
import React, { useContext } from "react";
import { ChangeRatingDto, TraineeEvaluationDto } from "../../../types/applicationTypes";
import {
  Cancel,
  CheckCircle,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context/AuthContext";

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
    icon: <SentimentSatisfied color="warning" />,
    label: "Neutral",
  },
  3: {
    icon: <SentimentVerySatisfied color="success" />,
    label: "Very Satisfied",
  },
};

/**
 * The interface TraineeApplicantsTableProps defines the props for the TraineeApplicantsTable component
 */
interface TraineeApplicantsTableProps {
  applicantsEvaluations: TraineeEvaluationDto[];
  deleteApplicant: (traineeApplicantId: number) => void;
  updateTraineeEvaluation: (evaluation: ChangeRatingDto) => void;
}

/**
 * The TraineeApplicantsTable component displays the table with the trainee applicants and the evaluations
 * @param param0
 * @returns
 */
const TraineeApplicantsTable = ({
  applicantsEvaluations,
  deleteApplicant,
  updateTraineeEvaluation,
}: TraineeApplicantsTableProps) => {
  const { auth } = useContext(AuthContext);

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

  /**
   * The IconContainer component displays the rating icons
   * @param props The props for the IconContainer component
   * @returns The IconContainer component
   */
  const IconContainer = (props: IconContainerProps) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  };

  /**
   * The handleUpdateRating function updates the rating of a trainee
   * @param traineeApplicantId The id of the trainee applicant
   * @param rating The new rating
   */
  const handleUpdateRating = (traineeApplicantId: number, rating: number | null) => {
    if (auth.userID === null) return;
    updateTraineeEvaluation({ traineeApplicantId, memberId: auth.userID, evaluation: rating });
  };

  return (
    <Stack>
      <Typography variant="h6" fontWeight={"bold"} textAlign={"start"} marginBottom={2}>
        Traineebewerbungen ({applicantsEvaluations.length})
      </Typography>
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
                    <Typography fontWeight={"bold"} fontSize={14} textAlign={"center"}>
                      Bewerbungsgespräch möglich
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14} textAlign={"center"}>
                          Freitag
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14} textAlign={"center"}>
                          Samstag
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontWeight={"bold"} fontSize={14} textAlign={"center"}>
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
                    defaultValue={evaluation.evaluations.find((e) => e.memberId === auth?.userID)?.evaluation}
                    IconContainerComponent={IconContainer}
                    max={3}
                    highlightSelectedOnly
                    onChange={(event, newValue) => {
                      handleUpdateRating(evaluation.traineeApplicantId, newValue);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Grid container>
                    <Grid item xs={4}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {evaluation.availabilitySelectionWeekend === "nichtFR" ? (
                          <Cancel color="error" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {evaluation.availabilitySelectionWeekend === "nichtSA" ? (
                          <Cancel color="error" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4} justifyContent={"center"}>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {evaluation.availabilitySelectionWeekend === "nichtSO" ? (
                          <Cancel color="error" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Stack alignItems={"cneter"} direction={"row"} justifyContent={"space-between"}>
                    {evaluation.workingWeekend ? (
                      <CheckCircle color="success" sx={{ pl: 5 }} />
                    ) : (
                      <Cancel color="error" sx={{ pl: 5 }} />
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        deleteApplicant(evaluation.traineeApplicantId);
                      }}
                    >
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
