import React, { useState } from "react";
import { Dialog, Container } from "@mui/material";
import FieldSection, { Field } from "../../components/general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  type?: string;
  title?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  registrationStart?: Dayjs | null;
  registrationEnd?: string;
  maxParticipants?: number | null;
  organizers?: string[];
  description?: string;
}

/**
 * Dialog to edit an event.
 * TODO: Correct the onChange functions for maxParticipants and organizers.
 * Set correct radio buttons for event type.
 * Display fields depending on the event type.
 * Maybe: check wether it is a new event or an existing one.
 */

function EditEventDialog(props: EditEventDialogProps) {
  const [title, setTitle] = useState<string>(props.title ? props.title : "");
  const [location, setLocation] = useState<string>(props.location ? props.location : "");
  const [startDate, setStartDate] = useState<string>(props.startDate ? props.startDate : "");
  const [endDate, setEndDate] = useState<string>(props.endDate ? props.endDate : "");
  const [startTime, setStartTime] = useState<string>(props.startTime ? props.startTime : "");
  const [endTime, setEndTime] = useState<string>(props.endTime ? props.endTime : "");
  const [registrationStart, setRegistrationStart] = useState<Dayjs | null>(
    props.registrationStart ? props.registrationStart : null
  );
  const [registrationEnd, setRegistrationEnd] = useState<string>(props.registrationEnd ? props.registrationEnd : "");
  const [maxParticipants, setMaxParticipants] = useState<number | null>(
    props.maxParticipants ? props.maxParticipants : null
  );
  const [organizers, setOrganizers] = useState<string[]>(props.organizers ? props.organizers : []);
  const [eventType, setEventType] = useState<string>(props.type ? props.type : "");
  const [description, setDescription] = useState<string>(props.description ? props.description : "");

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const onChangeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const onChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const onChangeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const onChangeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const onChangeRegistrationStart = (value: unknown) => {
    setRegistrationStart(value as Dayjs);
    // setRegistrationStart(event.target.value);
  };

  const onChangeRegistrationEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationEnd(event.target.value);
  };

  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setMaxParticipants(event.target.value);
  };

  const onChangeOrganizers = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setOrganizers(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onChangeEventType = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setEventType(event.target.value);
    console.log(eventType);
  };

  const editFields: Array<Field> = [
    {
      label: "Eventart",
      state: eventType,
      width: "full",
      onChangeCallback: onChangeEventType,
      type: "RadioButton",
      values: [
        { label: "JBT goes", value: "JBT goes" },
        { label: "Netzwerk", value: "Netzwerk" },
        { label: "Working Weekend", value: "WW" },
        { label: "Sonstiges", value: "Sonstige" },
      ],
    },
    {
      label: "Name",
      state: title,
      width: "half",
      onChangeCallback: onChangeTitle,
      type: "Text",
    },
    {
      label: "Ort",
      state: location,
      width: "half",
      onChangeCallback: onChangeLocation,
      type: "Text",
    },
    {
      label: "Beginn",
      state: startDate,
      width: "half",
      onChangeCallback: onChangeStartDate,
      type: "Text",
    },
    {
      label: "Ende",
      state: endDate,
      width: "half",
      onChangeCallback: onChangeEndDate,
      type: "Text",
    },
    {
      label: "Startzeit",
      state: startTime,
      width: "half",
      onChangeCallback: onChangeStartTime,
      type: "Text",
    },
    {
      label: "Endzeit",
      state: endTime,
      width: "half",
      onChangeCallback: onChangeEndTime,
      type: "Text",
    },
    {
      label: "Anmeldung ab",
      state: registrationStart,
      width: "half",
      onChangeCallback: onChangeRegistrationStart,
      type: "Date",
    },
    {
      label: "Anmeldung bis",
      state: registrationEnd,
      width: "half",
      onChangeCallback: onChangeRegistrationEnd,
      type: "Text",
    },

    {
      label: "Teilnehmeranzahl",
      state: maxParticipants,
      width: "half",
      onChangeCallback: onChangeMaxParticipants,
      type: "Text",
    },
    {
      label: "Organisatoren",
      state: organizers,
      width: "half",
      onChangeCallback: onChangeOrganizers,
      type: "Text",
    },
    {
      label: "Beschreibung",
      state: description,
      width: "full",
      onChangeCallback: onChangeDescription,
      type: "TextBig",
      rows: 2,
    },
  ];

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <Container sx={{ pt: 3, pb: 3 }}>
        <FormControl>
          <FormLabel>Veranstaltungsart</FormLabel>
          <RadioGroup row>
            <FormControlLabel value="JBT goes" control={<Radio />} label="JBT goes" />
            <FormControlLabel value="WW" control={<Radio />} label="WW" />
            <FormControlLabel value="Netzwerk" control={<Radio />} label="Netzwerk" />
            <FormControlLabel value="Sonstige" disabled control={<Radio />} label="Sonstige" />
          </RadioGroup>
        </FormControl>
        <FieldSection title="Event bearbeiten" fields={editFields} />
      </Container>
    </Dialog>
  );
}

export default EditEventDialog;
