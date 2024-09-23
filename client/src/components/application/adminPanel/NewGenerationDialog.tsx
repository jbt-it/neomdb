import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { NewGenerationRequestDto } from "../../../types/applicationTypes";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

/**
 * The interface for the NewGenerationDialog component props
 */
interface NewGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  handleCreateGeneration: () => void;
  newGeneration: NewGenerationRequestDto;
  setNewGeneration: React.Dispatch<React.SetStateAction<NewGenerationRequestDto>>;
}

/**
 * The NewGenerationDialog component displays a dialog to create a new trainee generation
 * @param open The dialog open state
 * @param onClose The function to close the dialog
 * @param handleCreateGeneration The function to create the generation
 * @param newGeneration The new generation
 * @param setNewGeneration The function to set the new generation
 * @returns The NewGenerationDialog component
 */
const NewGenerationDialog = ({
  open,
  onClose,
  handleCreateGeneration,
  newGeneration,
  setNewGeneration,
}: NewGenerationDialogProps) => {
  const isMobile = useResponsive("down", "sm");

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  // construct the description of the generation
  const newDescription =
    new Date().getMonth() < 8
      ? `Sommersemester ${currentYear}`
      : `Wintersemester ${currentYear.toString().slice(-2)}/${nextYear.toString().slice(-2)}`;

  // Handle the change of the application start date
  const handleApplicationStartChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, applicationStart: date ? date?.toDate() : null });
  };

  // Handle the change of the application end date
  const handleApplicationEndChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, applicationEnd: date ? date?.toDate() : null });
  };

  // Handle the change of the WW start date
  const handleWWDateStartChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, wwDateStart: date ? date?.toDate() : null });
  };

  // Handle the change of the WW end date
  const handleWWDateEndChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, wwDateEnd: date ? date?.toDate() : null });
  };

  // Handle the change of the selection WE start date
  const handleSelectionWeDateStartChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, selectionWeDateStart: date ? date?.toDate() : null });
  };

  // Handle the change of the selection WE end date
  const handleSelectionWeDateEndChange = (date: Dayjs | null) => {
    setNewGeneration({ ...newGeneration, selectionWeDateEnd: date ? date?.toDate() : null });
  };

  // Check if the application start date is valid
  const isApplicationStartError =
    newGeneration.applicationStart && newGeneration.applicationStart < new Date() ? true : false;

  // Check if the application end date is valid
  const isApplicationEndError =
    (newGeneration.applicationStart &&
      newGeneration.applicationEnd &&
      newGeneration.applicationEnd < newGeneration.applicationStart) ||
    (newGeneration.applicationEnd && newGeneration.applicationEnd < new Date())
      ? true
      : false;

  // Check if the selection WE start date is valid
  const isSelectionWeDateStartError =
    (newGeneration.applicationEnd &&
      newGeneration.selectionWeDateStart &&
      newGeneration.selectionWeDateStart < newGeneration.applicationEnd) ||
    (newGeneration.selectionWeDateStart && newGeneration.selectionWeDateStart < new Date())
      ? true
      : false;

  // Check if the selection WE end date is valid
  const isSelectionWeDateEndError =
    (newGeneration.selectionWeDateStart &&
      newGeneration.selectionWeDateEnd &&
      newGeneration.selectionWeDateEnd < newGeneration.selectionWeDateStart) ||
    (newGeneration.selectionWeDateEnd && newGeneration.selectionWeDateEnd < new Date())
      ? true
      : false;

  // Check if the WW start date is valid
  const isWWDateStartError =
    (newGeneration.selectionWeDateEnd &&
      newGeneration.wwDateStart &&
      newGeneration.wwDateStart < newGeneration.selectionWeDateEnd) ||
    (newGeneration.wwDateStart && newGeneration.wwDateStart < new Date())
      ? true
      : false;

  // Check if the WW end date is valid
  const isWWDateEndError =
    newGeneration.wwDateStart && newGeneration.wwDateEnd && newGeneration.wwDateEnd < newGeneration.wwDateStart
      ? true
      : false;

  // Check if there are any errors
  const hasErrors =
    isApplicationStartError ||
    isApplicationEndError ||
    isSelectionWeDateStartError ||
    isSelectionWeDateEndError ||
    isWWDateStartError ||
    isWWDateEndError;

  // Create the generation
  const createGeneration = () => {
    if (hasErrors) {
      return;
    }
    handleCreateGeneration();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600px" } }}>
      <DialogTitle fontWeight={"bold"}>Neue Traineegeneration erstellen</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Generation:
            </Typography>
            <Typography flex={2}>{newDescription}</Typography>
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Bewerbung Start:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isApplicationStartError ? "Der Bewerbungsstart muss in der Zukunft liegen." : "",
                  error: isApplicationStartError,
                },
              }}
              minDate={dayjs()}
              maxDate={dayjs(newGeneration.applicationEnd)}
              value={dayjs(newGeneration.applicationStart)}
              onChange={handleApplicationStartChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Bewerbung Ende:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isApplicationEndError ? "Das Bewerbungsende muss nach dem Bewerbungsstart liegen." : "",
                  error: isApplicationEndError,
                },
              }}
              minDate={dayjs(newGeneration.applicationStart)}
              value={dayjs(newGeneration.applicationEnd)}
              onChange={handleApplicationEndChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Auswahl WE Start:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isSelectionWeDateStartError ? "Das Auswahl-WE Start muss nach dem WW Ende liegen." : "",
                  error: isSelectionWeDateStartError,
                },
              }}
              minDate={dayjs(newGeneration.applicationEnd)}
              maxDate={dayjs(newGeneration.selectionWeDateEnd)}
              value={dayjs(newGeneration.selectionWeDateStart)}
              onChange={handleSelectionWeDateStartChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Auswahl WE Ende:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isSelectionWeDateEndError
                    ? "Das Auswahl-WE Ende muss nach dem Auswahl-WE Start liegen."
                    : "",
                  error: isSelectionWeDateEndError,
                },
              }}
              minDate={dayjs(newGeneration.selectionWeDateStart)}
              value={dayjs(newGeneration.selectionWeDateEnd)}
              onChange={handleSelectionWeDateEndChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              WW Start:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isWWDateStartError ? "Der WW Start muss nach dem Bewerbungsende liegen." : "",
                  error: isWWDateStartError,
                },
              }}
              minDate={dayjs(newGeneration.selectionWeDateEnd)}
              maxDate={dayjs(newGeneration.wwDateEnd)}
              value={dayjs(newGeneration.wwDateStart)}
              onChange={handleWWDateStartChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              WW Ende:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  helperText: isWWDateEndError ? "Der WW Ende muss nach dem WW Start liegen." : "",
                  error: isWWDateEndError,
                },
              }}
              minDate={dayjs(newGeneration.wwDateStart)}
              value={dayjs(newGeneration.wwDateEnd)}
              onChange={handleWWDateEndChange}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={createGeneration} disabled={hasErrors}>
          Erstellen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGenerationDialog;
