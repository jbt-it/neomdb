import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, Button, DialogContent } from "@mui/material";
import FieldSection, { Field } from "../general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { Workshop, WorkshopInstance } from "../../types/eventTypes";

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

  // mock members
  const mockMembers = ["Thomas", "Brigitte", "Hans", "Peter", "Marc", "Lukas", "Johannes", "Karl", "Hans"];

  function resetData() {
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
    setStartTime(value as Dayjs);
  };

  const onChangeEndTime = (value: unknown) => {
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
    },
    {
      label: "Startzeit",
      type: "Time",
      state: startTime,
      width: "half",
      onChangeCallback: onChangeStartTime,
    },
    {
      label: "Endzeit",
      type: "Time",
      state: endTime,
      width: "half",
      onChangeCallback: onChangeEndTime,
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
