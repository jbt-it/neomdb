import React from "react";
import { Close, Edit, Save } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";

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
        <IconButton onClick={handleSaveProject} color="primary">
          <Save />
        </IconButton>
        <IconButton onClick={handleCancelEdit} color="primary">
          <Close />
        </IconButton>
      </Stack>
    );
  } else {
    return (
      <IconButton onClick={handleEditProject} color="primary">
        <Edit />
      </IconButton>
    );
  }
};

export default MobileEditButtons;
