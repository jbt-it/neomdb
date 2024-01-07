import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

interface FeedbackSelectionProps {
  question: { feedbackfrageID: number };
  handleFeedbackChange: (feedbackfrageID: number, bewertung: number) => void;
}

/**
 * Displays the feedback options
 * @returns The FeedbackSelection component
 */
const FeedbackSelection: React.FunctionComponent<FeedbackSelectionProps> = ({ question, handleFeedbackChange }) => {
  const [value, setValue] = useState<number>();

  // Function to handle the feedback change
  const handleChange = (event: SelectChangeEvent<number>) => {
    const newValue = event.target.value as number;
    setValue(newValue);
    handleFeedbackChange(question.feedbackfrageID, newValue);
  };

  return (
    <FormControl size="small" sx={{ width: 150 }}>
      <InputLabel>Bewertung</InputLabel>
      <Select label="Bewertung" value={value} onChange={handleChange}>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={0}>Keine Angabe</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FeedbackSelection;
