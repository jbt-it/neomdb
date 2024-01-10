import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import FieldSection, { Field } from "../general/FieldSection";
import InfoSection, { InformationField } from "../general/InfoSection";

type commonEventType = {
  ID: number;
  name: string;
  date: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string | null;
  registrationStart: Dayjs | null;
  registrationDeadline: Dayjs | null;
  participantsCount?: number | null;
  maximumParticipants?: number | null;
  organizers?: string[];
  description?: string;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
};

interface WorkingWeekendSignUpDialogProps {
  open: boolean;
  handleClose: () => void;
  ww: commonEventType;
}

const WorkingWeekendSignUpDialog: React.FunctionComponent<WorkingWeekendSignUpDialogProps> = ({
  open,
  handleClose,
  ww,
}: WorkingWeekendSignUpDialogProps) => {
  const [arrival, setArrival] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [car, setCar] = useState<boolean>();
  const [seats, setSeats] = useState<number>();
  const [vegetarian, setVegetarian] = useState<boolean>();
  const [remarks, setRemarks] = useState<string>("");

  const handleSubmit = () => {
    console.log("Submit");
  };

  const handleCancel = () => {
    setArrival("");
    setDeparture("");
    setCar(undefined);
    setSeats(undefined);
    setVegetarian(undefined);
    setRemarks("");
    handleClose();
  };

  const onChangeArrival = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArrival(event.target.value);
  };

  const onChangeDeparture = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeparture(event.target.value);
  };

  const onChangeCar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArrival(event.target.value);
  };

  const onChangeSeats = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArrival(event.target.value);
  };

  const onChangeRemarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const fields: Array<Field> = [
    {
      label: "Anreise",
      state: arrival,
      onChangeCallback: onChangeArrival,
      type: "Dropdown",
      width: "half",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Geplante Abreise",
      state: departure,
      onChangeCallback: onChangeArrival,
      type: "Dropdown",
      width: "half",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Steht ein Auto zur Verfügung",
      state: car,
      onChangeCallback: onChangeArrival,
      type: "Dropdown",
      width: "full",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Wenn ja, Anzahl freier Plätze",
      state: seats,
      onChangeCallback: onChangeArrival,
      type: "Dropdown",
      width: "full",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Vegetarier",
      state: vegetarian,
      onChangeCallback: onChangeArrival,
      type: "Dropdown",
      width: "full",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Bemerkungen",
      state: remarks,
      onChangeCallback: onChangeRemarks,
      type: "TextBig",
      width: "full",
      rows: 2,
    },
  ];

  const wwfields: Array<InformationField> = [
    {
      label: "Beginn",
      value: ww.date.format("DD.MM.YYYY"),
      type: "text",
    },
    {
      label: "Ende",
      value: ww.endDate.format("DD.MM.YYYY"),
      type: "text",
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Anmeldung für {ww.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ pl: 2 }}>
          <InfoSection fields={wwfields} />
        </Box>
        <FieldSection fields={fields} />
      </DialogContent>
      <DialogActions sx={{ ml: 3, mr: 3, mb: 2 }}>
        <Button variant="contained" fullWidth color="primary" onClick={handleCancel}>
          Abbrechen
        </Button>
        <Button variant="contained" fullWidth color="primary" onClick={handleSubmit}>
          Anmelden
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkingWeekendSignUpDialog;
