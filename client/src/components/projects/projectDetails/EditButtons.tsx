import React from "react";
import { Close, Edit, Save } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

interface EditButtonsProps {
  isEditMode: boolean;
  handleEditProject: () => void;
  handleCancelEdit: () => void;
  handleSaveProject: () => void;
}

/**
 * Component to render the edit buttons
 * @returns - The edit buttons
 */
const EditButtons = ({ isEditMode, handleEditProject, handleCancelEdit, handleSaveProject }: EditButtonsProps) => {
  if (isEditMode) {
    return (
      <Stack direction={"row"} alignItems={"center"}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleCancelEdit}
          startIcon={<Close />}
          size="small"
        >
          Abbrechen
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleSaveProject}
          startIcon={<Save />}
          size="small"
        >
          Speichern
        </Button>
      </Stack>
    );
  } else {
    return (
      <Button
        variant="outlined"
        color="primary"
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={handleEditProject}
        startIcon={<Edit />}
        size="small"
      >
        Bearbeiten
      </Button>
    );
  }
};

export default EditButtons;
