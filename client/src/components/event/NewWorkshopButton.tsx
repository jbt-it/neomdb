import React, { FunctionComponent, useState } from "react";
import { Button } from "@mui/material";
import { Event } from "@mui/icons-material";

import AddWorkshopDialog from "./AddWorkshopDialog";

/**
 * Button to add a new workshop and open the corresponding dialog
 * @returns Button to add a new workshop and open the corresponding dialog
 */
const NewWorkshopButton: FunctionComponent = () => {
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
        startIcon={<Event />}
        color="info"
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={handleDialogOpen}
      >
        Neu
      </Button>
      <AddWorkshopDialog open={addWorkshopDialogOpen} onClose={handleDialogClose} onSave={handleSave} />
    </>
  );
};

export default NewWorkshopButton;
