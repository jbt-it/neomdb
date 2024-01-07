import React, { useEffect, useState } from "react";
import { Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { NumericFeedback, NumericalWorkshopInstanceFeedback, WorkshopInstance } from "../../types/eventTypes";
import dayjs from "dayjs";
import { schulung_has_feedbackfrage } from "../../mock/events/schulung_has_feedbackfrage";

const useStyles = makeStyles({
  rotate: {
    writingMode: "sideways-lr",
    whiteSpace: "nowrap",
    width: 10,
    height: 40,
    border: 1,
  },
});

interface WorkshopInstanceEvaluationTableProps {
  workshopInstance: WorkshopInstance;
}

const WorkshopInstanceEvaluationTable: React.FunctionComponent<WorkshopInstanceEvaluationTableProps> = ({
  workshopInstance,
}) => {
  const classes = useStyles();
  const [numericalFeedback, setNumericFeedback] = useState<NumericalWorkshopInstanceFeedback[]>([]);

  const getWorkshopInstanceFeedback = (workshopInstanceID: number) => {
    const result = schulung_has_feedbackfrage.filter(
      (workshopinstance) => workshopinstance.schulung_schulungID === workshopInstanceID
    );

    const transformedResult: NumericalWorkshopInstanceFeedback[] = result.map((item) => {
      const feedback: NumericalWorkshopInstanceFeedback = {
        schulung_schulungID: item.schulung_schulungID,
        schulungsfeedback_has_schulungsfeedbackID: item.schulungsfeedback_has_schulungsfeedbackID,
        feedback_noten: item.feedback_noten.map((feedbackItem) => ({
          feedbackfrageID: feedbackItem.feedbackfrage_feedbackfrageID,
          bewertung: feedbackItem.note,
        })),
        referenten_feedback: item.referenten_feedback.map((referentenItem) => ({
          feedbackfrageID: referentenItem.mitgliedID,
          bewertung: referentenItem.note,
        })),
        schulungsfeedback_datum: dayjs(item.schulungsfeedback_datum),
      };
      return feedback;
    });

    setNumericFeedback(transformedResult);
  };

  useEffect(() => {
    getWorkshopInstanceFeedback(workshopInstance.schulungsinstanzID);
  }, []);

  console.log(numericalFeedback);

  return numericalFeedback.length > 0 ? (
    <TableContainer sx={{ pt: 10 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 50 }}>Datum</TableCell>
            {numericalFeedback.length > 0 &&
              numericalFeedback[0].feedback_noten.map((feedback, index) => (
                <TableCell key={index} sx={{ width: 10 }}>
                  <Box
                    sx={{
                      writingMode: "sideways-lr",
                      whiteSpace: "nowrap",
                      width: 10,
                      height: 40,
                      border: 1,
                    }}
                  >
                    Frage {feedback.feedbackfrageID}
                  </Box>
                </TableCell>
              ))}
            {numericalFeedback.length > 0 &&
              numericalFeedback[0].referenten_feedback.map((feedback, index) => (
                <TableCell key={index} sx={{ width: 10 }}>
                  <Box
                    sx={{
                      writingMode: "sideways-lr",
                      whiteSpace: "nowrap",
                      width: 10,
                      height: 40,
                      border: 1,
                    }}
                  >
                    Referent Feedback {feedback.feedbackfrageID}
                  </Box>
                </TableCell>
              ))}
            <TableCell>Gesamt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {numericalFeedback.map((feedback, index) => {
            const totalNotes = [...feedback.feedback_noten, ...feedback.referenten_feedback];
            const average = totalNotes.reduce((sum, note) => sum + note.bewertung, 0) / totalNotes.length;
            return (
              <TableRow key={index}>
                <TableCell sx={{ width: 50 }}>{feedback.schulungsfeedback_datum.format("DD.MM.YYYY")}</TableCell>
                {feedback.feedback_noten.map((note, index) => (
                  <TableCell key={index} sx={{ width: 10 }}>
                    {note.bewertung}
                  </TableCell>
                ))}
                {feedback.referenten_feedback.map((note, index) => (
                  <TableCell key={index} sx={{ width: 10 }}>
                    {note.bewertung}
                  </TableCell>
                ))}
                <TableCell>{average.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell sx={{ width: 50 }}>Durchschnitt</TableCell>
            {numericalFeedback[0].feedback_noten.map((_, index) => {
              const average =
                numericalFeedback.reduce((sum, feedback) => sum + feedback.feedback_noten[index].bewertung, 0) /
                numericalFeedback.length;
              return (
                <TableCell key={index} sx={{ width: 10 }}>
                  {average.toFixed(2)}
                </TableCell>
              );
            })}
            {numericalFeedback[0].referenten_feedback.map((_, index) => {
              const average =
                numericalFeedback.reduce((sum, feedback) => sum + feedback.referenten_feedback[index].bewertung, 0) /
                numericalFeedback.length;
              return (
                <TableCell key={index} sx={{ width: 10 }}>
                  {average.toFixed(2)}
                </TableCell>
              );
            })}
            <TableCell sx={{ width: 10 }}>
              {numericalFeedback
                .reduce(
                  (sum, feedback) =>
                    sum +
                    [...feedback.feedback_noten, ...feedback.referenten_feedback].reduce(
                      (sum, note) => sum + note.bewertung,
                      0
                    ) /
                      (feedback.feedback_noten.length + feedback.referenten_feedback.length),
                  0
                )
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

export default WorkshopInstanceEvaluationTable;
