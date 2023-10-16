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
  Skeleton,
  Chip,
  Toolbar,
  Button,
  Box,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { RemoveCircleOutline, AddCircle, Event } from "@mui/icons-material/";
import { events as mockEvents } from "../../mock/events/events";
import { schulungen as mockWorkshops } from "../../mock/events/Workshops";
import { AuthContext } from "../../context/auth-context/AuthContext";

interface Event {
  eventID: number;
  eventName: string;
  beschreibung: string;
  datum: string;
  ende: string;
  startZeit: string;
  endZeit: string;
  ort: string;
  anmeldungsfrist: string;
  ww: boolean;
  netzwerk: boolean;
  jbtgoes: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type commonEventType = {
  ID: number;
  name: string;
  description: string;
  date: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  registrationDeadline: Date | null;
  type: "ww" | "netzwerk" | "jbtGoes" | "sonstige" | "workshop" | "pflichtworkshop";
};

/**
 * Displays the events overview page, all events, all events the user is signed up for and the possibility to sign up or sign out from an event
 * @returns the events overview page
 */
const DisplayEventsOverview: React.FC = () => {
  const { auth, dispatchAuth } = React.useContext(AuthContext);
  const { permissions } = auth;
  const [events, setEvents] = useState<commonEventType[]>([]);
  const [workshops, setWorkshops] = useState<commonEventType[]>([]);
  const [eventsSignedUp, setEventsSignedUp] = useState<commonEventType[]>([]);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
    setTabValue(newTabValue);
  };

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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const getEvents: VoidFunction = useCallback(() => {
    // api.get("/events").then((response) => {
    //   console.log(response.data);
    // });

    const currentEvents: commonEventType[] = [];

    mockEvents.map((event) => {
      currentEvents.push({
        ID: event.eventID,
        name: event.eventName,
        description: event.beschreibung,
        date: new Date(event.datum),
        endDate: new Date(event.ende),
        startTime: new Date(event.startZeit),
        endTime: new Date(event.endZeit),
        location: event.ort,
        registrationDeadline: new Date(event.anmeldungsfrist),
        type: event.ww ? "ww" : event.netzwerk ? "netzwerk" : event.jbtgoes ? "jbtGoes" : "sonstige",
      });
    });
    setEvents(
      currentEvents.filter((event) => (event.registrationDeadline ? event.registrationDeadline > new Date() : true))
    );
  }, [dispatchAuth]);

  const getWorkshops: VoidFunction = useCallback(() => {
    // api.get("/events").then((response) => {
    //   console.log(response.data);
    // });

    const currentWorkshops: commonEventType[] = [];

    mockWorkshops.map((event) => {
      currentWorkshops.push({
        ID: event.schulungsinstanzID,
        name: event.schulungsname,
        description: event.beschreibung,
        date: new Date(event.datum),
        endDate: new Date(event.datum),
        startTime: new Date(event.startzeit),
        endTime: new Date(event.endzeti),
        location: event.ort,
        registrationDeadline: null,
        type: event.art === "Pflichtschulung" ? "pflichtworkshop" : "workshop",
      });
    });

    setWorkshops(currentWorkshops);
  }, [dispatchAuth]);

  const getEventsSignedUp: VoidFunction = useCallback(() => {
    // api.get("/events/signed-up").then((response) => {
    //   console.log(response.data);
    // });

    const currentEvents: commonEventType[] = [];

    mockEvents.map((event) => {
      currentEvents.push({
        ID: event.eventID,
        name: event.eventName,
        description: event.beschreibung,
        date: new Date(event.datum),
        endDate: new Date(event.ende),
        startTime: new Date(event.startZeit),
        endTime: new Date(event.endZeit),
        location: event.ort,
        registrationDeadline: new Date(event.anmeldungsfrist),
        type: event.ww ? "ww" : event.netzwerk ? "netzwerk" : event.jbtgoes ? "jbtGoes" : "sonstige",
      });
    });
    setEventsSignedUp(currentEvents.filter((event) => event.ID === 2 || event.ID === 3));
  }, [dispatchAuth]);

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
  const renderSignUpButton = (eventID: number) => {
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
        <Button variant="contained" startIcon={<Event />} color="info" sx={{ fontWeight: 600 }}>
          Neue Veranstaltung
        </Button>
      );
    }
  };

  /**
   * Renders a chip for the event type
   * @returns the chip component for the event type
   */
  const renderEventChip = (type: string) => {
    if (type === "pflichtworkshop") {
      return <Chip label="Pflichtworkshop" color="secondary" sx={{ margin: 0.5 }} size="small" />;
    } else if (type === "workshop") {
      return <Chip label="Workshop" color="primary" sx={{ margin: 0.5 }} size="small" />;
    }

    if (type === "ww") {
      return <Chip label="WW" color="default" sx={{ margin: 0.5 }} size="small" />;
    } else if (type === "netzwerk") {
      return <Chip label="Netzwerk" color="info" size="small" sx={{ margin: 0.5 }} />;
    } else if (type === "jbtGoes") {
      return <Chip label="JBT goes" color="primary" size="small" sx={{ margin: 0.5 }} />;
    } else {
      return <Chip label="Sonstige" color="warning" size="small" sx={{ margin: 0.5 }} />;
    }
  };

  /**
   * renders a table based on a given array of events --> used for all events and events the user is signed up for
   * ToDo: Make the first column clickable and redirect to the event details page
   * Maybe add a edit button to quickly edit the event
   * @param rows is type of Event[] and contains the events that should be displayed in the table
   * @returns a table with the given events
   */
  const renderTable = (rows: commonEventType[]) => {
    return (
      <TableContainer component={Paper} sx={{ width: "97%", margin: "auto" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Event</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Beschreibung</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Datum</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ende</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Startzeit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Endzeit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ort</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Anmeldungsfrist</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ID}>
                <TableCell>{renderEventChip(row.type)}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.date.toLocaleString(["de"], { dateStyle: "short" })}</TableCell>
                <TableCell>
                  {row.endDate > row.date ? row.endDate.toLocaleString(["de"], { dateStyle: "short" }) : "-"}
                </TableCell>
                <TableCell>{row.startTime.toLocaleTimeString("de")}</TableCell>
                <TableCell>{row.endTime.toLocaleTimeString()}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>
                  {row.registrationDeadline
                    ? row.registrationDeadline.toLocaleString(["de"], { dateStyle: "short" })
                    : null}
                </TableCell>
                <TableCell>{renderSignUpButton(row.ID)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box className={"content-page"}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Veranstaltungen
        </Typography>
        {permissions.length > 0 ? renderNewEventButton() : null}
      </Toolbar>
      {events.length > 0 ? (
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Alle Veranstaltungen" {...a11yProps(0)} />
            <Tab label="Events" {...a11yProps(1)} />
            <Tab label="Workshops" {...a11yProps(2)} />
            <Tab label="Meine Veranstaltungen" {...a11yProps(3)} />
          </Tabs>
          <CustomTabPanel value={tabValue} index={0}>
            {renderTable(events.concat(workshops).sort((a, b) => a.date.getTime() - b.date.getTime()))}
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
        <>
          <Skeleton sx={{ width: "97%", margin: "auto", height: 100 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
          <Skeleton sx={{ width: "97%", margin: "auto", height: 40 }} />
        </>
      )}
    </Box>
  );
};

export default DisplayEventsOverview;
