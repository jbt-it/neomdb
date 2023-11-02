import React, { useState, useReducer } from "react";
import { Dialog, Container, Divider } from "@mui/material";
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

interface State {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationStart: Dayjs | null;
  registrationEnd: string;
  maxParticipants: number | null;
  organizers: string[];
  eventType: string;
  description: string;
}

type Action = {
  type: "set";
  field: keyof State;
  value: string | number | Dayjs | null;
};

/**
 * Dialog to edit an event.
 * TODO: Correct the onChange functions for maxParticipants and organizers.
 * Set correct radio buttons for event type.
 * Display fields depending on the event type.
 * Maybe: check wether it is a new event or an existing one.
 */

const EditEventDialog = (props: EditEventDialogProps) => {
  const [eventType, setEventType] = useState<string>(props.type || "");

  const initialState: State = {
    title: props.title || "",
    location: props.location || "",
    startDate: props.startDate || "",
    endDate: props.endDate || "",
    startTime: props.startTime || "",
    endTime: props.endTime || "",
    registrationStart: props.registrationStart || null,
    registrationEnd: props.registrationEnd || "",
    maxParticipants: props.maxParticipants || null,
    organizers: props.organizers || [],
    eventType: props.type || "",
    description: props.description || "",
  };

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case "set":
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "title", value: event.target.value });
  };

  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "location", value: event.target.value });
  };

  const onChangeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "startDate", value: event.target.value });
  };

  const onChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "endDate", value: event.target.value });
  };

  const onChangeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "startTime", value: event.target.value });
  };

  const onChangeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "endTime", value: event.target.value });
  };

  const onChangeRegistrationStart = (value: unknown) => {
    dispatch({ type: "set", field: "registrationStart", value: value as Dayjs });
    // setRegistrationStart(event.target.value);
  };

  const onChangeRegistrationEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "registrationEnd", value: event.target.value });
  };

  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "set",
      field: "maxParticipants",
      value: Number(event.target.value) === 0 ? null : Number(event.target.value),
    });
  };

  const onChangeOrganizers = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setOrganizers(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "description", value: event.target.value });
  };

  const editFields: Array<Field> = [
    {
      label: "Name",
      state: state.title,
      width: "half",
      onChangeCallback: onChangeTitle,
      type: "Text",
    },
    {
      label: "Ort",
      state: state.location,
      width: "half",
      onChangeCallback: onChangeLocation,
      type: "Text",
    },
    {
      label: "Beginn",
      state: state.startDate,
      width: "half",
      onChangeCallback: onChangeStartDate,
      type: "Text",
    },
    {
      label: "Ende",
      state: state.endDate,
      width: "half",
      onChangeCallback: onChangeEndDate,
      type: "Text",
    },
    {
      label: "Startzeit",
      state: state.startTime,
      width: "half",
      onChangeCallback: onChangeStartTime,
      type: "Text",
    },
    {
      label: "Endzeit",
      state: state.endTime,
      width: "half",
      onChangeCallback: onChangeEndTime,
      type: "Text",
    },
    {
      label: "Anmeldung ab",
      state: state.registrationStart,
      width: "half",
      onChangeCallback: onChangeRegistrationStart,
      type: "Date",
    },
    {
      label: "Anmeldung bis",
      state: state.registrationEnd,
      width: "half",
      onChangeCallback: onChangeRegistrationEnd,
      type: "Text",
    },

    {
      label: "Teilnehmeranzahl",
      state: state.maxParticipants,
      width: "half",
      onChangeCallback: onChangeMaxParticipants,
      type: "Text",
      inputType: "number",
    },
    {
      label: "Organisatoren",
      state: state.organizers,
      width: "half",
      onChangeCallback: onChangeOrganizers,
      type: "Text",
    },
    {
      label: "Beschreibung",
      state: state.description,
      width: "full",
      onChangeCallback: onChangeDescription,
      type: "TextBig",
      rows: 2,
    },
  ];

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        style: {
          marginTop: "10%",
          marginBottom: "auto",
        },
      }}
    >
      <Container sx={{ pt: 3, pb: 3 }}>
        <FormControl>
          <FormLabel sx={{ pl: 1 }}>Veranstaltung bearbeiten</FormLabel>
          <RadioGroup row sx={{ pl: 1 }} value={eventType} onChange={(event) => setEventType(event.target.value)}>
            <FormControlLabel value="JBT goes" control={<Radio />} label="JBT goes" />
            <FormControlLabel value="WW" control={<Radio />} label="WW" />
            <FormControlLabel value="Netzwerk" control={<Radio />} label="Netzwerk" />
            <FormControlLabel value="Sonstige" control={<Radio />} label="Sonstige" />
          </RadioGroup>
          <Divider sx={{ mb: 3 }} />
          {eventType === "JBT goes" ? <FieldSection fields={editFields} /> : null}
        </FormControl>
      </Container>
    </Dialog>
  );
};

export default EditEventDialog;
