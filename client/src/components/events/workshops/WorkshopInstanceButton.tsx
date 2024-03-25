import { Button, IconButton } from "@mui/material";
import React from "react";
import WorkshopInstanceDialog from "./WorkshopInstanceDialog";
import { Delete, Edit, Event } from "@mui/icons-material";
import useResponsive from "../../../hooks/useResponsive";
import { Workshop, WorkshopInstance } from "../../../types/eventTypes";

interface WorkshopInstanceButtonProps {
  edit?: boolean;
  deletion?: boolean;
  workshopInstance?: WorkshopInstance;
  workshop?: Workshop;
}

/**
 * Displays a button to open a dialog to edit or delete a workshop instance.
 * @param edit Whether the button should be used to edit a workshop instance.
 * @param deletion Whether the button should be used to delete a workshop instance.
 * @returns A button to open a dialog to add, edit or delete a workshop instance.
 */
const WorkshopInstanceButton: React.FunctionComponent<WorkshopInstanceButtonProps> = ({
  edit,
  deletion,
  workshopInstance,
  workshop,
}: WorkshopInstanceButtonProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const isMobile = useResponsive("down", "sm");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Function to save the workshop instance
  // TODO: imlement saving
  const handleSave = () => {
    alert("Workshop wurde gespeichert");
  };

  // Function to delete the workshop instance
  // TODO: imlement deletion
  const handleDelete = () => {
    alert("Workshop wurde gelöscht");
  };

  // Deletion is true render a delete button, else render an edit button
  if (deletion) {
    return isMobile ? (
      <IconButton onClick={handleDelete}>
        <Delete color="error" />
      </IconButton>
    ) : (
      <Button
        variant="contained"
        color="error"
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={handleDelete}
        startIcon={<Delete />}
        size="small"
      >
        Workshop-Termin löschen
      </Button>
    );
  }

  return (
    <>
      {isMobile ? (
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={edit ? <Edit /> : <Event />}
          sx={{ fontSize: 10 }}
          color={edit ? "primary" : "info"}
        >
          {edit ? "bearbeiten" : "neu"}
        </Button>
      ) : (
        <Button
          variant="contained"
          color={edit ? "primary" : "info"}
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleOpen}
          startIcon={edit ? <Edit /> : <Event />}
          size="small"
        >
          {edit ? "Bearbeiten" : "Termin hinzufügen"}
        </Button>
      )}
      {workshop && (
        <WorkshopInstanceDialog
          workshop={workshop}
          workshopInstance={workshopInstance}
          open={open}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default WorkshopInstanceButton;
