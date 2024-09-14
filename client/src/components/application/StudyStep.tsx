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
import React from "react";
import { useApplicationContext } from "../../context/ApplicationContext";
import useResponsive from "../../hooks/useResponsive";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

// a list of universities
const universities = [
  "Universität Hohenheim",
  "Universität Stuttgart",
  "Hochschule der Medien",
  "Hochschule für Technik",
  "Hochschule Esslingen",
  "Duale Hochschule Baden-Württemberg",
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

  // Handles the apprenticeship start date change
  const handleApprenticeshipStartChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateApplicationErrorState("apprenticeshipStart", true);
    } else if (date && applicationState.apprenticeshipEnd && date.isAfter(dayjs(applicationState.apprenticeshipEnd))) {
      updateApplicationErrorState("apprenticeshipStart", true);
    } else {
      updateApplicationState("apprenticeshipStart", date?.toDate());
      updateApplicationErrorState("apprenticeshipStart", false);
    }
  };

  // Handles the apprenticeship end date change
  const handleApprenticeshipEndChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateApplicationErrorState("apprenticeshipEnd", true);
    } else if (
      date &&
      applicationState.apprenticeshipStart &&
      date.isBefore(dayjs(applicationState.apprenticeshipStart))
    ) {
      updateApplicationErrorState("apprenticeshipEnd", true);
    } else {
      updateApplicationState("apprenticeshipEnd", date?.toDate());
      updateApplicationErrorState("apprenticeshipEnd", false);
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

  return (
    <Stack width={isMobile ? "100%" : "60%"} spacing={5}>
      <Stack direction={"column"} spacing={2}>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            Angestrebter Abschluss:
          </Typography>
          <FormControl fullWidth sx={{ flex: 2 }} size="small">
            <InputLabel>Abschluss *</InputLabel>
            <Select
              size="small"
              required
              label="Abschluss"
              value={applicationState.enrolledDegree}
              onChange={(e) => updateApplicationState("enrolledDegree", e.target.value)}
            >
              <MenuItem value={"Bachelor"}>Bachelor</MenuItem>
              <MenuItem value={"Master"}>Master</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            Hochschule:
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
            renderInput={(params) => <TextField variant="outlined" {...params} required label="Hochschule" />}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            Studienfach:
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
            renderInput={(params) => <TextField variant="outlined" {...params} required label="Studienfach" />}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            Studienbeginn:
          </Typography>
          <DatePicker
            sx={{ flex: 2, width: "100%" }}
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small",
                required: true,
                label: "Studienbeginn",
                helperText: applicationErrorState.studyStart ? "Bitte gib einen gültigen Studienbeginn an" : "",
              },
            }}
            minDate={minStudyStart}
            maxDate={dayjs()}
            value={applicationState.studyStart ? dayjs(applicationState.studyStart) : undefined}
            onChange={handleStudyStartChange}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            Fachsemester:
          </Typography>
          <TextField
            variant="outlined"
            sx={{ flex: 2 }}
            size="small"
            required
            label="Fachsemester"
            value={applicationState.studySemester}
            type="number"
            inputProps={{ min: 1 }}
            onChange={(e) => {
              updateApplicationState("studySemester", e.target.value);
            }}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            1. Vertiefung:
          </Typography>
          <TextField
            variant="outlined"
            sx={{ flex: 2 }}
            size="small"
            required
            label="1. Vertiefung"
            value={applicationState.studyFirstMajor}
            onChange={(e) => {
              updateApplicationState("studyFirstMajor", e.target.value);
            }}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            2. Vertiefung:
          </Typography>
          <TextField
            variant="outlined"
            sx={{ flex: 2 }}
            size="small"
            required
            label="2. Vertiefung"
            value={applicationState.studySecondMajor}
            onChange={(e) => {
              updateApplicationState("studySecondMajor", e.target.value);
            }}
          />
        </Stack>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
          <Typography fontWeight="bold" fontSize={18} flex={1}>
            3. Vertiefung:
          </Typography>
          <TextField
            variant="outlined"
            sx={{ flex: 2 }}
            size="small"
            required
            label="3. Vertiefung"
            value={applicationState.studyThirdMajor}
            onChange={(e) => {
              updateApplicationState("studyThirdMajor", e.target.value);
            }}
          />
        </Stack>
        {applicationState.enrolledDegree === "Master" ? (
          <>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Studienfach Bachelor:
              </Typography>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                required
                label="Studienfach Bachelor"
                value={applicationState.bachelorSubject}
                onChange={(e) => {
                  updateApplicationState("bachelorSubject", e.target.value);
                }}
              />
            </Stack>
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
      <Stack spacing={2}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={18}>
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
          <Stack spacing={3}>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Ausbildungsberuf:
              </Typography>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                required
                label="Ausbildungsberuf"
                value={applicationState.apprenticeshipJob}
                onChange={(e) => {
                  updateApplicationState("apprenticeshipJob", e.target.value);
                }}
              />
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Unternehmen:
              </Typography>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                required
                label="Unternehmen"
                value={applicationState.apprenticeshipCompany}
                onChange={(e) => {
                  updateApplicationState("apprenticeshipCompany", e.target.value);
                }}
              />
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Ort:
              </Typography>
              <TextField
                variant="outlined"
                sx={{ flex: 2 }}
                size="small"
                required
                label="Ort"
                value={applicationState.apprenticeshipLocation}
                onChange={(e) => {
                  updateApplicationState("apprenticeshipLocation", e.target.value);
                }}
              />
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Beginn:
              </Typography>
              <DatePicker
                sx={{ flex: 2, width: "100%" }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    required: true,
                    label: "Beginn",
                    helperText: applicationErrorState.apprenticeshipStart ? "Bitte gib einen gültigen Beginn an" : "",
                    error: applicationErrorState.apprenticeshipStart,
                  },
                }}
                minDate={dayjs().subtract(10, "year")}
                maxDate={dayjs()}
                value={applicationState.apprenticeshipStart ? dayjs(applicationState.apprenticeshipStart) : undefined}
                onChange={handleApprenticeshipStartChange}
              />
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
              <Typography fontWeight="bold" fontSize={18} flex={1}>
                Ende:
              </Typography>
              <DatePicker
                sx={{ flex: 2, width: "100%" }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    required: true,
                    label: "Ende",
                    helperText: applicationErrorState.apprenticeshipEnd ? "Bitte gib ein gültiges Ende an" : "",
                    error: applicationErrorState.apprenticeshipEnd,
                  },
                }}
                minDate={dayjs().subtract(10, "year")}
                maxDate={dayjs()}
                value={applicationState.apprenticeshipEnd ? dayjs(applicationState.apprenticeshipEnd) : undefined}
                onChange={handleApprenticeshipEndChange}
              />
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default StudyStep;
