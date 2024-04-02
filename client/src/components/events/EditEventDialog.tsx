import React, { useState, useReducer, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, Divider, Typography } from "@mui/material";
import FieldSection, { Field } from "../general/FieldSection";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { CommonEventType } from "../../types/eventTypes";
import { MembersField } from "../../types/membersTypes";
import useMembers from "../../hooks/members/useMembers";

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventDetails: CommonEventType) => void;
  eventDetails?: CommonEventType;
  eventOrganizers?: any[];
  newEvent?: boolean;
}

interface State {
  name: string;
  location: string;
  startDate: Dayjs | undefined;
  endDate: Dayjs | undefined;
  startTime: Dayjs | undefined;
  endTime: Dayjs | undefined;
  registrationStart: Dayjs | undefined;
  registrationEnd: Dayjs | undefined;
  maxParticipants: number | undefined;
  organizers: MembersField[];
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
 * Dialog to edit or create an event
 * @param param - open: boolean, onClose: function, onSubmit: function, eventDetails: CommonEventType, newEvent: boolean
 * @returns Dialog to edit or create an event
 */
const EditEventDialog = ({
  open,
  onClose,
  onSubmit,
  newEvent,
  eventDetails,
  eventOrganizers,
}: EditEventDialogProps) => {
  const [eventType, setEventType] = useState<
    "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop"
  >(eventDetails?.type || "JBT goes");
  const mobile = useResponsive("down", "md");

  const { members } = useMembers();

  const currentDate = dayjs();
  const content =
    currentDate.month() < 5
      ? "Working Weekend SoSe" + currentDate.format("YY")
      : "Working Weekend WiSe " + currentDate.format("YY") + "/" + currentDate.add(1, "year").format("YY");

  const initialState: State = {
    name: eventDetails?.name || "",
    location: eventDetails?.location || "",
    startDate: eventDetails?.startDate,
    endDate: eventDetails?.endDate,
    startTime: eventDetails?.startTime || undefined,
    endTime: eventDetails?.endTime || undefined,
    registrationStart: eventDetails?.registrationStart || undefined,
    registrationEnd: eventDetails?.registrationEnd || undefined,
    maxParticipants: eventDetails?.maxParticipants || undefined,
    organizers:
      eventOrganizers?.map((organizer) => {
        return {
          mitgliedID: organizer.memberID,
          vorname: organizer.firstName,
          nachname: organizer.lastName,
          mitgliedstatus: organizer.status,
        };
      }) || [],
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

  // set the organizers in the state when the eventOrganizers are loaded
  useEffect(() => {
    if (eventOrganizers) {
      const organizers = eventOrganizers.map((organizer) => {
        return {
          mitgliedID: organizer.memberID,
          vorname: organizer.firstName,
          nachname: organizer.lastName,
          mitgliedstatus: organizer.status,
        };
      });
      dispatch({ type: "set", field: "organizers", value: organizers });
    }
  }, [eventOrganizers]);

  /**
   * Check if all necessary fields are filled out correctly
   * @returns true if all necessary fields are filled out correctly, false otherwise
   */
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

  /**
   * Change the title of the event
   * @param event - The event that triggered the change
   */
  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "name", value: event.target.value });
  };

  /**
   * Change the location of the event
   * @param event - The event that triggered the change
   */
  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "location", value: event.target.value });
  };

  /**
   * Change the start date of the event
   * @param value - The new start date
   */
  const onChangeStartDate = (value: unknown) => {
    let startDate = value as Dayjs;
    startDate = startDate.startOf("day");
    dispatch({ type: "set", field: "startDate", value: startDate });
  };

  /**
   * Change the end date of the event
   * @param value - The new end date
   */
  const onChangeEndDate = (value: unknown) => {
    let endDate = value as Dayjs;
    endDate = endDate.endOf("day");
    dispatch({ type: "set", field: "endDate", value: endDate });
  };

  /**
   * Change the start time of the event
   * @param value - The new start time
   */
  const onChangeStartTime = (value: unknown) => {
    dispatch({ type: "set", field: "startTime", value: value as Dayjs });
  };

  /**
   * Change the end time of the event
   * @param value - The new end time
   */
  const onChangeEndTime = (value: unknown) => {
    dispatch({ type: "set", field: "endTime", value: value as Dayjs });
  };

  /**
   * Change the registration start date of the event
   * @param value - The new registration start date
   */
  const onChangeRegistrationStart = (value: unknown) => {
    dispatch({ type: "set", field: "registrationStart", value: value as Dayjs });
  };

  /**
   * Change the registration end date of the event
   * @param value - The new registration end date
   */
  const onChangeRegistrationEnd = (value: unknown) => {
    dispatch({ type: "set", field: "registrationEnd", value: value as Dayjs });
  };

  /**
   * Change the maximum number of participants of the event
   * @param event - The event that triggered the change
   */
  const onChangeMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "set",
      field: "maxParticipants",
      value: Number(event.target.value) === 0 ? null : Number(event.target.value),
    });
  };

  /**
   * Change the organizers of the event
   * @param event - The event that triggered the change
   * @param value - The new organizers
   */
  const onChangeOrganizers = (event: React.ChangeEvent<object>, value: MembersField[] | MembersField) => {
    dispatch({ type: "set", field: "organizers", value });
  };

  /**
   * Change the description of the event
   * @param event - The event that triggered the change
   */
  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set", field: "description", value: event.target.value });
  };

  /**
   * Change the event type
   * @param event - The event that triggered the change
   */
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

  /**
   * Submit the event details
   * If all necessary fields are filled out correctly, the event details are submitted
   * Otherwise, an error message is displayed
   */
  const handleSubmit = () => {
    if (checkForm()) {
      if (state.startDate !== null) {
        const updatedEventDetails = {
          eventID: eventDetails?.eventID || 0,
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

  // Fields of the form for the different event types except WW
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
      state: state.organizers,
      options: members as MembersField[],
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

  // Fields of the form for the WW event type
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
      state: state.organizers,
      options: members as MembersField[],
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
