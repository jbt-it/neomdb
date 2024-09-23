import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { GenerationDto } from "../../../types/applicationTypes";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

/**
 * The interface for the EditGenerationDialog component props
 */
interface EditGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  handleSaveGeneration: () => void;
  generation: GenerationDto;
  setGeneration: React.Dispatch<React.SetStateAction<GenerationDto>>;
}

/**
 * The EditGenerationDialog component displays a dialog to edit a generation
 * @param open The dialog open state
 * @param onClose The function to close the dialog
 * @param handleCreateGeneration The function to save the generation
 * @param generation The generation
 * @param setNewGeneration The function to set the new generation
 * @returns The EditGenerationDialog component
 */
const EditGenerationDialog = ({
  open,
  onClose,
  handleSaveGeneration,
  generation,
  setGeneration,
}: EditGenerationDialogProps) => {
  const isMobile = useResponsive("down", "sm");

  // Handle the change of the application start date
  const handleApplicationStartChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, applicationStart: date ? date?.toDate() : null });
  };

  // Handle the change of the application end date
  const handleApplicationEndChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, applicationEnd: date ? date?.toDate() : null });
  };

  // Handle the change of the WW start date
  const handleWWDateStartChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, wwDateStart: date ? date?.toDate() : null });
  };

  // Handle the change of the WW end date
  const handleWWDateEndChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, wwDateEnd: date ? date?.toDate() : null });
  };

  // Handle the change of the selection WE start date
  const handleSelectionWeDateStartChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, selectionWeDateStart: date ? date?.toDate() : null });
  };

  // Handle the change of the selection WE end date
  const handleSelectionWeDateEndChange = (date: Dayjs | null) => {
    setGeneration({ ...generation, selectionWeDateEnd: date ? date?.toDate() : null });
  };

  // Handle the change of the info evening visitors
  const handleInfoEveningVisitorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGeneration({ ...generation, infoEveningVisitors: parseInt(event.target.value) });
  };

  // Check if the application start date is valid
  const isApplicationStartError =
    generation.applicationStart && generation.applicationStart < new Date() ? true : false;

  // Check if the application end date is valid
  const isApplicationEndError =
    (generation.applicationStart &&
      generation.applicationEnd &&
      generation.applicationEnd < generation.applicationStart) ||
    (generation.applicationEnd && generation.applicationEnd < new Date())
      ? true
      : false;

  // Check if the selection WE start date is valid
  const isSelectionWeDateStartError =
    (generation.applicationEnd &&
      generation.selectionWeDateStart &&
      generation.selectionWeDateStart < generation.applicationEnd) ||
    (generation.selectionWeDateStart && generation.selectionWeDateStart < new Date())
      ? true
      : false;

  // Check if the selection WE end date is valid
  const isSelectionWeDateEndError =
    (generation.selectionWeDateStart &&
      generation.selectionWeDateEnd &&
      generation.selectionWeDateEnd < generation.selectionWeDateStart) ||
    (generation.selectionWeDateEnd && generation.selectionWeDateEnd < new Date())
      ? true
      : false;

  // Check if the WW start date is valid
  const isWWDateStartError =
    (generation.selectionWeDateEnd &&
      generation.wwDateStart &&
      generation.wwDateStart < generation.selectionWeDateEnd) ||
    (generation.wwDateStart && generation.wwDateStart < new Date())
      ? true
      : false;

  // Check if the WW end date is valid
  const isWWDateEndError =
    generation.wwDateStart && generation.wwDateEnd && generation.wwDateEnd < generation.wwDateStart ? true : false;

  // Check if there are any errors
  const hasErrors =
    isApplicationStartError ||
    isApplicationEndError ||
    isSelectionWeDateStartError ||
    isSelectionWeDateEndError ||
    isWWDateStartError ||
    isWWDateEndError;

  // Save the generation
  const saveGeneration = () => {
    if (hasErrors) {
      return;
    }
    handleSaveGeneration();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600px" } }}>
      <DialogTitle fontWeight={"bold"}>Bewerbungsphase bearbeiten</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Generation:
            </Typography>
            <Typography flex={2}>{generation.description}</Typography>
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
              maxDate={dayjs(generation.applicationEnd)}
              value={dayjs(generation.applicationStart)}
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
              minDate={dayjs(generation.applicationStart)}
              value={dayjs(generation.applicationEnd)}
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
              minDate={dayjs(generation.applicationEnd)}
              maxDate={dayjs(generation.selectionWeDateEnd)}
              value={dayjs(generation.selectionWeDateStart)}
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
              minDate={dayjs(generation.selectionWeDateStart)}
              value={dayjs(generation.selectionWeDateEnd)}
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
              minDate={dayjs(generation.selectionWeDateEnd)}
              maxDate={dayjs(generation.wwDateEnd)}
              value={dayjs(generation.wwDateStart)}
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
              minDate={dayjs(generation.wwDateStart)}
              value={dayjs(generation.wwDateEnd)}
              onChange={handleWWDateEndChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={"center"}>
            <Typography flex={1} fontWeight={"bold"}>
              Infoabend-Besucher:
            </Typography>
            <TextField
              sx={{ flex: 2 }}
              variant="outlined"
              size="small"
              value={generation.infoEveningVisitors || ""}
              onChange={handleInfoEveningVisitorsChange}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={saveGeneration} disabled={hasErrors}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGenerationDialog;
