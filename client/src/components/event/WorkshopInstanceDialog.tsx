import React from "react";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";

interface WorkshopInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const WorkshopInstanceDialog: React.FunctionComponent<WorkshopInstanceDialogProps> = ({
  open,
  onClose,
  onSave,
}: WorkshopInstanceDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
    handleClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>WorkshopInstanceDialog</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkshopInstanceDialog;
