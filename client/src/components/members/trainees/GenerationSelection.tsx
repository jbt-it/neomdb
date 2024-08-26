import React from "react";
import { FormControl, Select, MenuItem, SelectChangeEvent, Typography, Stack } from "@mui/material";
import { Generation } from "../../../types/traineesTypes";

interface GenerationSelectionProps {
  selectedGeneration: string | null;
  handleGenerationChange: (event: SelectChangeEvent<string | null>) => void;
  generations: Generation[];
}

const GenerationSelection: React.FC<GenerationSelectionProps> = ({
  selectedGeneration,
  handleGenerationChange,
  generations,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Stack direction={"column"}>
      <Typography fontSize={12}>Traineegeneration:</Typography>
      <FormControl sx={{ width: 220 }} size="small">
        <Select value={selectedGeneration} onChange={handleGenerationChange} MenuProps={MenuProps} sx={{ height: 40 }}>
          {generations.length > 0 ? (
            generations.map((generation) => (
              <MenuItem key={generation.generationId} value={generation.description}>
                {generation.description}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Keine Traineegeneration gefunden</MenuItem>
          )}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default GenerationSelection;
