import React, { FunctionComponent, useState } from "react";
import { Button } from "@mui/material";
import { Edit, Event } from "@mui/icons-material";

import WorkshopDialog from "./WorkshopDialog";

interface WorkshopButtonProps {
  edit?: boolean;
  workshopName?: string;
  workshopDescription?: string;
  workshopType?: "Pflichtworkshop" | "Workshop" | "Externer Workshop";
}

/**
 * Button to add a new workshop and open the corresponding dialog
 * @returns Button to add a new workshop and open the corresponding dialog
 */
const WorkshopButton: FunctionComponent<WorkshopButtonProps> = ({
  edit,
  workshopName,
  workshopDescription,
  workshopType,
}) => {
  const [addWorkshopDialogOpen, setAddWorkshopDialogOpen] = useState<boolean>(false);

  // Function to open the dialog
  const handleDialogOpen = () => {
    setAddWorkshopDialogOpen(true);
  };

  // Function to close the dialog
  const handleDialogClose = () => {
    setAddWorkshopDialogOpen(false);
  };

  // Function to save the workshop
  const handleSave = (
    name: string,
    description: string,
    type: "Pflichtworkshop" | "Workshop" | "Externer Workshop"
  ) => {
    alert("Workshop wurde gespeichert \nName: " + name + "\nBeschreibung: " + description + "\nArt: " + type);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={edit ? <Edit /> : <Event />}
        color={edit ? "primary" : "info"}
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={handleDialogOpen}
      >
        {edit ? "Bearbeiten" : "Neu"}
      </Button>
      <WorkshopDialog
        open={addWorkshopDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        workshopName={workshopName}
        workshopDescription={workshopDescription}
        workshopType={workshopType}
        edit={edit}
      />
    </>
  );
};

export default WorkshopButton;
