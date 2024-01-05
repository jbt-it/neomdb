import React, { FunctionComponent, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Delete, Edit, Event } from "@mui/icons-material";

import WorkshopDialog from "./WorkshopDialog";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopButtonProps {
  edit?: boolean;
  deletion?: boolean;
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
  deletion,
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

  if (deletion) {
    return isMobile ? (
      <IconButton onClick={() => alert("Workshop wurde gelöscht")}>
        <Delete color="error" />
      </IconButton>
    ) : (
      <Button
        variant="outlined"
        color="error"
        sx={{ fontWeight: 600, mr: 2 }}
        onClick={() => alert("Workshop wurde gelöscht")}
        startIcon={<Delete />}
        size="small"
      >
        Workshop löschen
      </Button>
    );
  }

  return (
    <>
      {isMobile ? (
        <IconButton onClick={handleDialogOpen} sx={{ ml: 1 }}>
          {edit ? <Edit color="secondary" /> : <Event color="info" />}
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          startIcon={edit ? <Edit /> : <Event />}
          color={edit ? "primary" : "info"}
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleDialogOpen}
          size="small"
        >
          {edit ? "Bearbeiten" : "Neu"}
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
