import React, { useState } from "react";
import { useMediaQuery, Button, IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import AddInternalProjectDialog from "./AddInternalProjectDialog";
import { Trainee } from "../../../types/traineesTypes";
import { Member } from "../../../types/membersTypes";

interface AddInternalProjectButtonProps {
  generationName: string | null;
  addInternalProject: (traineeIDs: number[], qmIDs: number[], projectName: string, projectShort: string) => void;
  trainees: Trainee[];
  members: Member[];
}

const AddInternalProjectButton = ({
  generationName,
  addInternalProject,
  trainees,
  members,
}: AddInternalProjectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isMobile ? (
        <Button variant="contained" startIcon={<AddCircle />} onClick={handleOpen} sx={{ height: 40 }}>
          Internes Projekt Hinzufügen
        </Button>
      ) : (
        <IconButton onClick={handleOpen} sx={{ height: 40 }}>
          <AddCircle color="primary" sx={{ width: 40, height: 40 }} />
        </IconButton>
      )}
      <AddInternalProjectDialog
        open={isOpen}
        handleDialogClose={handleClose}
        addInternalProject={addInternalProject}
        generationName={generationName}
        trainees={trainees}
        members={members}
      />
    </>
  );
};

export default AddInternalProjectButton;
