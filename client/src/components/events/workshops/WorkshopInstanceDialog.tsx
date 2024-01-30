import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, Button, DialogContent } from "@mui/material";
import FieldSection, { Field } from "../../general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { Workshop, WorkshopInstance } from "../../../types/eventTypes";

interface WorkshopInstanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  workshop: Workshop;
  workshopInstance?: WorkshopInstance;
}

/**
 * Displays a dialog to add or edit a workshop instance.
 * @param open Whether the dialog should be open.
 * @param onClose Function to close the dialog.
 * @param onSave Function to save the workshop instance.
 * @returns A dialog to add or edit a workshop instance.
 */
const WorkshopInstanceDialog: React.FunctionComponent<WorkshopInstanceDialogProps> = ({
  open,
  onClose,
  onSave,
  workshop,
  workshopInstance,
}: WorkshopInstanceDialogProps) => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [location, setLocation] = useState<string>("");
  const [targetGroup, setTargetGroup] = useState<string>("");
  const [externalInstructors, setExternalInstructors] = useState<string>("");
  const [internalInstructors, setInternalInstructors] = useState<string[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number | null>(null);

  const [errordate, setErrorDate] = useState<boolean>(false);
  const [errorStartTime, setErrorStartTime] = useState<boolean>(false);
  const [errorEndTime, setErrorEndTime] = useState<boolean>(false);

  // mock members
  const mockMembers = ["Thomas", "Brigitte", "Hans", "Peter", "Marc", "Lukas", "Johannes", "Karl", "Hans"];

  function resetData() {
    setErrorDate(false);
    setErrorStartTime(false);
    setErrorEndTime(false);
    if (!workshopInstance) {
      setDate(null);
      setStartTime(null);
      setEndTime(null);
      setLocation("");
      setTargetGroup("");
      {
        workshop.art === "Externer Workshop" ? setExternalInstructors("") : setInternalInstructors(mockMembers);
      }
      setMaxParticipants(null);
    } else {
      const dateDayjs = dayjs(workshopInstance.datum);
      const startzeitDayjs = dayjs(workshopInstance.startzeit, "HH:mm");
      const endzeitDayjs = dayjs(workshopInstance.endzeit, "HH:mm");

      setDate(dayjs(workshopInstance.datum));
      setStartTime(dateDayjs.hour(startzeitDayjs.hour()).minute(startzeitDayjs.minute()));
      setEndTime(dateDayjs.hour(endzeitDayjs.hour()).minute(endzeitDayjs.minute()));
      setLocation(workshopInstance.ort);
      setTargetGroup(workshopInstance.zielgruppe);
      {
        workshop.art === "Externer Workshop"
          ? setExternalInstructors(workshopInstance.referenten)
          : setInternalInstructors(mockMembers);
      }
      setMaxParticipants(workshopInstance.maximaleTeilnehmer);
    }
  }

  useEffect(() => {
    resetData();
  }, [workshopInstance]);

  const onChangeDate = (value: unknown) => {
    setDate(value as Dayjs);
  };

  const onChangeStartTime = (value: unknown) => {
    setErrorStartTime(false);
    setErrorEndTime(false);
    if (endTime ? (value as Dayjs).isAfter(endTime) : null) {
      setErrorStartTime(true);
    }
    if (endTime ? endTime.isBefore(value as Dayjs) : null) {
      setErrorEndTime(true);
    }
    setStartTime(value as Dayjs);
  };

  const onChangeEndTime = (value: unknown) => {
    setErrorEndTime(false);
    setErrorStartTime(false);
    if (!startTime) {
      setErrorEndTime(true);
    }
    if (startTime ? (value as Dayjs).isBefore(startTime) : null) {
      setErrorEndTime(true);
    }
    setEndTime(value as Dayjs);
  };

  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const onChangeTargetGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetGroup(event.target.value);
  };

  const onChangeExternalInstructors = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExternalInstructors(event.target.value);
  };

  const onChangeInternalInstructors = (event: React.ChangeEvent<object>, value: string[] | string) => {
    console.log(value);
  };

  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxParticipants(Number(event.target.value));
  };

  // Function to handle the close button
  const handleClose = () => {
    resetData();
    onClose();
  };

  // Function to handle the save button
  const handleSave = () => {
    setErrorDate(false);
    if (date === null || date.isBefore(dayjs().subtract(180, "day")) || date.isAfter(dayjs().add(365, "day"))) {
      setErrorDate(true);
      return;
    } else if (errorStartTime || errorEndTime) {
      return;
    }
    onSave();
    handleClose();
  };

  const dialogFields: Array<Field> = [
    {
      label: "Datum",
      type: "Date",
      state: date,
      width: "half",
      onChangeCallback: onChangeDate,
      error: errordate,
      helperText: errordate ? "Bitte lege ein gültiges Datum fest" : "",
    },
    {
      label: "Startzeit",
      type: "Time",
      state: startTime,
      width: "half",
      onChangeCallback: onChangeStartTime,
      helperText: errorStartTime ? "Bitte gib eine gültige Startzeit an" : "",
      error: errorStartTime,
    },
    {
      label: "Endzeit",
      type: "Time",
      state: endTime,
      width: "half",
      onChangeCallback: onChangeEndTime,
      helperText: errorEndTime ? "Bitte gib eine gültige Endzeit an" : "",
      error: errorEndTime,
    },
    {
      label: "Ort",
      type: "Text",
      state: location,
      width: "half",
      onChangeCallback: onChangeLocation,
    },
    {
      label: "Zielgruppe",
      type: "Text",
      state: targetGroup,
      width: "half",
      onChangeCallback: onChangeTargetGroup,
    },
    {
      label: "Max. Teilnehmer",
      type: "Text",
      inputType: "number",
      state: maxParticipants,
      width: "half",
      onChangeCallback: onChangeMaxParticipants,
    },
    workshop.art === "Externer Workshop"
      ? {
          label: "Referenten",
          type: "Text",
          state: externalInstructors,
          width: "full",
          onChangeCallback: onChangeExternalInstructors,
        }
      : {
          label: "Referenten",
          type: "Autocomplete",
          state: internalInstructors,
          width: "full",
          onChangeCallback: onChangeInternalInstructors,
        },
  ];

  return (
    <Dialog open={open}>
      <DialogTitle>{workshop.schulungsName}</DialogTitle>
      <DialogContent>
        <FieldSection fields={dialogFields} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkshopInstanceDialog;
