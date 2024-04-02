import React, { useState, useReducer } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, Divider, Typography } from "@mui/material";
import FieldSection, { Field } from "../general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { CommonEventType } from "../../types/eventTypes";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventDetails: CommonEventType) => void;
  eventDetails?: CommonEventType;
  newEvent?: boolean;
}

interface State {
  name: string;
  location: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  registrationStart: Dayjs | null;
  registrationEnd: Dayjs | null;
  maxParticipants: number | null;
  organizers: string[];
  eventType: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
  description: string;
}

type Action = { type: "set"; field: keyof State; value: any } | { type: "reset" };

interface ErrorState {
  name: boolean;
  location: boolean;
  startDate: boolean;
  endDate: boolean;
  startTime: boolean;
  endTime: boolean;
  registrationStart: boolean;
  registrationEnd: boolean;
  maxParticipants: boolean;
  organizers: boolean;
  description: boolean;
}

type ErrorAction = { type: "set"; field: keyof ErrorState; value: any } | { type: "reset" };

/**
 * Dialog to edit an event.
 * TODO: Correct the onChange functions for organizers.
 */
const EditEventDialog = ({ open, onClose, onSubmit, newEvent, eventDetails }: EditEventDialogProps) => {
  const [eventType, setEventType] = useState<
    "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop"
  >(eventDetails?.type || "JBT goes");
  const mobile = useResponsive("down", "md");

  const members = ["Thomas", "Brigitte", "Hans", "Peter", "Marc", "Lukas", "Johannes", "Karl", "Hans"];

  const currentDate = dayjs();
  const content =
    currentDate.month() < 5
      ? "Working Weekend SoSe" + currentDate.format("YY")
      : "Working Weekend WiSe " + currentDate.format("YY") + "/" + currentDate.add(1, "year").format("YY");

  const initialState: State = {
    name: eventDetails?.name || "",
    location: eventDetails?.location || "",
    startDate: eventDetails?.startDate || null,
    endDate: eventDetails?.endDate || null,
    startTime: eventDetails?.startTime || null,
    endTime: eventDetails?.endTime || null,
    registrationStart: eventDetails?.registrationStart || null,
    registrationEnd: eventDetails?.registrationEnd || null,
    maxParticipants: eventDetails?.maxParticipants || null,
    organizers: eventDetails?.organizers || [],
    eventType: eventDetails?.type || "JBT goes",
    description: eventDetails?.description || "",
  };

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case "set":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "reset":
        return initialState;
      default:
        throw new Error();
    }
  }

  const initialErrorState: ErrorState = {
    name: false,
    location: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    registrationStart: false,
    registrationEnd: false,
    maxParticipants: false,
    organizers: false,
    description: false,
  };

  function errorReducer(state: ErrorState, action: ErrorAction) {
    switch (action.type) {
      case "set":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "reset":
        return initialErrorState;
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [errorState, errorDispatch] = useReducer(errorReducer, initialErrorState);

  const checkForm = () => {
    let complete = true;
    errorDispatch({ type: "reset" });

    // title is necessary for all events and cannot be null
    if (!state.name && eventType !== "WW") {
      errorDispatch({ type: "set", field: "name", value: true });
      complete = false;
    }
    // startDate is necessary for all events and cannot be null and cannot be more than 365 days in the past
    if (state.startDate ? state.startDate < dayjs().subtract(1, "year").startOf("day") : true) {
      errorDispatch({ type: "set", field: "startDate", value: true });
      complete = false;
    }
    // if an endDate is given, it must be after the startDate
    if (state.startDate && state.endDate ? state.startDate.startOf("day") > state.endDate.endOf("day") : false) {
      errorDispatch({ type: "set", field: "endDate", value: true });
      complete = false;
    }
    // if an endTime is given, there has to be a startTime
    if (!state.startTime && state.endTime) {
      errorDispatch({ type: "set", field: "startTime", value: true });
      complete = false;
    }
    // if a startTime and an endTime are given, the endTime has to be after the startTime
    if (state.startTime && state.endTime ? state.startTime > state.endTime : false) {
      errorDispatch({ type: "set", field: "endTime", value: true });
      complete = false;
    }
    // if a registrationStart and a registrationEnd are given, the registrationEnd has to be after the registrationStart
    if (state.registrationStart && state.registrationEnd ? state.registrationStart > state.registrationEnd : false) {
      errorDispatch({ type: "set", field: "registrationEnd", value: true });
      complete = false;
    }

    // registrationStart cannot be more than 365 days in the past
    if (state.registrationStart ? state.registrationStart < dayjs().subtract(1, "year").startOf("day") : false) {
      errorDispatch({ type: "set", field: "registrationStart", value: true });
      complete = false;
    }

    // if the event type is WW, there has to be an endDate
    if (eventType === "WW" && !state.endDate) {
      errorDispatch({ type: "set", field: "endDate", value: true });
      complete = false;
    }

    return complete;
  };

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "name", value: event.target.value });
  };

  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "location", value: event.target.value });
  };

  const onChangeStartDate = (value: unknown) => {
    let startDate = value as Dayjs;
    startDate = startDate.startOf("day");
    dispatch({ type: "set", field: "startDate", value: startDate });
  };

  const onChangeEndDate = (value: unknown) => {
    let endDate = value as Dayjs;
    endDate = endDate.endOf("day");
    dispatch({ type: "set", field: "endDate", value: endDate });
  };

  const onChangeStartTime = (value: unknown) => {
    dispatch({ type: "set", field: "startTime", value: value as Dayjs });
  };

  const onChangeEndTime = (value: unknown) => {
    dispatch({ type: "set", field: "endTime", value: value as Dayjs });
  };

  const onChangeRegistrationStart = (value: unknown) => {
    dispatch({ type: "set", field: "registrationStart", value: value as Dayjs });
  };

  const onChangeRegistrationEnd = (value: unknown) => {
    dispatch({ type: "set", field: "registrationEnd", value: value as Dayjs });
  };

  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "set",
      field: "maxParticipants",
      value: Number(event.target.value) === 0 ? null : Number(event.target.value),
    });
  };

  const onChangeOrganizers = (event: React.ChangeEvent<object>, value: string[] | string) => {
    dispatch({ type: "set", field: "organizers", value });
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "description", value: event.target.value });
  };

  const handleChangeEventType = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.value) {
      case "JBT goes":
        setEventType("JBT goes");
        break;
      case "WW":
        setEventType("WW");
        break;
      case "Netzwerk":
        setEventType("Netzwerk");
        break;
      case "Sonstige":
        setEventType("Sonstige");
        break;
      default:
        setEventType("Sonstige");
        break;
    }
  };

  const handleSubmit = () => {
    if (checkForm()) {
      if (state.startDate !== null) {
        const updatedEventDetails = {
          ID: eventDetails?.ID || 0,
          name: state.name,
          location: state.location,
          startDate: state.startDate,
          endDate: state.endDate,
          startTime: state.startTime,
          endTime: state.endTime,
          registrationStart: state.registrationStart,
          registrationEnd: state.registrationEnd,
          maxParticipants: state.maxParticipants,
          organizers: state.organizers,
          type: eventType,
          description: state.description,
        } as CommonEventType;
        onSubmit(updatedEventDetails);
        onClose();
        dispatch({ type: "reset" });
        errorDispatch({ type: "reset" });
      }
    }
  };

  const editFields: Array<Field> = [
    {
      label: "Name",
      state: state.name,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeTitle,
      type: "Text",
      error: errorState.name,
      helperText: errorState.name ? "Bitte gib einen Namen ein!" : undefined,
    },
    {
      label: "Ort",
      state: state.location,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeLocation,
      type: "Text",
    },
    {
      label: "Beginn",
      state: state.startDate,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeStartDate,
      type: "Date",
      error: errorState.startDate,
      helperText: errorState.startDate ? "Bitte gib ein gültiges Startdatum ein!" : undefined,
    },
    {
      label: "Ende",
      state: state.endDate,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeEndDate,
      type: "Date",
      error: errorState.endDate,
      helperText: errorState.endDate ? "Das Enddatum darf nicht vor dem Beginn liegen!" : undefined,
    },
    {
      label: "Startzeit",
      state: state.startTime,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeStartTime,
      type: "Time",
      error: errorState.startTime,
      helperText: errorState.startTime ? "Bitte gib eine Startzeit ein!" : undefined,
    },
    {
      label: "Endzeit",
      state: state.endTime,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeEndTime,
      type: "Time",
      error: errorState.endTime,
      helperText: errorState.endTime ? "Die Endzeit darf nicht vor der Startzeit liegen!" : undefined,
    },
    {
      label: "Anmeldung ab",
      state: state.registrationStart,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeRegistrationStart,
      type: "DateTime",
      error: errorState.registrationStart,
      helperText: errorState.registrationStart ? "Bitte gib einen gültigen Anmeldungsstart ein!" : undefined,
    },
    {
      label: "Anmeldung bis",
      state: state.registrationEnd,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeRegistrationEnd,
      type: "DateTime",
      error: errorState.registrationEnd,
      helperText: errorState.registrationEnd
        ? "Das Anmeldungsende darf nicht vor dem Anmeldungsstart liegen!"
        : undefined,
    },

    {
      label: "Teilnehmeranzahl",
      state: state.maxParticipants,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeMaxParticipants,
      type: "Text",
      inputType: "number",
    },
    {
      label: "Organisatoren",
      state: members,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeOrganizers,
      type: "Autocomplete",
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

  const wwFields: Array<Field> = [
    {
      label: "Beginn",
      state: state.startDate,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeStartDate,
      type: "Date",
      error: errorState.startDate,
      helperText: errorState.startDate ? "Bitte gib ein Startdatum ein!" : undefined,
    },
    {
      label: "Ende",
      state: state.endDate,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeEndDate,
      type: "Date",
      error: errorState.endDate,
      helperText: errorState.endDate ? "Bitte gib ein Enddatum ein!" : undefined,
    },
    {
      label: "Anmeldung ab",
      state: state.registrationStart,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeRegistrationStart,
      type: "DateTime",
    },
    {
      label: "Anmeldung bis",
      state: state.registrationEnd,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeRegistrationEnd,
      type: "DateTime",
      helperText: errorState.registrationEnd
        ? "Das Anmeldungsende darf nicht vor dem Anmeldungsstart liegen!"
        : undefined,
    },
    {
      label: "Ort",
      state: state.location,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeLocation,
      type: "Text",
    },
    {
      label: "Organisatoren",
      state: members,
      width: mobile ? "full" : "half",
      onChangeCallback: onChangeOrganizers,
      type: "Autocomplete",
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
      open={open}
      onClose={() => {
        onClose();
        dispatch({ type: "reset" });
        errorDispatch({ type: "reset" });
      }}
      scroll={"paper"}
      PaperProps={{
        style: {
          marginTop: "5%",
          marginBottom: "auto",
        },
      }}
    >
      <DialogTitle>{newEvent ? "Veranstaltung anlegen" : state.name + " bearbeiten"}</DialogTitle>
      <DialogContent sx={{ height: "80%" }}>
        <FormControl sx={{ width: "100%" }}>
          <RadioGroup row sx={{ pl: 1 }} value={eventType} onChange={handleChangeEventType}>
            <FormControlLabel value="JBT goes" control={<Radio />} label="JBT goes" />
            <FormControlLabel value="WW" control={<Radio />} label="WW" />
            <FormControlLabel value="Netzwerk" control={<Radio />} label="Netzwerk" />
            <FormControlLabel value="Sonstige" control={<Radio />} label="Sonstige" />
          </RadioGroup>
          <Divider sx={{ mb: 3 }} />
        </FormControl>
        {eventType === "JBT goes" || eventType === "Netzwerk" || eventType === "Sonstige" ? (
          <FieldSection fields={editFields} />
        ) : null}
        {eventType === "WW" ? (
          <>
            <Typography variant="h6" sx={{ pl: 1 }}>
              {content}
            </Typography>
            <FieldSection fields={wwFields} />
          </>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ ml: 3, mr: 3, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => {
            dispatch({ type: "reset" });
            errorDispatch({ type: "reset" });
            onClose();
          }}
        >
          Abbrechen
        </Button>
        <Button variant="contained" fullWidth color="primary" onClick={handleSubmit}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventDialog;
