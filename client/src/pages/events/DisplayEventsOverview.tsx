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
  Toolbar,
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
} from "@mui/material";
import { RemoveCircleOutline, AddCircle, Event, FilterList, CalendarMonth, Add } from "@mui/icons-material/";
import { events as mockEvents } from "../../mock/events/events";
import { schulungen as mockWorkshops } from "../../mock/events/Workshops";
import { AuthContext } from "../../context/auth-context/AuthContext";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import LoadingTable from "../../components/general/LoadingTable";
import EventChip from "../../components/event/EventChip";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type commonEventType = {
  ID: number;
  name: string;
  date: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  location: string;
  registrationStart: Dayjs | null;
  registrationDeadline: Dayjs | null;
  type: "ww" | "netzwerk" | "jbtGoes" | "sonstige" | "workshop" | "pflichtworkshop";
};

/**
 * Displays the events overview page, all events, all events the user is signed up for and the possibility to sign up or sign out from an event
 * ToDo: Max Anmeldungsbutton disable if max participants reached
 * TODO: floating action button --> for mobile site
 * @returns the events overview page
 */
const DisplayEventsOverview: React.FC = () => {
  const { auth, dispatchAuth } = React.useContext(AuthContext);
  const { permissions } = auth;
  const [events, setEvents] = useState<commonEventType[]>([]);
  const [workshops, setWorkshops] = useState<commonEventType[]>([]);
  const [eventsSignedUp, setEventsSignedUp] = useState<commonEventType[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [displayFiters, setDisplayFilters] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs()); // is the start date from which on events are displayed, is initialized to the current date
  const [endDate, setEndDate] = useState<Dayjs | null>(); // is the start date from which on events are displayed, is initialized to the current date
  const [startMonth, setStartMonth] = useState<Dayjs | null>(); // variable that is used for filtering the beginning of the displayed events
  const [endMonth, setEndMonth] = useState<Dayjs | null>(); // variable that is used for filtering the end of the displayed events
  const [startMonthFilter, setStartMonthFilter] = useState<string>(""); // start of month filter field
  const [endMonthFilter, setEndMonthFilter] = useState<string>(""); // end of month filter field
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);

  /**
   * Handles change of the tab value
   */
  const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

  /**
   * Function that renders the tab panel
   */
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  /**
   * Function that sends the request to get all events from the backend
   * sets the right type for the fields and sets the state for the events cosntant
   */
  const getEvents: VoidFunction = useCallback(() => {
    // api.get("/events").then((response) => {
    //   console.log(response.data);
    // });

    const currentEvents: commonEventType[] = [];

    mockEvents.map((event) => {
      currentEvents.push({
        ID: event.eventID,
        name: event.eventName,
        date: dayjs(event.datum).locale("de"),
        endDate: dayjs(event.ende).locale("de"),
        startTime: dayjs(event.startZeit).locale("de"),
        endTime: dayjs(event.endZeit).locale("de"),
        location: event.ort,
        registrationStart: event.anmeldungvon ? dayjs(event.anmeldungvon).locale("de") : null,
        registrationDeadline: event.anmeldungbis ? dayjs(event.anmeldungbis).locale("de") : null,
        type: event.ww ? "ww" : event.netzwerk ? "netzwerk" : event.jbtgoes ? "jbtGoes" : "sonstige",
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

    mockWorkshops.map((event) => {
      currentWorkshops.push({
        ID: event.schulungsinstanzID,
        name: event.schulungsname,
        date: dayjs(event.datum).locale("de"),
        endDate: dayjs(event.datum).locale("de"),
        startTime: dayjs(event.startzeit).locale("de"),
        endTime: dayjs(event.endzeit).locale("de"),
        location: event.ort,
        registrationStart: null,
        registrationDeadline: null,
        type: event.art === "Pflichtschulung" ? "pflichtworkshop" : "workshop",
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
        type: event.ww ? "ww" : event.netzwerk ? "netzwerk" : event.jbtgoes ? "jbtGoes" : "sonstige",
      });
    });
    setEventsSignedUp(currentEvents.filter((event) => event.ID === 2 || event.ID === 3));
  }, [dispatchAuth]);

  /**
   * Function that sends the request to sign out from an event to the backend and removes the event from the list of events the user is signed up for
   */
  const signOutFromEvent = useCallback(
    (eventID: number) => {
      // api.get("/events/signed-out").then((response) => {
      //   console.log(response.data);
      // });
      const index = eventsSignedUp.findIndex((event) => event.ID === eventID);
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
    (eventID: number) => {
      // api.get("/events/signed-up").then((response) => {
      //   console.log(response.data);
      // });
      const newEvent = events.concat(workshops).find((event) => event.ID === eventID) as commonEventType;
      setEventsSignedUp([...eventsSignedUp, newEvent]);
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

  /**
   * Renders button for sign up or sign out from event
   * @param eventID the id of the event
   * @returns the button for sign up or sign out from event
   */
  const renderSignUpButton = (eventID: number, registrationStart: Dayjs | null, registrationDeadline: Dayjs | null) => {
    if (eventsSignedUp.some((event) => event.ID === eventID)) {
      return (
        <Chip
          label="Abmelden"
          color="error"
          size="small"
          variant="outlined"
          icon={<RemoveCircleOutline />}
          onClick={() => {
            signOutFromEvent(eventID);
          }}
        />
      );
    } else if (
      (registrationDeadline || registrationDeadline === null
        ? dayjs().isAfter(registrationDeadline?.endOf("d"))
        : false) ||
      (registrationStart || registrationStart === null ? dayjs().isBefore(registrationStart?.startOf("d")) : false)
    ) {
      return (
        <Chip
          label="Anmelden"
          color="default"
          size="small"
          disabled
          icon={<AddCircle />}
          onClick={() => {
            signUpForEvent(eventID);
          }}
        />
      );
    } else {
      return (
        <Chip
          label="Anmelden"
          color="success"
          size="small"
          icon={<AddCircle />}
          onClick={() => {
            signUpForEvent(eventID);
          }}
        />
      );
    }
  };

  /**
   * Renders button for new event if the user has the permission to create a new event
   * ToDo: Implement correct permission, fuction for dialog and check if mobile --> just show icon on mobile
   * @returns the button for creating a new event
   */
  const renderNewEventButton = () => {
    if (permissions.length > 0) {
      return (
        <Button variant="outlined" startIcon={<Event />} color="info" sx={{ fontWeight: 600 }}>
          Neu
        </Button>
      );
    }
  };

  const [displayAll, setDisplayAll] = useState<boolean>(false);

  /**
   * Renders the button to show all past events by setting the start date of the list to 01.01.2010
   * Renders the button to show all current events by setting the start date of the list to the current date
   * TODO: Sort so I Button is clicked --> the newst event is on top or else we will have to scroll down every time
   * @returns button to show all past events
   */
  const renderShowAllButton = () => {
    if (displayAll) {
      return (
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          color="primary"
          sx={{ fontWeight: 600, ml: 2 }}
          onClick={() => {
            setDisplayAll(false);
            setStartDate(dayjs());
            setEndDate(null);
          }}
        >
          Aktuelle
        </Button>
      );
    } else {
      return (
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          color="primary"
          sx={{ fontWeight: 600, ml: 2 }}
          onClick={() => {
            setDisplayAll(true);
            setStartDate(dayjs("2010-01-01"));
            setEndDate(dayjs().subtract(1, "day"));
          }}
        >
          Vergangene Events
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
        sx={{ fontWeight: 600, margin: 2 }}
        onClick={() => {
          setStartMonthFilter("");
          setEndMonthFilter("");
          setStartMonth(null);
          setEndMonth(null);
          setEventTypeFilter([]);
        }}
      >
        Filter zurücksetzen
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
    //setEventTypeFilter(event.target.value);
    const {
      target: { value },
    } = event;
    setEventTypeFilter(typeof value === "string" ? value.split(",") : value);
  };

  /**
   * renders the filter fields start month and end month that determine the range of events that should be displayed
   * ToDo: Implement filter for type of events
   * @returns the filter field
   */
  const renderFilters = () => {
    const eventTypes = ["jbtGoes", "ww", "netzwerk", "workshop", "sonstige"];
    return (
      <Stack direction={"row"} alignItems="center">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
        <FormControl sx={{ ml: 5, minWidth: 180, mr: "auto" }} size="small">
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
        <Box sx={{ mr: 1, ml: "auto" }}>{renderResetFiltersButton()}</Box>
      </Stack>
    );
  };

  /**
   * renders a table based on a given array of events --> used for all events and events the user is signed up for
   * ToDo: Make the first column clickable and redirect to the event details page
   * Maybe add a edit button to quickly edit the event
   * @param rows is type of Event[] and contains the events that should be displayed in the table
   * @returns a table with the given events
   */
  const renderTable = (rows: commonEventType[]) => {
    rows
      .sort((a, b) => a.date.get("date") - b.date.get("date"))
      .sort((a, b) => a.date.get("month") - b.date.get("month"))
      .sort((a, b) => a.date.get("year") - b.date.get("year"));

    startMonth ? rows.filter((event) => event.date > startMonth) : null;
    endMonth ? rows.filter((event) => event.date < endMonth) : null;
    return (
      <TableContainer component={Paper} sx={{ margin: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Event</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Uhrzeit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ort</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Anmeldungsfrist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ID}>
                <TableCell>
                  <EventChip type={row.type} size="small" />
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
                  {row.startTime.format("HH:mm")} - {row.endTime.format("HH:mm")}
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>
                  <Stack justifyContent={"space-between"} direction={"row"} alignItems={"center"}>
                    {row.registrationDeadline ? (
                      row.registrationStart ? (
                        row.registrationStart.format("DD.MM.YYYY") +
                        " - " +
                        row.registrationDeadline.format("DD.MM.YYYY")
                      ) : (
                        row.registrationDeadline.format("DD.MM.YYYY")
                      )
                    ) : (
                      <Box />
                    )}
                    <Box ml={0.5}>
                      {row.registrationDeadline && row.endDate > dayjs()
                        ? renderSignUpButton(row.ID, row.registrationStart, row.registrationDeadline)
                        : null}
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  /**
   * Returns the content of the actual page
   */
  return (
    <Container maxWidth="lg" className={"content-page"}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Veranstaltungen
        </Typography>
        <Box>
          {permissions.length > 0 ? renderNewEventButton() : null}
          {renderShowAllButton()}
        </Box>
      </Toolbar>
      {events.length > 0 ? (
        <Box>
          <Box sx={{ ml: 2 }}>{displayFiters ? renderFilters() : null}</Box>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ ml: 3 }}>
              <Tab label="Alle Veranstaltungen" />
              <Tab label="Events" />
              <Tab label="Workshops" />
              <Tab label="Meine Veranstaltungen" />
            </Tabs>
            <IconButton
              sx={{ width: 35, height: 35, mr: 3 }}
              onClick={() => {
                setDisplayFilters((prev) => !prev);
              }}
            >
              <FilterList />
            </IconButton>
          </Stack>
          <CustomTabPanel value={tabValue} index={0}>
            {renderTable(
              events
                .concat(workshops)
                .filter((event) => (endDate ? event.date > startDate && event.date < endDate : event.date > startDate))
                .filter((event) => (startMonth ? event.date > startMonth : true))
                .filter((event) => (endMonth ? event.date < endMonth : true))
                .filter((event) => (eventTypeFilter.length > 0 ? eventTypeFilter.includes(event.type) : true))
            )}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            {renderTable(events)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
            {renderTable(workshops)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={3}>
            {renderTable(eventsSignedUp)}
          </CustomTabPanel>
        </Box>
      ) : (
        <LoadingTable />
      )}
    </Container>
  );
};

export default DisplayEventsOverview;
