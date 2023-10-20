import React, { useState } from "react";
import { Dialog, Container } from "@mui/material";
import FieldSection, { Field } from "../../components/general/FieldSection";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

function EditEventDialog(props: EditEventDialogProps) {
  const [title, setTitle] = useState<string>(props.title);
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [registrationStart, setRegistrationStart] = useState<string>("");
  const [registrationEnd, setRegistrationEnd] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [organizers, setOrganizers] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [description, setDescription] = useState<string>(props.description);

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

  const onChangeRegistrationStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationStart(event.target.value);
  };

  const onChangeRegistrationEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationEnd(event.target.value);
  };

  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxParticipants(event.target.value);
  };

  const onChangeOrganizers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizers(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onChangeEventType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventType(event.target.value);
  };

  const editFields: Array<Field> = [
    {
      label: "Eventart",
      state: eventType,
      width: "full",
      onChangeCallback: onChangeEventType,
      type: "RadioButton",
      values: [
        { label: "JBT goes", value: "jbt goes" },
        { label: "Netzwerk", value: "netzwerk" },
        { label: "Working Weekend", value: "ww" },
        { label: "Sonstiges", value: "sonstige" },
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
      type: "Text",
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
        <FieldSection title="Event bearbeiten" fields={editFields} />
      </Container>
    </Dialog>
  );
}

export default EditEventDialog;
