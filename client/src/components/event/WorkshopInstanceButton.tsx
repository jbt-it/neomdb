import { Button, Icon, IconButton } from "@mui/material";
import React from "react";
import WorkshopInstanceDialog from "./WorkshopInstanceDialog";
import { Event } from "@mui/icons-material";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopInstanceButtonProps {
  edit?: boolean;
}

const WorkshopInstanceButton: React.FunctionComponent<WorkshopInstanceButtonProps> = ({
  edit,
}: WorkshopInstanceButtonProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const isMobile = useResponsive("down", "sm");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    alert("Workshop wurde gespeichert");
  };

  return (
    <>
      {isMobile ? (
        <IconButton onClick={handleOpen}>
          <Event color="info" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          color="info"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={handleOpen}
          startIcon={<Event />}
        >
          {edit ? "Bearbeiten" : "Neuer Termin"}
        </Button>
      )}
      <WorkshopInstanceDialog open={open} onClose={handleClose} onSave={handleSave} />
    </>
  );
};

export default WorkshopInstanceButton;
