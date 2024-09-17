import React from "react";
import {
  Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useApplicationContext } from "../../../context/ApplicationContext";
import useResponsive from "../../../hooks/useResponsive";
import dayjs, { Dayjs } from "dayjs";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import Job from "../inputs/Job";
import ApplicationTextInput from "../inputs/ApplicationTextInput";
import ApplicationDateInput from "../inputs/ApplicationDateInput";

// a list of universities
const universities = [
  "Universität Hohenheim",
  "Universität Stuttgart",
  "Hochschule der Medien",
  "Duale Hochschule Baden-Württemberg",
  "Hochschule für Technik",
  "Hochschule Esslingen",
  "Hochschule für Wirtschaft und Umwelt",
  "Universität Tübingen",
];

// a list of courses of study
const courseOfStudy = [
  "Wirtschaftswissenschaften",
  "Wirtschaftsinformatik",
  "Informatik",
  "Maschinenbau",
  "Wirtschaftsingenieurwesen",
  "BWL",
];

/**
 * The study step component for the application form
 * @returns The study step component
 */
const StudyStep = () => {
  const isMobile = useResponsive("down", "md");
  const {
    applicationState,
    updateApplicationState,
    applicationErrorState,
    updateApplicationErrorState,
    resetApprenticeship,
  } = useApplicationContext();
  const minStudyStart = dayjs().subtract(6, "year");

  /**
   * Handles the study start date change
   * @param date - The study start date
   */
  const handleStudyStartChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(6, "year")) || date.isAfter(dayjs()))) {
      updateApplicationErrorState("studyStart", true);
    } else {
      updateApplicationState("studyStart", date?.toDate());
      updateApplicationErrorState("studyStart", false);
    }
  };

  // Closes the apprenticeship section
  const handleApprenticeshipClose = () => {
    resetApprenticeship();
  };

  // Opens the apprenticeship section
  const handleApprenticeshipOpen = () => {
    updateApplicationState("apprenticeship", true);
  };

  // Wrapper function to handle both updateErrorState signatures
  const handleUpdateErrorState = (arg1: string, arg2: boolean | number) => {
    if (typeof arg2 === "boolean") {
      // Call updateApplicationErrorState with (attributeName: string, attributeValue: boolean)
      updateApplicationErrorState(arg1, arg2);
    }
  };

  return (
    <Stack width={"100%"} spacing={6}>
      <Stack spacing={1}>
        <Typography fontWeight={"bold"} fontSize={20}>
          Studium
        </Typography>
        <Stack>
          <Typography fontWeight="bold" flex={1} color={"#7d7d7d"}>
            <label>
              Angestrebter Abschluss <span style={{ color: "red" }}>*</span>
            </label>
          </Typography>
          <FormControl fullWidth sx={{ flex: 2 }} size="small">
            <Select
              size="small"
              value={applicationState.enrolledDegree}
              onChange={(e) => updateApplicationState("enrolledDegree", e.target.value)}
            >
              <MenuItem value={"Bachelor"}>Bachelor</MenuItem>
              <MenuItem value={"Master"}>Master</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <Typography fontWeight="bold" color={"#7d7d7d"} flex={1}>
            <label>
              Hochschule <span style={{ color: "red" }}>*</span>
            </label>
          </Typography>
          <Autocomplete
            options={universities}
            sx={{ flex: 2 }}
            fullWidth
            size="small"
            freeSolo
            value={applicationState.enrolledUniversity}
            onChange={(e, value) => updateApplicationState("enrolledUniversity", value)}
            onInputChange={(e, value) => updateApplicationState("enrolledUniversity", value)}
            renderInput={(params) => <TextField variant="outlined" {...params} />}
          />
        </Stack>
        <Stack>
          <Typography fontWeight="bold" color={"#7d7d7d"} flex={1}>
            <label>
              Studienfach <span style={{ color: "red" }}>*</span>
            </label>
          </Typography>
          <Autocomplete
            options={courseOfStudy}
            sx={{ flex: 2 }}
            fullWidth
            size="small"
            freeSolo
            value={applicationState.enrolledSubject}
            onChange={(e, value) => updateApplicationState("enrolledSubject", value)}
            onInputChange={(e, value) => updateApplicationState("enrolledSubject", value)}
            renderInput={(params) => <TextField variant="outlined" {...params} />}
          />
        </Stack>
        <ApplicationDateInput
          label="Studienbeginn"
          value={applicationState.studyStart}
          onChange={handleStudyStartChange}
          views={["month", "year"]}
          minDate={minStudyStart}
          maxDate={dayjs()}
          error={applicationErrorState.studyStart}
          helperText="Bitte gib einen gültigen Studienbeginn an"
          required
        />
        <ApplicationTextInput
          value={applicationState.studySemester || ""}
          label="Fachsemester"
          attributeName="studySemester"
          inputType="number"
          onChange={(e) => {
            updateApplicationState("studySemester", e.target.value);
          }}
          inputProps={{ min: 1 }}
          error={applicationErrorState.studySemester}
          helperText="Bitte gib ein gültiges Fachsemester an"
          required
        />
        <ApplicationTextInput
          label="1. Vertiefung"
          value={applicationState.studyFirstMajor || ""}
          attributeName="studyFirstMajor"
          onChange={(e) => {
            updateApplicationState("studyFirstMajor", e.target.value);
          }}
        />
        <ApplicationTextInput
          label="2. Vertiefung"
          value={applicationState.studySecondMajor || ""}
          attributeName="studySecondMajor"
          onChange={(e) => {
            updateApplicationState("studySecondMajor", e.target.value);
          }}
        />
        <ApplicationTextInput
          label="3. Vertiefung"
          value={applicationState.studyThirdMajor || ""}
          attributeName="studyThirdMajor"
          onChange={(e) => {
            updateApplicationState("studyThirdMajor", e.target.value);
          }}
        />
        {applicationState.enrolledDegree === "Master" ? (
          <>
            <ApplicationTextInput
              label="Studienfach Bachelor"
              value={applicationState.bachelorSubject || ""}
              attributeName="bachelorSubject"
              onChange={(e) => {
                updateApplicationState("bachelorSubject", e.target.value);
              }}
            />
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Hochschule Bachelor:
              </Typography>
              <Autocomplete
                options={universities}
                sx={{ flex: 2 }}
                fullWidth
                size="small"
                freeSolo
                value={applicationState.bachelorUniversity}
                onChange={(e, value) => updateApplicationState("bachelorUniversity", value)}
                onInputChange={(e, value) => updateApplicationState("bachelorUniversity", value)}
                renderInput={(params) => <TextField variant="outlined" {...params} required label="Hochschule" />}
              />
            </Stack>
          </>
        ) : null}
      </Stack>
      <Stack spacing={0}>
        <Stack direction={"row"} spacing={3} alignItems={"center"} width={"100%"}>
          <Typography fontWeight="bold" fontSize={20}>
            Angaben zur Berufsausbildung
          </Typography>
          <IconButton
            onClick={applicationState.apprenticeship ? handleApprenticeshipClose : handleApprenticeshipOpen}
            color={applicationState.apprenticeship ? "error" : "success"}
          >
            {applicationState.apprenticeship ? <RemoveCircle /> : <AddCircle />}
          </IconButton>
        </Stack>
        {applicationState.apprenticeship ? (
          <Job
            type="apprenticeship"
            activity={applicationState.apprenticeshipJob || ""}
            company={applicationState.apprenticeshipCompany || ""}
            location={applicationState.apprenticeshipLocation || ""}
            start={applicationState.apprenticeshipStart || undefined}
            end={applicationState.apprenticeshipEnd || undefined}
            startError={applicationErrorState.apprenticeshipStart}
            endError={applicationErrorState.apprenticeshipEnd}
            updateState={updateApplicationState}
            updateErrorState={handleUpdateErrorState}
          />
        ) : null}
      </Stack>
    </Stack>
  );
};

export default StudyStep;
