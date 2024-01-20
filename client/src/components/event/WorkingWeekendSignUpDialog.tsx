import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Dayjs } from "dayjs";

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
  onSubmit: (
    arrival: string,
    departure: string,
    car: boolean,
    vegetarian: boolean,
    remarks: string,
    debitNotice: boolean,
    seats?: number
  ) => void;
}

/**
 * Component to display a dialog to sign up for a working weekend
 * @param open - boolean to determine if the dialog is open
 * @param handleClose - function to close the dialog
 * @param ww - working weekend event to sign up for
 * @param onSubmit - function to submit the sign up
 * @returns The Dialog for the Working Weekend registration
 */
const WorkingWeekendSignUpDialog: React.FunctionComponent<WorkingWeekendSignUpDialogProps> = ({
  open,
  handleClose,
  ww,
  onSubmit,
}: WorkingWeekendSignUpDialogProps) => {
  const [arrival, setArrival] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [car, setCar] = useState<boolean>(false);
  const [seats, setSeats] = useState<number>(0);
  const [vegetarian, setVegetarian] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const [debitNotice, setDebitNotice] = useState<boolean>(false);
  const [errorArrival, setErrorArrival] = useState<boolean>(false);
  const [errorDeparture, setErrorDeparture] = useState<boolean>(false);
  const [errorSeats, setErrorSeats] = useState<boolean>(false);
  const [errorArrivalAfterDeparture, setErrorArrivalAfterDeparture] = useState<boolean>(false);
  const [errorDepartureBeforeArrival, setErrorDepartureBeforeArrival] = useState<boolean>(false);
  const [errorDebitNotice, setErrorDebitNotice] = useState<boolean>(false);

  // Optons for the arrival and departure selection
  const travelOptions = ["FrF", "FrM", "FrA", "SaF", "SaM", "SaA", "SaS", "So"];

  // Function to reset all values and close the dialog
  const handleCancel = () => {
    handleClose();
    setArrival("");
    setDeparture("");
    setCar(false);
    setSeats(0);
    setVegetarian(false);
    setRemarks("");
    setDebitNotice(false);
    setErrorArrival(false);
    setErrorDeparture(false);
    setErrorSeats(false);
    setErrorArrivalAfterDeparture(false);
    setErrorDepartureBeforeArrival(false);
    setErrorDebitNotice(false);
  };

  // Function to check if the arrival is before the departure
  const checkArrivalAndDeparture = (newArrival?: string, newDeparture?: string) => {
    const arrivalIndex = newArrival ? travelOptions.indexOf(newArrival) : travelOptions.indexOf(arrival);
    const departureIndex = newDeparture ? travelOptions.indexOf(newDeparture) : travelOptions.indexOf(departure);

    if (arrivalIndex === -1 || departureIndex === -1) {
      return true;
    }
    // if arrival is after departure return false
    if (arrivalIndex > departureIndex) {
      return false;
    }
    // if departure is before arrival return false
    if (departureIndex < arrivalIndex) {
      return false;
    }
    setErrorArrivalAfterDeparture(false);
    setErrorDepartureBeforeArrival(false);
    return true;
  };

  // Function to submit the sign up
  const handleSubmit = () => {
    // Checks if all required fields are filled out
    if (!arrival || !departure || seats > 9 || !checkArrivalAndDeparture() || !debitNotice) {
      // Reset all error states
      setErrorArrival(false);
      setErrorDeparture(false);
      setErrorSeats(false);
      setErrorArrivalAfterDeparture(false);
      setErrorDepartureBeforeArrival(false);
      setErrorDebitNotice(false);
      if (!arrival) {
        setErrorArrival(true);
      }
      if (!departure) {
        setErrorDeparture(true);
      }
      if (seats > 9) {
        setErrorSeats(true);
      }
      if (!checkArrivalAndDeparture()) {
        setErrorArrivalAfterDeparture(true);
        setErrorDepartureBeforeArrival(true);
      }
      if (!debitNotice) {
        setErrorDebitNotice(true);
      }
      return;
    }
    onSubmit(arrival, departure, car, vegetarian, remarks, debitNotice, seats);
    handleCancel();
  };

  // Functions to handle change of the arrival field
  const onChangeArrival = (event: SelectChangeEvent<string>) => {
    setArrival(event.target.value);
    if (!checkArrivalAndDeparture(event.target.value, departure)) {
      setErrorArrivalAfterDeparture(true);
    } else {
      setErrorArrivalAfterDeparture(false);
    }
  };

  // Functions to handle change of the departure field
  const onChangeDeparture = (event: SelectChangeEvent<string>) => {
    setDeparture(event.target.value);
    if (!checkArrivalAndDeparture(arrival, event.target.value)) {
      setErrorDepartureBeforeArrival(true);
    } else {
      setErrorDepartureBeforeArrival(false);
    }
  };

  // Functions to handle change of the car field
  const onChangeCar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCar(event.target.value === "true");
  };

  // Functions to handle change of the seats field
  const onChangeSeats = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeats(Number(event.target.value));
  };

  // Functions to handle change of the vegetarian field
  const onChangeVegetarian = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVegetarian(event.target.value === "true");
  };

  // Functions to handle change of the remarks field
  const onChangeRemarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  // Functions to handle change of the debitNotice field
  const onChangeDebitNotice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebitNotice(event.target.checked);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle fontWeight={"bold"}>Anmeldung für {ww.name}</DialogTitle>
      <DialogContent sx={{ ml: 1, mr: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={4} sm={2}>
            <Typography fontWeight={"bold"}>Beginn:</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography>{ww.startTime?.format("DD.MM.YYYY")}</Typography>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Typography fontWeight={"bold"}>Ende:</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography>{ww.endTime?.format("DD.MM.YYYY")}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Grid container spacing={3}>
          <Grid container item spacing={1}>
            <Grid container item xs={12} sm={6}>
              <Box width={1}>
                <Typography fontWeight={"bold"}>Anreise</Typography>
                <Select variant="outlined" value={arrival} onChange={onChangeArrival} fullWidth>
                  <MenuItem value={travelOptions[0]}>Freitag früh</MenuItem>
                  <MenuItem value={travelOptions[1]}>Freitag vor dem Mittagessen</MenuItem>
                  <MenuItem value={travelOptions[2]}>Freitag vor dem Abendessen</MenuItem>
                  <MenuItem value={travelOptions[3]}>Samstag vor dem Frühstück</MenuItem>
                  <MenuItem value={travelOptions[4]}>Samstag vor dem Mittagessen</MenuItem>
                  <MenuItem value={travelOptions[5]}>Samstag vor dem Abendessen</MenuItem>
                  <MenuItem value={travelOptions[6]}>Samstag spät</MenuItem>
                </Select>
                {errorArrivalAfterDeparture && (
                  <FormHelperText error>Die Anreise darf nicht vor der Abreise liegen</FormHelperText>
                )}
                {errorArrival && <FormHelperText error>Bitte wähle eine Anreisezeit aus</FormHelperText>}
              </Box>
            </Grid>
            <Grid container item xs={12} sm={6}>
              <Box width={1}>
                <Typography fontWeight={"bold"}>Abreise</Typography>
                <Select variant="outlined" value={departure} onChange={onChangeDeparture} fullWidth>
                  <MenuItem value={travelOptions[1]}>Freitag nach dem Mittagessen</MenuItem>
                  <MenuItem value={travelOptions[2]}>Freitag nach dem Abendessen</MenuItem>
                  <MenuItem value={travelOptions[3]}>Samstag nach dem Frühstück</MenuItem>
                  <MenuItem value={travelOptions[4]}>Samstag nach dem Mittagessen</MenuItem>
                  <MenuItem value={travelOptions[5]}>Samstag nach dem Abendessen</MenuItem>
                  <MenuItem value={travelOptions[7]}>Sonntag</MenuItem>
                </Select>
                {errorDepartureBeforeArrival && (
                  <FormHelperText error>Die Abreise darf nicht vor der Anreise liegen</FormHelperText>
                )}
                {errorDeparture && <FormHelperText error>Bitte wähle eine Abreisezeit aus</FormHelperText>}
              </Box>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={"bold"}>Steht ein Auto zur Verfügung?</Typography>
              <FormControl>
                <RadioGroup row value={car} onChange={onChangeCar}>
                  <FormControlLabel value={true} control={<Radio />} label="Ja" />
                  <FormControlLabel value={false} control={<Radio />} label="Nein" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {car && (
              <Grid item xs={8} sm={6}>
                <Typography fontWeight={"bold"}>Anzahl freier Plätze</Typography>
                <TextField
                  variant="outlined"
                  type="number"
                  size="small"
                  value={seats}
                  onChange={onChangeSeats}
                  fullWidth
                  placeholder="0"
                />
                {errorSeats && <FormHelperText error>Bitte wähle eine Anzahl aus</FormHelperText>}
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Typography fontWeight={"bold"}>Vegetarier</Typography>
            <FormControl>
              <RadioGroup row value={vegetarian} onChange={onChangeVegetarian}>
                <FormControlLabel value={true} control={<Radio />} label="Ja" />
                <FormControlLabel value={false} control={<Radio />} label="Nein" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={"bold"}>Bemerkungen</Typography>
            <TextField
              variant="outlined"
              value={remarks}
              onChange={onChangeRemarks}
              fullWidth
              multiline
              maxRows={10}
              placeholder={"Alt-Trainees: Bitte nachzuholende Pflichtworkshops hier eintragen!"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={"bold"}>Lastschriftverfahren</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <FormControlLabel
                  control={<Checkbox value={debitNotice} onChange={onChangeDebitNotice} />}
                  label="Hiermit ermächtige ich den Junior Business Team e.V., den Beitrag für das Working Weekend von meinem
                 Konto einzuziehen."
                />
                {errorDebitNotice && (
                  <FormHelperText error>Der Einzugsermächtigung muss zugestimmt werden</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Grid>
        </Grid>
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
