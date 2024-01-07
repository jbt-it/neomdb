import React from "react";
import { WorkshopInstance } from "../../types/eventTypes";
import { schulung_has_feedbackfragen } from "../../mock/events/schulung_has_feedbackfragen";
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Stack, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopInstanceQuestionsProps {
  workshopInstance: WorkshopInstance | undefined;
}

const WorkshopInstanceQuestions: React.FunctionComponent<WorkshopInstanceQuestionsProps> = ({ workshopInstance }) => {
  const isMobile = useResponsive("down", "sm");
  // Function to get the feedback questions
  const getFeedbackQuestions = () => {
    if (workshopInstance != undefined) {
      const result = schulung_has_feedbackfragen.find(
        (feedbackQuestion) =>
          feedbackQuestion.schulungsfeedback_schulungsfeedbackID === workshopInstance.schulungsinstanzID
      );
      return result;
    }
  };

  const feedbackQuestions = getFeedbackQuestions();

  if (workshopInstance === undefined || feedbackQuestions === undefined) {
    return <Skeleton height={400} />;
  }

  return (
    <Accordion sx={{ mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Feedbackfragen</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {feedbackQuestions.feedbackfragen.map((question) => (
          <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 0 : 1} sx={{ mb: isMobile ? 1 : 0 }}>
            <Typography fontWeight={"bold"}>Frage {question.feedbackfrageID}: </Typography>
            <Typography>{question.frage}</Typography>
          </Stack>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkshopInstanceQuestions;
