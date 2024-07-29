import React from "react";
import { Close, Edit, Save } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

interface MobileEditButtonsProps {
  isEditMode: boolean;
  handleEditProject: () => void;
  handleCancelEdit: () => void;
  handleSaveProject: () => void;
}

/**
 * Component to render the edit buttons
 * @returns - The edit buttons
 */
const MobileEditButtons = ({
  isEditMode,
  handleEditProject,
  handleCancelEdit,
  handleSaveProject,
}: MobileEditButtonsProps) => {
  if (isEditMode) {
    return (
      <Stack direction={"row"} alignItems={"center"}>
        <Button
          variant="outlined"
          onClick={handleCancelEdit}
          startIcon={<Close />}
          sx={{ fontSize: 10 }}
          color="primary"
        >
          Abbrechen
        </Button>
        <Button
          variant="outlined"
          onClick={handleSaveProject}
          startIcon={<Save />}
          sx={{ fontSize: 10 }}
          color="primary"
        >
          Speichern
        </Button>
      </Stack>
    );
  } else {
    return (
      <Button variant="outlined" onClick={handleEditProject} startIcon={<Edit />} sx={{ fontSize: 10 }} color="primary">
        Bearbeiten
      </Button>
    );
  }
};

export default MobileEditButtons;
