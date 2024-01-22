import React, { useState } from "react";
import { Button, Dialog, Divider, Grid, TextField, Typography } from "@mui/material";
import { NumericFeedback, WorkshopInstance } from "../../../types/eventTypes";
import useResponsive from "../../../hooks/useResponsive";

import { schulung_has_feedbackfragen } from "../../../mock/events/schulung_has_feedbackfragen";
import FeedbackSelection from "./FeedbackSelection";

interface WorkshopInstanceFeedbackFormProps {
  onSumbit: (
    numericFeedback: NumericFeedback[],
    textFeedback: {
      [key: number]: string;
    }
  ) => void;
  workshopInstance: WorkshopInstance;
  workshopType: string;
}

/**
 * Displays the feedback questions form for a workshop instance
 * @param onSumbit The function to call when the form is submitted
 * @param workshopInstance The workshop instance to display the feedback form for
 * @returns The WorkshopInstanceFeedbackForm component
 */
const WorkshopInstanceFeedbackForm: React.FunctionComponent<WorkshopInstanceFeedbackFormProps> = ({
  onSumbit,
  workshopInstance,
  workshopType,
}: WorkshopInstanceFeedbackFormProps) => {
  const isMobile = useResponsive("down", "sm");

  // Function to get the feedback questions
  const getFeedbackQuestions = () => {
    return schulung_has_feedbackfragen.find(
      (feedbackQuestion) =>
        feedbackQuestion.schulungsfeedback_schulungsfeedbackID === workshopInstance.schulungsinstanzID
    );
  };

  const feedbackQuestions = getFeedbackQuestions();

  // Function to get the initial feedback values
  const initialtextFeedback = feedbackQuestions?.schulungsfragen.reduce((acc, question) => {
    acc[question.schulungsfrageID] = "";
    return acc;
  }, {} as { [key: number]: string });
  const [textFeedback, setTextFeedback] = useState<{ [key: number]: string }>(initialtextFeedback || {});
  const [numericFeedback, setNumericFeedback] = useState<NumericFeedback[]>([]);
  const [checkAnswered, setCheckAnswered] = useState(false);
  const [open, setOpen] = useState(false);

  // Function to handle the feedback change
  const handleFeedbackChange = (feedbackfrageID: number, bewertung: number) => {
    setNumericFeedback((prevNumericFeedback) => [
      ...prevNumericFeedback.filter((numericFeedback) => numericFeedback.feedbackfrageID !== feedbackfrageID),
      { feedbackfrageID, bewertung },
    ]);
  };

  // Function to check if all questions have a selected value
  const allQuestionsAnswered = () => {
    return feedbackQuestions?.schulungsfragen.every((question) =>
      Object.prototype.hasOwnProperty.call(numericFeedback, question.schulungsfrageID)
    );
  };

  // Function to check if a specific question has a selected value
  const questionAnswered = (questionID: number) => {
    const answer = numericFeedback.find((numericFeedback) => numericFeedback.feedbackfrageID === questionID);
    return answer !== undefined;
  };

  // Function to handle the submit button and save the feedback
  const handleSubmit = () => {
    setCheckAnswered(true);
    if (!allQuestionsAnswered()) {
      setOpen(true);
      return;
    }
    onSumbit(numericFeedback, textFeedback);
  };

  return feedbackQuestions ? (
    <>
      <Grid container spacing={1} maxWidth={800}>
        {feedbackQuestions.feedbackfragen.map((question) => (
          <Grid container item xs={12}>
            <Grid item key={question.feedbackfrageID} xs={12} sm={9.7}>
              <Typography>{question.frage}</Typography>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ mt: isMobile ? 1 : 0 }}>
              <FeedbackSelection
                question={question}
                handleFeedbackChange={handleFeedbackChange}
                questionAnswered={questionAnswered}
                checkAnswered={checkAnswered}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>
          </Grid>
        ))}
        {workshopType !== "Externer Workshop" && workshopInstance.referenten ? (
          <Grid container item xs={12}>
            <Grid item xs={12} sm={9.7}>
              <Typography>Wie bewertest du die Referenten</Typography>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ mt: isMobile ? 1 : 0 }}>
              <FeedbackSelection
                question={{ feedbackfrageID: 8300 }}
                handleFeedbackChange={handleFeedbackChange}
                questionAnswered={questionAnswered}
                checkAnswered={checkAnswered}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider />
            </Grid>
          </Grid>
        ) : null}
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
                value={textFeedback[question.schulungsfrageID] || ""}
                onChange={(event) =>
                  setTextFeedback({
                    ...textFeedback,
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Typography sx={{ p: 2 }}>Bitte beantworte alle Fragen</Typography>
        <Button variant="contained" onClick={() => setOpen(false)} sx={{ mb: 2, ml: 2, mr: 2 }}>
          OK
        </Button>
      </Dialog>
    </>
  ) : (
    <Typography>Keine Fragen vorhanden</Typography>
  );
};

export default WorkshopInstanceFeedbackForm;
