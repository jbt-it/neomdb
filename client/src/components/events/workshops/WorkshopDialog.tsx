import React, { FunctionComponent, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

interface WorkshopDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, type: "Pflichtworkshop" | "Workshop" | "Externer Workshop") => void;
  workshopName?: string;
  workshopDescription?: string;
  workshopType?: "Pflichtworkshop" | "Workshop" | "Externer Workshop";
  edit?: boolean;
}

/**
 * Dialog Component to add a new workshop
 * @param open - boolean to determine if the dialog is open
 * @param onClose - function to close the dialog
 * @param onSave - function to save the workshop
 * @param workshopName - name of the workshop
 * @param workshopDescription - description of the workshop
 * @param workshopType - type of the workshop
 * @returns Dialog to add a new workshop
 */
const WorkshopDialog: FunctionComponent<WorkshopDialogProps> = ({
  open,
  onClose,
  onSave,
  workshopName,
  workshopDescription,
  workshopType,
  edit,
}: WorkshopDialogProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<"Pflichtworkshop" | "Workshop" | "Externer Workshop" | undefined>(undefined);
  const [nameError, setNameError] = useState<boolean>(false);
  const [typeError, setTypeError] = useState<boolean>(false);

  function resetData() {
    if (edit) {
      setName(workshopName || "");
      setDescription(workshopDescription || "");
      setType(workshopType || undefined);
      setNameError(false);
      setTypeError(false);
    } else {
      setName("");
      setDescription("");
      setType(undefined);
      setNameError(false);
      setTypeError(false);
    }
  }

  useEffect(() => {
    resetData();
  }, [workshopName, workshopDescription, workshopType]);

  // Function to handle the Abbrechen button
  const handleClose = () => {
    resetData();
    onClose();
  };

  // Function to handle the Speichern button
  const handleSave = () => {
    setNameError(false);
    setTypeError(false);
    if (name.length === 0 || type === undefined) {
      if (name.length === 0) {
        setNameError(true);
      }
      if (type === undefined) {
        setTypeError(true);
      }
      return;
    }
    onSave(name, description, type);
    handleClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{edit ? "Workshop bearbeiten" : "Workshop hinzufügen"}</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"center"} spacing={2}>
          <Grid container item alignItems={"center"}>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={"bold"}>Name:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {nameError && (
                <Typography color={"error"} fontSize={12}>
                  Bitte gib einen Namen ein
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container item alignItems={"center"}>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={"bold"}>Beschreibung:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={"center"}>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={"bold"}>Art:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Select
                fullWidth
                size="small"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "Pflichtworkshop" | "Workshop" | "Externer Workshop")
                }
              >
                <MenuItem value={"Pflichtworkshop"}>Pflichtworkshop</MenuItem>
                <MenuItem value={"Workshop"}>Workshop</MenuItem>
                <MenuItem value={"Externer Workshop"}>Externer Workshop</MenuItem>
              </Select>
              {typeError && (
                <Typography color={"error"} fontSize={12}>
                  Bitte wähle eine Art aus
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ ml: 3, mr: 3, mb: 2 }}>
        <Button variant="contained" fullWidth color="primary" onClick={handleClose}>
          Abbrechen
        </Button>
        <Button variant="contained" fullWidth color="primary" onClick={handleSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkshopDialog;
