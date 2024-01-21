import React, { FunctionComponent, useState } from "react";
import { Button } from "@mui/material";
import { Edit, Event } from "@mui/icons-material";

import WorkshopDialog from "./WorkshopDialog";
import useResponsive from "../../../hooks/useResponsive";

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

  const isMobile = useResponsive("down", "sm");

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
      {isMobile ? (
        <Button
          variant="contained"
          onClick={handleDialogOpen}
          startIcon={edit ? <Edit /> : <Event />}
          sx={{ fontSize: 10 }}
          color={edit ? "primary" : "info"}
        >
          {edit ? "bearbeiten" : "neu"}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={handleDialogOpen}
          startIcon={edit ? <Edit /> : <Event />}
          sx={{ fontSize: 10 }}
          color={edit ? "primary" : "info"}
        >
          {edit ? "bearbeiten" : "neu"}
        </Button>
      )}
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
