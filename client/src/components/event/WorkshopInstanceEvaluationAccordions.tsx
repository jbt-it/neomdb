import React, { useEffect, useState } from "react";
import { NumericalWorkshopInstanceFeedback } from "../../types/eventTypes";
import { schulung_has_feedbackfrage } from "../../mock/events/schulung_has_feedbackfrage";
import dayjs from "dayjs";
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Stack, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { schulung_has_feedbackfragen } from "../../mock/events/schulung_has_feedbackfragen";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopInstanceEvaluationAccordionsProps {
  workshopInstanceID: number;
}

const WorkshopInstanceEvaluationAccordions: React.FunctionComponent<WorkshopInstanceEvaluationAccordionsProps> = ({
  workshopInstanceID,
}: WorkshopInstanceEvaluationAccordionsProps) => {
  const [numericalFeedback, setNumericFeedback] = useState<NumericalWorkshopInstanceFeedback[]>([]);
  const isMobile = useResponsive("down", "sm");

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

  const getFeedbackQuestions = () => {
    if (workshopInstanceID != undefined) {
      const result = schulung_has_feedbackfragen.find(
        (feedbackQuestion) => feedbackQuestion.schulungsfeedback_schulungsfeedbackID === workshopInstanceID
      );
      return result;
    }
  };

  const feedbackQuestions = getFeedbackQuestions();

  useEffect(() => {
    getWorkshopInstanceFeedback(workshopInstanceID);
  }, []);

  console.log(numericalFeedback.map((feedback) => feedback.feedback_noten));

  return feedbackQuestions != undefined ? (
    <>
      {numericalFeedback.map((feedback: NumericalWorkshopInstanceFeedback, index) => (
        <Accordion sx={{ maxWidth: isMobile ? "100%" : "90%" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="column">
              <Stack spacing={1} direction={"row"}>
                <Typography fontWeight={"bold"}>
                  Frage
                  {feedback.feedback_noten.find((question) => question.feedbackfrageID === index)?.feedbackfrageID}:
                </Typography>
                <Typography fontWeight={"bold"}>Durchschnitt</Typography>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
      ))}
    </>
  ) : null;
};

export default WorkshopInstanceEvaluationAccordions;
