import React, { useCallback, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Box,
  Tabs,
  Tab,
  Stack,
  IconButton,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  Link,
  Container,
  List,
  ListItem,
  Divider,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Switch,
} from "@mui/material";
import { RemoveCircleOutline, AddCircle, Event, FilterList, CalendarMonth } from "@mui/icons-material/";
import { events as mockEvents } from "../../mock/events/events";
import { schulungen as mockWorkshops } from "../../mock/events/Workshops";
import { AuthContext } from "../../context/auth-context/AuthContext";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import LoadingTable from "../../components/general/LoadingTable";
import EventChip from "../../components/event/EventChip";
import EditEventDialog from "./EditEventDialog";
import useResponsive from "../../hooks/useResponsive";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Defines a type that can be used for events and workshops
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
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop" | "Externer Workshop";
};

/**
 * Displays the events overview page, all events, all events the user is signed up for and the possibility to sign up or sign out from an event
 * @returns the events overview page
 */
const DisplayEventsOverview: React.FC = () => {
  const { auth, dispatchAuth } = React.useContext(AuthContext);
  const { permissions } = auth;
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const [events, setEvents] = useState<commonEventType[]>([]);
  const [workshops, setWorkshops] = useState<commonEventType[]>([]);
  const [eventsSignedUp, setEventsSignedUp] = useState<commonEventType[]>([]);
  const [displayedAllEvents, setDisplayedAllEvents] = useState<commonEventType[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<commonEventType[]>([]);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<commonEventType[]>([]);
  const [displayedEventsSignedUp, setDisplayedEventsSignedUp] = useState<commonEventType[]>([]);
  const [displayPastEvents, setDisplayPastEvents] = useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [displayFiters, setDisplayFilters] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf("d")); // is the start date from which on events are displayed, is initialized to the current date
  const [endDate, setEndDate] = useState<Dayjs | null>(); // is the end date until which events are displayed, used for filtering past events
  const [startMonth, setStartMonth] = useState<Dayjs | null>(); // variable that is used for filtering the beginning of the displayed events
  const [endMonth, setEndMonth] = useState<Dayjs | null>(); // variable that is used for filtering the end of the displayed events
  const [startMonthFilter, setStartMonthFilter] = useState<string>(""); // start of month filter field
  const [endMonthFilter, setEndMonthFilter] = useState<string>(""); // end of month filter field
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [displayMonths, setDisplayMonths] = useState<boolean>(false);

  const mobile = useResponsive("down", "sm");

  /**
   * Handles the onClose event of the edit dialog
   */
  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  /**
   * Handles change of the tab value
   */
  const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  /**
   * Function that renders the tab panel
   */
  const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <Box hidden={value !== index} id={`tabpanel-${index}`} {...other}>
        {value === index && <Box sx={{ p: mobile ? 0 : 3 }}>{children}</Box>}
      </Box>
    );
  };

  /**
   * Function that sends the request to get all events from the backend
   * sets the right type for the fields and sets the state for the events cosntant
   */
  const getEvents: VoidFunction = useCallback(() => {
    // api.get("/events").then((response) => {
    //   console.log(response.data);
    // });

    const currentEvents: commonEventType[] = [];

    // initialize the events constant with the mock data
    mockEvents.map((event) => {
      currentEvents.push({
        ID: event.eventID,
        name: event.eventName,
        date: dayjs(event.datum).locale("de"),
        endDate: event.ende ? dayjs(event.ende).locale("de") : dayjs(event.datum).locale("de"),
        startTime: dayjs(event.startZeit).locale("de"),
        endTime: event.endZeit ? dayjs(event.endZeit).locale("de") : null,
        location: event.ort,
        registrationStart: event.anmeldungvon ? dayjs(event.anmeldungvon).locale("de") : null,
        registrationDeadline: event.anmeldungbis ? dayjs(event.anmeldungbis).locale("de") : null,
        participantsCount: event.teilnehmerZahl,
        maximumParticipants: event.maximaleTeilnehmer,
        type: event.ww ? "WW" : event.netzwerk ? "Netzwerk" : event.jbtgoes ? "JBT goes" : "Sonstige",
      });
    });
    setEvents(currentEvents); //.filter((event) => (event.date ? event.date > dayjs() : true)));
  }, [dispatchAuth]);

  /**
   * Function that sends the request to get all workshops from to the backend
   * sets the right type for the fields and sets the state for the workshops
   */
  const getWorkshops: VoidFunction = useCallback(() => {
    // api.get("/events").then((response) => {
    //   console.log(response.data);
    // });

    const currentWorkshops: commonEventType[] = [];

    // initialize the workshops constant with the mock data
    mockWorkshops.map((event) => {
      currentWorkshops.push({
        ID: event.schulungsinstanzID,
        name: event.schulungsname,
        date: dayjs(event.datum).locale("de"),
        endDate: dayjs(event.datum).locale("de"),
        startTime: event.startzeit ? dayjs(event.startzeit).locale("de") : null,
        endTime: event.endzeit ? dayjs(event.endzeit).locale("de") : null,
        location: event.ort,
        registrationStart: event.anmeldungVon ? dayjs(event.anmeldungVon).locale("de") : null,
        registrationDeadline: event.anmeldungBis ? dayjs(event.anmeldungBis).locale("de") : null,
        participantsCount: event.teilnehmerZahl,
        maximumParticipants: event.maximaleTeilnehmerzahl,
        type: event.art === "Pflichtschulung" ? "Pflichtworkshop" : "Workshop",
      });
    });

    setWorkshops(currentWorkshops);
  }, [dispatchAuth]);

  /**
   * Function that sends the request to get all events the user is signed up for to the backend
   * OR MAYBE FILTERS DEPENDING ON THE MEMBER_HAS_EVENT TABLE --> implement in Mock
   */
  const getEventsSignedUp: VoidFunction = useCallback(() => {
    // api.get("/events/signed-up").then((response) => {
    //   console.log(response.data);
    // });

    const currentEvents: commonEventType[] = [];

    // initialize the events the user is signed up for constant with the mock data
    mockEvents.map((event) => {
      currentEvents.push({
        ID: event.eventID,
        name: event.eventName,
        date: dayjs(event.datum),
        endDate: dayjs(event.ende),
        startTime: dayjs(event.startZeit),
        endTime: dayjs(event.endZeit),
        location: event.ort,
        registrationStart: dayjs(event.anmeldungvon),
        registrationDeadline: dayjs(event.anmeldungbis),
        participantsCount: event.teilnehmerZahl,
        maximumParticipants: event.maximaleTeilnehmer,
        type: event.ww ? "WW" : event.netzwerk ? "Netzwerk" : event.jbtgoes ? "JBT goes" : "Sonstige",
      });
    });
    setEventsSignedUp(currentEvents.filter((event) => event.ID === 2 || event.ID === 3));
  }, [dispatchAuth]);

  /**
   * Function that creates a new event and adds it to the list of events
   * TODO: Implement the api call and the correct type for the event and if all necessary fields are filled
   */
  const createEvent = (
    title: string,
    location: string,
    startDate: Dayjs,
    endDate: Dayjs,
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    registrationStart: Dayjs | null,
    registrationEnd: Dayjs | null,
    maxParticipants: number | null,
    organizers: string[],
    description: string,
    type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige"
  ) => {
    const newEvent: commonEventType = {
      ID: events.length + 1,
      name: title,
      location: location,
      date: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      registrationStart: registrationStart,
      registrationDeadline: registrationEnd,
      maximumParticipants: maxParticipants,
      organizers: organizers,
      description: description,
      type: type,
    };
    console.log(newEvent);
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  /**
   * Function that applied the filters to the displayed events and workshops
   */
  const filterEvents = () => {
    // applies the filters to the all events tab
    setDisplayedAllEvents(
      events
        .concat(workshops)
        // filters all events and workshops that are in the past: check if endDate is not null, then check if the date is after the startDate and before the endDate,
        // if endDate is null check if the date is after the startDate
        .filter((event) =>
          endDate
            ? event.date > startDate && event.date < endDate
            : event.endDate
            ? event.endDate >= startDate
            : event.date >= startDate
        )
        // if the startMonth filter is set chek if the date is after the startMonth
        .filter((event) => (startMonth ? event.date > startMonth : true))
        // if the endMonth filter is set chek if the date is before the endMonth
        .filter((event) => (endMonth ? event.date < endMonth : true))
        // if the eventTypeFilter is set check if the event type is included in the filter
        .filter((event) => (eventTypeFilter.length > 0 ? eventTypeFilter.includes(event.type) : true))
    );

    // applies the filters to the events tab
    setDisplayedEvents(
      events
        // filters the events that are in the past: check if endDate is not null, then check if the date is after the startDate and before the endDate,
        // if endDate is null check if the date is after the startDate
        .filter((event) => (endDate ? event.date > startDate && event.date < endDate : event.endDate >= startDate))
        // if the startMonth filter is set chek if the date is after the startMonth
        .filter((event) => (startMonth ? event.date > startMonth : true))
        // if the endMonth filter is set chek if the date is before the endMonth
        .filter((event) => (endMonth ? event.date < endMonth : true))
        // if the eventTypeFilter is set check if the event type is included in the filter
        .filter((event) =>
          eventTypeFilter.length > 0
            ? eventTypeFilter.length === 1 && eventTypeFilter.includes("Workshop")
              ? true
              : eventTypeFilter.includes(event.type)
            : true
        )
    );

    // applies the filters to the workshops tab
    setDisplayedWorkshops(
      workshops
        // filters the workshops that are in the past: check if endDate is not null, then check if the date is after the startDate and before the endDate,
        // if endDate is null check if the date is after the startDate
        .filter((event) => (endDate ? event.date > startDate && event.date < endDate : event.endDate >= startDate))
        // if the startMonth filter is set chek if the date is after the startMonth
        .filter((event) => (startMonth ? event.date > startMonth : true))
        // if the endMonth filter is set chek if the date is before the endMonth
        .filter((event) => (endMonth ? event.date < endMonth : true))
        // if the eventTypeFilter is set check if the event type is included in the filter
        .filter((event) =>
          eventTypeFilter.length > 0 ? (eventTypeFilter.includes("Workshop") ? event.type === "Workshop" : true) : true
        )
    );

    // applies the filters to the events signed up tab
    setDisplayedEventsSignedUp(
      eventsSignedUp
        // filters the events the user is signed up for that are in the past: check if endDate is not null, then check if the date is after the startDate and before the endDate,
        // if endDate is null check if the date is after the startDate
        .filter((event) => (endDate ? event.date > startDate && event.date < endDate : event.endDate >= startDate))
        // if the startMonth filter is set chek if the date is after the startMonth
        .filter((event) => (startMonth ? event.date > startMonth : true))
        // if the endMonth filter is set chek if the date is before the endMonth
        .filter((event) => (endMonth ? event.date < endMonth : true))
        // if the eventTypeFilter is set check if the event type is included in the filter
        .filter((event) => (eventTypeFilter.length > 0 ? eventTypeFilter.includes(event.type) : true))
    );
  };

  /**
   * Function that sends the request to sign out from an event to the backend and removes the event from the list of events the user is signed up for
   */
  const signOutFromEvent = useCallback(
    (event: commonEventType) => {
      // api.get("/events/signed-out").then((response) => {
      //   console.log(response.data);
      // });
      const index = eventsSignedUp.findIndex((e) => e.ID === event.ID);
      if (index !== -1) {
        const newEventsSignedUp = [...eventsSignedUp];
        newEventsSignedUp.splice(index, 1);
        setEventsSignedUp(newEventsSignedUp);
      }
    },
    [eventsSignedUp]
  );

  /**
   * Function that sends the request to sign up for an event to the backend and adds the event to the list of events the user is signed up for
   */
  const signUpForEvent = useCallback(
    (event: commonEventType) => {
      // api.get("/events/signed-up").then((response) => {
      //   console.log(response.data);
      // });
      setEventsSignedUp([...eventsSignedUp, event]);
    },
    [events, eventsSignedUp]
  );

  useEffect(() => {
    getEventsSignedUp();
  }, [getEventsSignedUp]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    getWorkshops();
  }, [getWorkshops]);

  useEffect(() => {
    filterEvents();
  }, [startDate, endDate, startMonth, endMonth, eventTypeFilter, events, workshops, eventsSignedUp]);

  /**
   * Renders button for sign up or sign out from event
   * If the amount of participants is greater of equal the the amount of the maximum participants "Keine Plätze" will be displayed
   * @param event the event for which the button should be rendered
   * @returns the button for sign up or sign out from event
   */
  const renderSignUpButton = (event: commonEventType) => {
    if (eventsSignedUp.some((e) => e.ID === event.ID)) {
      return (
        <Chip
          label="Abmelden"
          color="error"
          size={mobile ? "medium" : "small"}
          variant="outlined"
          icon={<RemoveCircleOutline />}
          onClick={() => {
            signOutFromEvent(event);
          }}
        />
      );
    } else if (
      // check if the registration deadline is in the past or if the registration start is in the future
      (event.registrationDeadline || event.registrationDeadline === null
        ? dayjs().isAfter(event.registrationDeadline?.endOf("d"))
        : false) ||
      (event.registrationStart || event.registrationStart === null
        ? dayjs().isBefore(event.registrationStart?.startOf("d"))
        : false)
    ) {
      return (
        <Chip
          label="Anmelden"
          color="default"
          size={mobile ? "medium" : "small"}
          disabled
          icon={<AddCircle />}
          onClick={() => {
            signUpForEvent(event);
          }}
        />
      );
    } else if (
      // check if the maximum participants is reached
      event.maximumParticipants && event.participantsCount
        ? event.participantsCount >= event.maximumParticipants
        : false
    ) {
      return (
        <Chip
          label="Keine Plätze"
          color="default"
          size={mobile ? "medium" : "small"}
          disabled
          onClick={() => {
            signUpForEvent(event);
          }}
        />
      );
    } else {
      return (
        <Chip
          label="Anmelden"
          color="success"
          size={mobile ? "medium" : "small"}
          icon={<AddCircle />}
          onClick={() => {
            signUpForEvent(event);
          }}
        />
      );
    }
  };

  /**
   * Renders button for new event if the user has the permission to create a new event
   * ToDo: Implement correct permission
   * @returns the button for creating a new event
   */
  const renderNewEventButton = () => {
    if (permissions.length > 0) {
      return (
        <Button
          variant="outlined"
          startIcon={<Event />}
          color="info"
          sx={{ fontWeight: 600, mr: 2 }}
          onClick={() => setEditDialogOpen(true)}
        >
          Neu
        </Button>
      );
    }
  };

  /**
   * Renders the button to show all past events by setting the start date of the list to 01.01.2010
   * Renders the button to show all current events by setting the start date of the list to the current date
   * @returns button to show all past events
   */
  const renderShowAllButton = () => {
    if (displayPastEvents) {
      return (
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          color="primary"
          sx={{ fontWeight: 600 }}
          onClick={() => {
            setDisplayPastEvents(false);
            setStartDate(dayjs().startOf("d"));
            setEndDate(null);
          }}
          size="small"
        >
          {mobile ? "Aktuelle" : "Aktuelle Veranstaltungen"}
        </Button>
      );
    } else {
      return (
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          color="primary"
          sx={{ fontWeight: 600 }}
          onClick={() => {
            setDisplayPastEvents(true);
            setStartDate(dayjs("2000-01-01"));
            setEndDate(dayjs().subtract(1, "day"));
          }}
          size="small"
        >
          {mobile ? "Vergangene" : "Vergangene Veranstaltungen"}
        </Button>
      );
    }
  };

  /**
   * Button that provides the option to reset all filters
   */
  const renderResetFiltersButton = () => {
    return (
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        color="secondary"
        sx={{ fontWeight: 600, margin: mobile ? 1 : 2 }}
        onClick={() => {
          setStartMonthFilter("");
          setEndMonthFilter("");
          setStartMonth(null);
          setEndMonth(null);
          setEventTypeFilter([]);
        }}
      >
        {mobile ? "Zurücksetzen" : "Filter zurücksetzen"}
      </Button>
    );
  };

  /**
   * Function that returns either the start or the end date of a specific month and adds one year if the month is in the past
   * @param month the month for which the date should be returned
   * @param type either start or end
   * @returns the date of the start or end of a month
   */
  function getMonthDate(month: number, type: "start" | "end"): Dayjs {
    const nextYear = dayjs().isAfter(dayjs().month(month).endOf("month"));
    const date =
      type === "start"
        ? nextYear
          ? dayjs().month(month).startOf("month").add(1, "year")
          : dayjs().month(month).startOf("month")
        : nextYear
        ? dayjs().month(month).endOf("month").endOf("d").add(1, "year")
        : dayjs().month(month).endOf("month").endOf("d");
    return date;
  }

  /**
   * Function that sets the start month for the filter
   * Sets the state of the startMonth variable that is responsible for filtering the displayed events
   */
  const onChangeStartMonthFilter = (event: SelectChangeEvent) => {
    switch (event.target.value) {
      case "Januar": {
        setStartMonthFilter("Januar");
        setStartMonth(getMonthDate(0, "start"));
        break;
      }
      case "Februar": {
        setStartMonthFilter("Februar");
        setStartMonth(getMonthDate(1, "start"));
        break;
      }
      case "März": {
        setStartMonthFilter("März");
        setStartMonth(getMonthDate(2, "start"));
        break;
      }
      case "April": {
        setStartMonthFilter("April");
        setStartMonth(getMonthDate(3, "start"));
        break;
      }
      case "Mai": {
        setStartMonthFilter("Mai");
        setStartMonth(getMonthDate(4, "start"));
        break;
      }
      case "Juni": {
        setStartMonthFilter("Juni");
        setStartMonth(getMonthDate(5, "start"));
        break;
      }
      case "Juli": {
        setStartMonthFilter("Juli");
        setStartMonth(getMonthDate(6, "start"));
        break;
      }
      case "August": {
        setStartMonthFilter("August");
        setStartMonth(getMonthDate(7, "start"));
        break;
      }
      case "September": {
        setStartMonthFilter("September");
        setStartMonth(getMonthDate(8, "start"));
        break;
      }
      case "Oktober": {
        setStartMonthFilter("Oktober");
        setStartMonth(getMonthDate(9, "start"));
        break;
      }
      case "November": {
        setStartMonthFilter("November");
        setStartMonth(getMonthDate(10, "start"));
        break;
      }
      case "Dezember": {
        setStartMonthFilter("Dezember");
        setStartMonth(getMonthDate(11, "start"));
        break;
      }
    }
  };

  /**
   * Function that sets the end month for the filter
   * Sets the state of the endMonth variable that is responsible for filtering the displayed events
   */
  const onChangeEndMonthFilter = (event: SelectChangeEvent) => {
    switch (event.target.value) {
      case "Januar": {
        setEndMonthFilter("Januar");
        setEndMonth(getMonthDate(0, "end"));
        break;
      }
      case "Februar": {
        setEndMonthFilter("Februar");
        setEndMonth(getMonthDate(1, "end"));
        break;
      }
      case "März": {
        setEndMonthFilter("März");
        setEndMonth(getMonthDate(2, "end"));
        break;
      }
      case "April": {
        setEndMonthFilter("April");
        setEndMonth(getMonthDate(3, "end"));
        break;
      }
      case "Mai": {
        setEndMonthFilter("Mai");
        setEndMonth(getMonthDate(4, "end"));
        break;
      }
      case "Juni": {
        setEndMonthFilter("Juni");
        setEndMonth(getMonthDate(5, "end"));
        break;
      }
      case "Juli": {
        setEndMonthFilter("Juli");
        setEndMonth(getMonthDate(6, "end"));
        break;
      }
      case "August": {
        setEndMonthFilter("August");
        setEndMonth(getMonthDate(7, "end"));
        break;
      }
      case "September": {
        setEndMonthFilter("September");
        setEndMonth(getMonthDate(8, "end"));
        break;
      }
      case "Oktober": {
        setEndMonthFilter("Oktober");
        setEndMonth(getMonthDate(9, "end"));
        break;
      }
      case "November": {
        setEndMonthFilter("November");
        setEndMonth(getMonthDate(10, "end"));
        break;
      }
      case "Dezember": {
        setEndMonthFilter("Dezember");
        setEndMonth(getMonthDate(11, "end"));
        break;
      }
    }
  };

  /**
   * Function that handles the change on the filter field for the event type
   */
  const onChangeEventTypeFilter = (event: SelectChangeEvent<typeof eventTypeFilter>) => {
    const {
      target: { value },
    } = event;
    setEventTypeFilter(typeof value === "string" ? value.split(",") : value);
  };

  /**
   * Renders a switch to toggle the months in which the events take place
   * @returns the switch that determines if the months of the events should be displayed or not
   */
  const renderMonthSwitch = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayMonths(event.target.checked);
    };
    return <Switch checked={displayMonths} onChange={handleChange} />;
  };

  /**
   * renders the filter fields start month and end month that determine the range of events that should be displayed
   * @returns the filter field
   */
  const renderFilters = () => {
    const eventTypes = ["JBT goes", "WW", "Netzwerk", "Workshop", "Sonstige"];
    return (
      <Stack
        direction={{ xs: "column", lg: "row" }}
        alignItems={{ xs: "flex-start", lg: "center" }}
        sx={{ mt: mobile ? 1.5 : 0 }}
      >
        {!displayPastEvents ? (
          <Box sx={{ display: "flex", direction: "row", alignItems: "center", width: mobile ? "100%" : "auto" }}>
            <FormControl sx={{ m: mobile ? 0 : 1, minWidth: 120 }} size="small">
              <InputLabel>Von</InputLabel>
              <Select label="Monat" value={startMonthFilter} onChange={onChangeStartMonthFilter}>
                <MenuItem value={dayjs().month(0).locale("de").format("MMMM")}>Januar</MenuItem>
                <MenuItem value={dayjs().month(1).locale("de").format("MMMM")}>Februar</MenuItem>
                <MenuItem value={dayjs().month(2).locale("de").format("MMMM")}>März</MenuItem>
                <MenuItem value={dayjs().month(3).locale("de").format("MMMM")}>April</MenuItem>
                <MenuItem value={dayjs().month(4).locale("de").format("MMMM")}>Mai</MenuItem>
                <MenuItem value={dayjs().month(5).locale("de").format("MMMM")}>Juni</MenuItem>
                <MenuItem value={dayjs().month(6).locale("de").format("MMMM")}>Juli</MenuItem>
                <MenuItem value={dayjs().month(7).locale("de").format("MMMM")}>August</MenuItem>
                <MenuItem value={dayjs().month(8).locale("de").format("MMMM")}>September</MenuItem>
                <MenuItem value={dayjs().month(9).locale("de").format("MMMM")}>Oktober</MenuItem>
                <MenuItem value={dayjs().month(10).locale("de").format("MMMM")}>November</MenuItem>
                <MenuItem value={dayjs().month(11).locale("de").format("MMMM")}>Dezember</MenuItem>
              </Select>
            </FormControl>
            <Typography> - </Typography>
            <FormControl sx={{ m: mobile ? 0 : 1, minWidth: 120 }} size="small">
              <InputLabel>Bis</InputLabel>
              <Select label="Monat" value={endMonthFilter} onChange={onChangeEndMonthFilter}>
                <MenuItem value={dayjs().month(0).locale("de").format("MMMM")}>Januar</MenuItem>
                <MenuItem value={dayjs().month(1).locale("de").format("MMMM")}>Februar</MenuItem>
                <MenuItem value={dayjs().month(2).locale("de").format("MMMM")}>März</MenuItem>
                <MenuItem value={dayjs().month(3).locale("de").format("MMMM")}>April</MenuItem>
                <MenuItem value={dayjs().month(4).locale("de").format("MMMM")}>Mai</MenuItem>
                <MenuItem value={dayjs().month(5).locale("de").format("MMMM")}>Juni</MenuItem>
                <MenuItem value={dayjs().month(6).locale("de").format("MMMM")}>Juli</MenuItem>
                <MenuItem value={dayjs().month(7).locale("de").format("MMMM")}>August</MenuItem>
                <MenuItem value={dayjs().month(8).locale("de").format("MMMM")}>September</MenuItem>
                <MenuItem value={dayjs().month(9).locale("de").format("MMMM")}>Oktober</MenuItem>
                <MenuItem value={dayjs().month(10).locale("de").format("MMMM")}>November</MenuItem>
                <MenuItem value={dayjs().month(11).locale("de").format("MMMM")}>Dezember</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : null}
        <FormControl sx={{ width: 180, ml: mobile ? 0 : 1, mt: mobile ? 1 : 0 }} size="small">
          <InputLabel>Veranstaltungsart</InputLabel>
          <Select
            label="Veranstaltungsart"
            multiple
            value={eventTypeFilter}
            renderValue={(selected) => selected.join(", ")}
            onChange={onChangeEventTypeFilter}
          >
            {eventTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={eventTypeFilter.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          direction={"row"}
          sx={{
            mr: 1,
            ml: "auto",
            fontWeight: 600,
            alignItems: "center",
          }}
        >
          <Box>
            {mobile ? "Monate" : "Monate anzeigen:"}
            {renderMonthSwitch()}
          </Box>
          {renderResetFiltersButton()}
        </Stack>
      </Stack>
    );
  };

  /**
   * renders a table based on a given array of events --> used for all events and events the user is signed up for
   * Maybe add a edit button to quickly edit the event
   * @param rows is type of Event[] and contains the events that should be displayed in the table
   * @returns a table with the given events
   */
  const renderTable = (rows: commonEventType[]) => {
    rows
      .sort((a, b) => a.date.get("date") - b.date.get("date"))
      .sort((a, b) => a.date.get("month") - b.date.get("month"))
      .sort((a, b) => a.date.get("year") - b.date.get("year"));
    if (displayPastEvents) {
      rows.reverse();
    }

    if (!displayPastEvents) {
      startMonth ? rows.filter((event) => event.date > startMonth) : null;
      endMonth ? rows.filter((event) => event.date < endMonth) : null;
    }
    return (
      <TableContainer component={Paper} sx={{ margin: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Event</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Uhrzeit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Anmeldungsfrist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/** Show Months of events? Or just display all events?*/}
            {rows.map((row, index) => (
              <React.Fragment key={row.ID}>
                {displayMonths ? (
                  index === 0 || row.date.month() !== rows[index - 1].date.month() ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, bgcolor: "#f6891f" }}>
                        <Typography color={"white"} fontWeight={"bold"} sx={{ ml: 2 }}>
                          {row.date.locale("de").format("MMMM YYYY")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : null
                ) : null}
                <TableRow>
                  <TableCell>
                    <Link href={`#/veranstaltungen/${row.ID}`}>
                      <EventChip type={row.type} size="small" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link color="textPrimary" underline="hover" href={`#/veranstaltungen/${row.ID}`}>
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {row.date.format("DD.MM.YYYY")}
                    {row.endDate > row.date ? " - " + row.endDate.format("DD.MM.YYYY") : null}
                  </TableCell>
                  <TableCell>
                    {row.startTime ? row.startTime.format("HH:mm") : null}
                    {row.startTime && !row.endTime ? null : " - "}
                    {row.endTime ? row.endTime.format("HH:mm") : null}
                  </TableCell>
                  <TableCell>
                    <Stack justifyContent={"space-between"} direction={"row"} alignItems={"center"}>
                      {row.registrationDeadline && row.registrationStart ? (
                        // check if registration start is in the future
                        row.registrationStart > dayjs() ? (
                          // then display the registration start
                          <Typography variant={"subtitle2"} color="text.secondary">
                            {row.registrationStart.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        ) : row.registrationDeadline > dayjs() ? (
                          // else check if registration deadline is in the future and display it
                          <Typography variant={"subtitle2"}>
                            {row.registrationDeadline.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        ) : (
                          <Typography variant={"caption"}>Abgelaufen</Typography>
                        )
                      ) : row.registrationDeadline ? (
                        // if the registrationStart is null check if the registrationDeadline is not null if so display it
                        row.registrationDeadline > dayjs() ? (
                          <Typography variant={"subtitle2"}>
                            {row.registrationDeadline.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        ) : (
                          <Typography variant={"caption"}>Abgelaufen</Typography>
                        )
                      ) : (
                        <Box />
                      )}
                      <Box ml={0.5}>
                        {row.registrationDeadline && row.endDate > dayjs() ? renderSignUpButton(row) : null}
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  /**
   * Renders the table for the mobile site
   * @param rows the events that should be displayed in the table
   */
  const renderMobileView = (rows: commonEventType[]) => {
    rows
      .sort((a, b) => a.date.get("date") - b.date.get("date"))
      .sort((a, b) => a.date.get("month") - b.date.get("month"))
      .sort((a, b) => a.date.get("year") - b.date.get("year"));

    if (displayPastEvents) {
      rows.reverse();
    }

    startMonth ? rows.filter((event) => event.date > startMonth) : null;
    endMonth ? rows.filter((event) => event.date < endMonth) : null;
    return (
      <List disablePadding sx={{ mt: 2, mr: 3 }}>
        {rows.map((row, index) => (
          <React.Fragment>
            {displayMonths ? (
              index === 0 || row.date.month() !== rows[index - 1].date.month() ? (
                <ListItem sx={{ mb: 1, color: "#f6891f", borderBottom: 1 }} key={row.ID}>
                  <Typography fontWeight={"bold"} variant="body1" sx={{ ml: -2 }}>
                    {row.date.locale("de").format("MMMM YYYY")}
                  </Typography>
                </ListItem>
              ) : null
            ) : null}
            <Card
              sx={{ p: 0.5, flexDirection: "column", alignItems: "flex-start", mb: 1, width: "100%" }}
              style={{ boxShadow: "none" }}
            >
              <CardActionArea component={Link} href={`#/veranstaltungen/${row.ID}`}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: "flex", direction: "row", alignItems: "center" }}>
                    <EventChip type={row.type} size="small" sx={{ ml: -0.5, mr: 1 }} />
                    <Typography variant={"body1"} fontWeight={"bold"}>
                      {row.name}
                    </Typography>
                  </Box>
                  <Stack direction="row">
                    <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                      Datum: &nbsp;
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {row.date.format("DD.MM.YYYY")}
                      {row.endDate > row.date ? " - " + row.endDate.format("DD.MM.YYYY") : null}
                    </Typography>
                  </Stack>
                  <Box>
                    {row.registrationDeadline && row.registrationStart ? (
                      // check if registration start is in the future
                      row.registrationStart > dayjs() ? (
                        // then display the registration start
                        <Stack direction="row" alignItems="center">
                          <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                            Anmeldung ab: &nbsp;
                          </Typography>
                          <Typography variant={"subtitle2"} color="text.secondary">
                            {row.registrationStart.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        </Stack>
                      ) : row.registrationDeadline > dayjs() ? (
                        // else check if registration deadline is in the future and display it
                        <Stack direction="row" alignItems="center">
                          <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                            Anmeldung bis: &nbsp;
                          </Typography>
                          <Typography variant={"subtitle2"} color="text.secondary">
                            {row.registrationDeadline.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center">
                          <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                            Anmeldung: &nbsp;
                          </Typography>
                          <Typography variant={"subtitle2"} color="text.secondary">
                            Abgelaufen
                          </Typography>
                        </Stack>
                      )
                    ) : row.registrationDeadline ? (
                      // if the registrationStart is null check if the registrationDeadline is not null if so display it
                      row.registrationDeadline > dayjs() ? (
                        <Stack direction="row" alignItems="center">
                          <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                            Anmeldung bis: &nbsp;
                          </Typography>
                          <Typography variant={"subtitle2"} color="text.secondary">
                            {row.registrationDeadline.format("DD.MM.YYYY [/] HH:mm")}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center">
                          <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                            Anmeldung: &nbsp;
                          </Typography>
                          <Typography variant={"subtitle2"} color="text.secondary">
                            Abgelaufen
                          </Typography>
                        </Stack>
                      )
                    ) : (
                      <Box />
                    )}
                  </Box>
                  <Box>
                    {row.startTime ? (
                      <Stack direction="row">
                        <Typography variant="body2" color="textSecondary" fontWeight={"bold"}>
                          Uhrzeit: &nbsp;
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {row.startTime ? row.startTime.format("HH:mm") : null}
                          {row.startTime && !row.endTime ? null : " - "}
                          {row.endTime ? row.endTime.format("HH:mm") : null}
                        </Typography>
                      </Stack>
                    ) : null}
                  </Box>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ p: 0, pt: 0.5 }}>
                <Box sx={{ p: 0, ml: "auto" }}>
                  {row.registrationDeadline && row.endDate > dayjs() ? renderSignUpButton(row) : null}
                </Box>
              </CardActions>
            </Card>
            <Divider sx={{ mb: 2 }} />
          </React.Fragment>
        ))}
      </List>
    );
  };

  /**
   * Returns the content of the actual page
   */
  return (
    <Container maxWidth="lg" sx={{ ml: mobile ? 0 : 1 }}>
      <Stack
        direction={mobile ? "column" : "row"}
        justifyContent={"space-between"}
        sx={{ ml: mobile ? 0 : 3, mr: mobile ? 2 : 3 }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight={"bold"}>
          Veranstaltungen
        </Typography>
        <Stack direction={"row"} justifyContent={mobile ? "space-between" : ""}>
          {permissions.length > 0 ? renderNewEventButton() : null}
          {renderShowAllButton()}
        </Stack>
      </Stack>
      {events.length > 0 ? (
        <Box>
          <Box sx={{ ml: mobile ? 0 : 2 }}>{displayFiters ? renderFilters() : null}</Box>
          <Stack direction={"row"} alignItems="center" justifyContent="space-between">
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ ml: mobile ? 0 : 3 }}>
              <Tab label={mobile ? "Alle Events" : "Alle Veranstaltungen"} />
              <Tab label={mobile ? "Meine Events" : "Meine Veranstaltungen"} />
              {!mobile ? <Tab label="Events" /> : null}
              {!mobile ? <Tab label="Workshops" /> : null}
            </Tabs>
            <IconButton
              sx={{ width: 35, height: 35, mr: mobile ? 1 : 3 }}
              onClick={() => {
                setDisplayFilters((prev) => !prev);
              }}
            >
              <FilterList />
            </IconButton>
          </Stack>
          <CustomTabPanel value={tabValue} index={0}>
            {mobile ? renderMobileView(displayedAllEvents) : renderTable(displayedAllEvents)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            {mobile ? renderMobileView(displayedEventsSignedUp) : renderTable(displayedEventsSignedUp)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
            {renderTable(displayedEvents)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={3}>
            {renderTable(displayedWorkshops)}
          </CustomTabPanel>
          <EditEventDialog
            newEvent
            open={editDialogOpen}
            onClose={handleDialogClose}
            onSubmit={(
              title: string,
              location: string,
              startDate: Dayjs,
              endDate: Dayjs,
              startTime: Dayjs | null,
              endTime: Dayjs | null,
              registrationStart: Dayjs | null,
              registrationEnd: Dayjs | null,
              maxParticipants: number | null,
              organizers: string[],
              description: string,
              type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige"
            ) => {
              createEvent(
                title,
                location,
                startDate,
                endDate,
                startTime,
                endTime,
                registrationStart,
                registrationEnd,
                maxParticipants,
                organizers,
                description,
                type
              );
            }}
          />
        </Box>
      ) : (
        <LoadingTable />
      )}
    </Container>
  );
};

export default DisplayEventsOverview;
