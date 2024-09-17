import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { useApplicationContext } from "../../../context/ApplicationContext";

/**
 * The props of the feedback step of the application form
 */
interface FeedbackStepProps {
  wwStart: Date | null;
  wwEnd: Date | null;
  selectionWeDateStart: Date | null;
  selectionWeDateEnd: Date | null;
}

/**
 * The feedback step of the application form
 * @param wwStart The start date of the working weekend
 * @param wwEnd The end date of the working weekend
 * @param selectionWeDateStart The start date of the selection weekend
 * @param selectionWeDateEnd The end date of the selection weekend
 * @returns The feedback step of the application form
 */
const FeedbackStep = ({ wwStart, wwEnd, selectionWeDateStart, selectionWeDateEnd }: FeedbackStepProps) => {
  const { applicationState, applicationErrorState, updateApplicationState } = useApplicationContext();

  /**
   * Function to handle the change of the checkboxes
   * @param checked - The checked state of the checkbox
   * @param type - The type of the checkbox
   */
  const onChangeCheckbox = (checked: boolean, type: string) => {
    updateApplicationState(type, checked);
  };

  /**
   * Function to handle the change of the selection of the selection weekend
   * @param event The event of the change of the selection weekend selection radio group element
   */
  const onChangeSelectionWeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateApplicationState("availabilitySelectionWeekend", event.target.value);
  };

  return (
    <Stack spacing={6} width={"100%"}>
      <Stack>
        <Typography fontWeight="bold" fontSize={20}>
          Wie bist du auf das JBT aufmerksam geworden?
        </Typography>
        <FormControl size="small" sx={{ pl: 2 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.flyer} />}
            label="Flyer"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "flyer");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.posters} />}
            label="Plakate"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "posters");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.lectures} />}
            label="Präsentation in der Vorlesung"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "lectures");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.friends} />}
            label="Freunde"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "friends");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.internet} />}
            label="Website"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "internet");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.socialMedia} />}
            label="Social Media"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "socialMedia");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.informationStand} />}
            label="Infostand"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "informationStand");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.campusRally} />}
            label="Campus Rallye"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "campusRally");
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={applicationState.partner} />}
            label="JBT Kooperations-Partner"
            onChange={(event, checked) => {
              onChangeCheckbox(checked, "partner");
            }}
          />
          <FormControlLabel
            control={
              <Box display="flex" alignItems="center">
                <Checkbox
                  size="small"
                  checked={applicationState.others}
                  onChange={(event, checked) => {
                    onChangeCheckbox(checked, "others");
                  }}
                />
                <Typography>Sonstiges</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                  value={applicationState.othersText}
                  onChange={(e) => {
                    updateApplicationState("othersText", e.target.value);
                  }}
                  disabled={!applicationState.others}
                />
              </Box>
            }
            label=""
          />
        </FormControl>
      </Stack>
      <Stack spacing={1}>
        <Stack>
          <Typography fontWeight="bold" fontSize={20}>
            Working Weekend
          </Typography>
          <Typography variant="caption">
            Hinweis: Am Working Weekend finden die Pflichtworkshops statt, die Voraussetzung für die Mitgliedsaufnahme
            sind.
          </Typography>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={applicationState.workingWeekend}
              onChange={(event, checked) => {
                onChangeCheckbox(checked, "workingWeekend");
              }}
            />
          }
          label={`Ich kann am Working Weekend (${dayjs(wwStart).format("DD.MM.")} - ${dayjs(wwEnd).format(
            "DD.MM.YYYY"
          )}) teilnehmen `}
        />
      </Stack>
      <Stack spacing={1}>
        <Stack>
          <Typography fontWeight="bold" fontSize={20}>
            Auswahlwochenende
          </Typography>
          <Typography variant="caption">
            Das Auswahlwochenende findet kommendes Wochenende{" "}
            <strong>
              ({dayjs(selectionWeDateStart).format("DD.MM.")} - {dayjs(selectionWeDateEnd).format("DD.MM.YYYY")})
            </strong>{" "}
            statt. Gibt es einen Tag, an dem du absolut nicht kannst?
            <br /> Wir werden dann versuchen dies bei der Einteilung zu berücksichtigen, können es aber leider nicht
            versprechen.
          </Typography>
        </Stack>
        <FormControl size="small" error={applicationErrorState.availabilitySelectionWeekend}>
          <RadioGroup onChange={onChangeSelectionWeDate} value={applicationState.availabilitySelectionWeekend}>
            <FormControlLabel value="kannImmer" control={<Radio size="small" />} label="Ich kann an allen Tagen" />
            <FormControlLabel value="nichtFR" control={<Radio size="small" />} label="Ich kann am Freitag nicht" />
            <FormControlLabel value="nichtSA" control={<Radio size="small" />} label="Ich kann am Samstag nicht" />
            <FormControlLabel value="nichtSO" control={<Radio size="small" />} label="Ich kann am Sonntag nicht" />
          </RadioGroup>
          <FormHelperText>
            {applicationErrorState.availabilitySelectionWeekend ? "Bitte gib deine Verfügbarkeit an." : ""}
          </FormHelperText>
        </FormControl>
      </Stack>
      <Stack spacing={1}>
        <Typography fontWeight="bold" fontSize={20}>
          Datenschutzerklärung
        </Typography>
        <Typography fontWeight="bold" fontSize={16}>
          Mit dem Senden des Antrags stimst du den Bestimmungen der <Link to="/datenschutz">Datenschutzerklärung</Link>{" "}
          zu. Du khast das Recht, die erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default FeedbackStep;
