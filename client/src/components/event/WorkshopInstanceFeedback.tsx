import React, { useState } from "react";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { NumericFeedback } from "../../types/eventTypes";
import useResponsive from "../../hooks/useResponsive";

import { schulung_has_feedbackfragen } from "../../mock/events/schulung_has_feedbackfragen";
import FeedbackSelection from "./FeedbackSelection";

interface WorkshopInstanceFeedbackProps {
  onSumbit: () => void;
  workshopInstanceID: number;
}

/**
 * Displays the feedback questions form for a workshop instance
 * @param onSumbit The function to call when the form is submitted
 * @param workshopInstanceID The id of the workshop instance
 * @returns The WorkshopInstanceFeedback component
 */
const WorkshopInstanceFeedback: React.FunctionComponent<WorkshopInstanceFeedbackProps> = ({
  onSumbit,
  workshopInstanceID,
}: WorkshopInstanceFeedbackProps) => {
  const [feedback, setFeedback] = useState<NumericFeedback[]>([]);
  const [feedbackValues, setFeedbackValues] = useState<{ [key: number]: string }>({});

  const isMobile = useResponsive("down", "sm");

  // Function to get the feedback questions
  const getFeedbackQuestions = () => {
    return schulung_has_feedbackfragen.find(
      (feedbackQuestion) => feedbackQuestion.schulungsfeedback_schulungsfeedbackID === workshopInstanceID
    );
  };
  const feedbackQuestions = getFeedbackQuestions();

  // Function to handle the feedback change
  const handleFeedbackChange = (feedbackfrageID: number, bewertung: number) => {
    setFeedback((prevFeedback) => [
      ...prevFeedback.filter((feedback) => feedback.feedbackfrageID !== feedbackfrageID),
      { feedbackfrageID, bewertung },
    ]);
  };

  // Function to handle the submit button and save the feedback
  const handleSubmit = () => {
    alert(feedback.map((feedback) => `${feedback.feedbackfrageID}: ${feedback.bewertung}`).join("\n"));
    alert(
      Object.entries(feedbackValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    );
    onSumbit();
  };

  return feedbackQuestions ? (
    <Grid container spacing={1} maxWidth={800}>
      {feedbackQuestions.feedbackfragen.map((question) => (
        <Grid container item xs={12}>
          <Grid item key={question.feedbackfrageID} xs={12} sm={9.7}>
            <Typography>{question.frage}</Typography>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ mt: isMobile ? 1 : 0 }}>
            <FeedbackSelection question={question} handleFeedbackChange={handleFeedbackChange} />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Divider />
          </Grid>
        </Grid>
      ))}
      {feedbackQuestions.schulungsfragen.map((question) => (
        <Grid container item xs={12} spacing={2} alignItems={"start"} sx={{ mt: 1 }}>
          <Grid item key={question.schulungsfrageID} xs={12}>
            <Typography>{question.frage}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Antwort"
              rows={4}
              InputLabelProps={{ shrink: true }}
              value={feedbackValues[question.schulungsfrageID] || ""}
              onChange={(event) =>
                setFeedbackValues({
                  ...feedbackValues,
                  [question.schulungsfrageID]: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      ))}
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth href={`/#/`}>
          Abbrechen
        </Button>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Absenden
        </Button>
      </Grid>
    </Grid>
  ) : (
    <Typography>Keine Fragen vorhanden</Typography>
  );
};

export default WorkshopInstanceFeedback;
