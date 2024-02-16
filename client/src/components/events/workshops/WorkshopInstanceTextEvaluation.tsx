import React from "react";
import { TextFeedback } from "../../../types/eventTypes";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";

interface WorkshopInstanceTextEvaluationProps {
  textFeedback: TextFeedback[];
}

const WorkshopInstanceTextEvaluation: React.FunctionComponent<WorkshopInstanceTextEvaluationProps> = ({
  textFeedback,
}: WorkshopInstanceTextEvaluationProps) => {
  return (
    <Box sx={{ mt: 3, pb: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography fontWeight={"bold"} fontSize={18}>
        Textfeedback:
      </Typography>
      {textFeedback.map((feedback, index) => {
        return (
          <Box
            key={`TextFeedback-${index}`}
            sx={{ mt: 3, border: 1, borderColor: "secondary.main", borderRadius: 1, p: 2 }}
          >
            <Typography fontWeight={"bold"}>{feedback.frageText}</Typography>
            <List dense sx={{ listStyle: "square", pl: 2 }}>
              {feedback.kommentare.map((kommentar, index) => {
                return (
                  <ListItem key={`Comment-${index}`} sx={{ display: "list-item" }} disablePadding disableGutters>
                    <Typography>{kommentar}</Typography>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      })}
    </Box>
  );
};

export default WorkshopInstanceTextEvaluation;
