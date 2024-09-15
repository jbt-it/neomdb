import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { useApplicationContext } from "../../context/ApplicationContext";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { ApplicationPracticalExperience } from "../../types/applicationTypes";

const WorkExperienceStep = () => {
  const isMobile = useResponsive("down", "md");
  const {
    applicationState,
    updateApplicationState,
    applicationErrorState,
    updateApplicationErrorState,
    resetOccupation,
    addHiwiStudentJob,
    removePracticalExperienceJob,
    updatePracticalExperience,
    updatePracticalExperienceError,
  } = useApplicationContext();

  const minStart = dayjs().subtract(10, "year");

  // Closes the apprenticeship section
  const handleOccupationClose = () => {
    resetOccupation();
  };

  // Opens the apprenticeship section
  const handleOccupationOpen = () => {
    updateApplicationState("hasOccupation", true);
  };

  // Handles the change of the occupation start date
  const handleOccupationBeginChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateApplicationErrorState("occupationStart", true);
    } else if (date && applicationState.occupationEnd && date.isAfter(dayjs(applicationState.occupationEnd))) {
      updateApplicationErrorState("occupationStart", true);
    } else {
      updateApplicationState("occupationStart", date?.toDate());
      updateApplicationErrorState("occupationStart", false);
    }
  };

  // Handles the change of the occupation end date
  const handleOccupationEndChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateApplicationErrorState("occupationEnd", true);
    } else if (date && applicationState.occupationStart && date.isBefore(dayjs(applicationState.occupationStart))) {
      updateApplicationErrorState("occupationEnd", true);
    } else {
      updateApplicationState("occupationEnd", date?.toDate());
      updateApplicationErrorState("occupationEnd", false);
    }
  };

  // Handles the change of the hiwi student job start date
  const handleHiwiStudentJobBeginChange = (type: string, date: Dayjs | null, job: ApplicationPracticalExperience) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updatePracticalExperienceError(type, job.id, "start", true);
    } else if (date && job.end && date.isAfter(dayjs(job.end))) {
      updatePracticalExperienceError(type, job.id, "start", true);
    } else {
      updatePracticalExperience(type, { ...job, start: date?.toDate() });
      updatePracticalExperienceError(type, job.id, "start", false);
    }
  };

  // Handles the change of the hiwi student job end date
  const handleHiwiStudentJobEndChange = (type: string, date: Dayjs | null, job: ApplicationPracticalExperience) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updatePracticalExperienceError(type, job.id, "end", true);
    } else if (date && job.start && date.isBefore(dayjs(job.start))) {
      updatePracticalExperienceError(type, job.id, "end", true);
    } else {
      updatePracticalExperience(type, { ...job, end: date?.toDate() });
      updatePracticalExperienceError(type, job.id, "end", false);
    }
  };

  return (
    <Stack spacing={0} width={isMobile ? "100%" : "60%"}>
      <Stack direction={"row"} spacing={3} alignItems={"center"}>
        <Typography fontWeight="bold" fontSize={18}>
          Berufliche Tätigkeit
        </Typography>
        <IconButton
          onClick={applicationState.hasOccupation ? handleOccupationClose : handleOccupationOpen}
          color={applicationState.hasOccupation ? "error" : "success"}
        >
          {applicationState.hasOccupation ? <RemoveCircle /> : <AddCircle />}
        </IconButton>
      </Stack>
      {applicationState.hasOccupation ? (
        <Stack
          spacing={2}
          width={"90%"}
          border={1}
          borderRadius={isMobile ? 5 : 10}
          component={Paper}
          elevation={0}
          borderColor={"#c4c4c4"}
          padding={3}
          marginBottom={4}
        >
          <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
            <Typography fontWeight="bold" fontSize={18} flex={1}>
              Tätigkeit:
            </Typography>
            <TextField
              variant="outlined"
              sx={{ flex: 2 }}
              size="small"
              required
              label="Tätigkeit"
              value={applicationState.occupation}
              onChange={(e) => {
                updateApplicationState("occupation", e.target.value);
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
              value={applicationState.occupationCompany}
              onChange={(e) => {
                updateApplicationState("occupationCompany", e.target.value);
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
              value={applicationState.occupationLocation}
              onChange={(e) => {
                updateApplicationState("occupationLocation", e.target.value);
              }}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
            <Typography fontWeight="bold" fontSize={18} flex={1}>
              Beginn:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              views={["month", "year"]}
              disableFuture
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  required: true,
                  label: "Beginn",
                  helperText: applicationErrorState.occupationStart ? "Bitte gib einen gültigen Beginn an" : "",
                  error: applicationErrorState.occupationStart,
                },
                popper: {
                  modifiers: [
                    {
                      name: "flip",
                      enabled: false,
                    },
                  ],
                },
              }}
              minDate={minStart}
              maxDate={dayjs()}
              value={applicationState.apprenticeshipStart ? dayjs(applicationState.apprenticeshipStart) : undefined}
              onChange={handleOccupationBeginChange}
            />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
            <Typography fontWeight="bold" fontSize={18} flex={1}>
              Ende:
            </Typography>
            <DatePicker
              sx={{ flex: 2, width: "100%" }}
              views={["month", "year"]}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  required: true,
                  label: "Ende",
                  helperText: applicationErrorState.occupationEnd ? "Bitte gib ein gültiges Ende an" : "",
                  error: applicationErrorState.occupationEnd,
                },
                popper: {
                  modifiers: [
                    {
                      name: "flip",
                      enabled: false,
                    },
                  ],
                },
              }}
              minDate={minStart}
              maxDate={dayjs()}
              value={applicationState.apprenticeshipEnd ? dayjs(applicationState.apprenticeshipEnd) : undefined}
              onChange={handleOccupationEndChange}
            />
          </Stack>
        </Stack>
      ) : null}
      <Stack marginBottom={applicationState.hiwiStudentJob.length > 0 ? 4 : 0}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={18}>
            Praktika
          </Typography>
          <IconButton
            onClick={() => {
              addHiwiStudentJob("internship");
            }}
            color={"success"}
          >
            {<AddCircle />}
          </IconButton>
        </Stack>
        <Stack spacing={2}>
          {applicationState.internship.map((job) => {
            return (
              <Stack
                spacing={2}
                width={"90%"}
                border={1}
                borderRadius={isMobile ? 5 : 10}
                component={Paper}
                elevation={0}
                borderColor={"#c4c4c4"}
                padding={3}
              >
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Tätigkeit:
                  </Typography>
                  <Stack direction={"row"} spacing={1} flex={2}>
                    <TextField
                      variant="outlined"
                      sx={{ flex: 2 }}
                      size="small"
                      required
                      label="Tätigkeit"
                      value={job.activity}
                      onChange={(e) => {
                        updatePracticalExperience("internship", { ...job, activity: e.target.value });
                      }}
                    />
                    <IconButton onClick={() => removePracticalExperienceJob("internship", job.id)} color={"error"}>
                      {<RemoveCircle />}
                    </IconButton>
                  </Stack>
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
                    value={job.company}
                    onChange={(e) => {
                      updatePracticalExperience("internship", { ...job, company: e.target.value });
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
                    value={job.location}
                    onChange={(e) => {
                      updatePracticalExperience("internship", { ...job, location: e.target.value });
                    }}
                  />
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Beginn:
                  </Typography>
                  <DatePicker
                    sx={{ flex: 2, width: "100%" }}
                    views={["month", "year"]}
                    disableFuture
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        required: true,
                        label: "Beginn",
                        helperText: applicationErrorState.internship.find((e) => e.id === job.id)?.start
                          ? "Bitte gib einen gültigen Beginn an"
                          : "",
                        error: applicationErrorState.internship.find((e) => e.id === job.id)?.start,
                      },
                      popper: {
                        modifiers: [
                          {
                            name: "flip",
                            enabled: false,
                          },
                        ],
                      },
                    }}
                    minDate={minStart}
                    maxDate={dayjs()}
                    value={job.start ? dayjs(job.start) : undefined}
                    onChange={(date) => handleHiwiStudentJobBeginChange("internship", date, job)}
                  />
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Ende:
                  </Typography>
                  <DatePicker
                    sx={{ flex: 2, width: "100%" }}
                    views={["month", "year"]}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        required: true,
                        label: "Ende",
                        helperText: applicationErrorState.internship.find((e) => e.id === job.id)?.end
                          ? "Bitte gib ein gültiges Ende an"
                          : "",
                        error: applicationErrorState.internship.find((e) => e.id === job.id)?.end,
                      },
                      popper: {
                        modifiers: [
                          {
                            name: "flip",
                            enabled: false,
                          },
                        ],
                      },
                    }}
                    minDate={minStart}
                    maxDate={dayjs()}
                    value={job.end ? dayjs(job.end) : undefined}
                    onChange={(date) => handleHiwiStudentJobEndChange("internship", date, job)}
                  />
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
      <Stack marginBottom={applicationState.hiwiStudentJob.length > 0 ? 4 : 0}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={18}>
            Hiwi- / Werkstudententätigkeit / Nebenjob
          </Typography>
          <IconButton
            onClick={() => {
              addHiwiStudentJob("hiwiStudentJob");
            }}
            color={"success"}
          >
            {<AddCircle />}
          </IconButton>
        </Stack>
        <Stack spacing={2}>
          {applicationState.hiwiStudentJob.map((job) => {
            return (
              <Stack
                spacing={2}
                width={"90%"}
                border={1}
                borderRadius={isMobile ? 5 : 10}
                component={Paper}
                elevation={0}
                borderColor={"#c4c4c4"}
                padding={3}
              >
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Tätigkeit:
                  </Typography>
                  <Stack direction={"row"} spacing={1} flex={2}>
                    <TextField
                      variant="outlined"
                      sx={{ flex: 2 }}
                      size="small"
                      required
                      label="Tätigkeit"
                      value={job.activity}
                      onChange={(e) => {
                        updatePracticalExperience("hiwiStudentJob", { ...job, activity: e.target.value });
                      }}
                    />
                    <IconButton onClick={() => removePracticalExperienceJob("hiwiStudentJob", job.id)} color={"error"}>
                      {<RemoveCircle />}
                    </IconButton>
                  </Stack>
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
                    value={job.company}
                    onChange={(e) => {
                      updatePracticalExperience("hiwiStudentJob", { ...job, company: e.target.value });
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
                    value={job.location}
                    onChange={(e) => {
                      updatePracticalExperience("hiwiStudentJob", { ...job, location: e.target.value });
                    }}
                  />
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Beginn:
                  </Typography>
                  <DatePicker
                    sx={{ flex: 2, width: "100%" }}
                    views={["month", "year"]}
                    disableFuture
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        required: true,
                        label: "Beginn",
                        helperText: applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.start
                          ? "Bitte gib einen gültigen Beginn an"
                          : "",
                        error: applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.start,
                      },
                      popper: {
                        modifiers: [
                          {
                            name: "flip",
                            enabled: false,
                          },
                        ],
                      },
                    }}
                    minDate={minStart}
                    maxDate={dayjs()}
                    value={job.start ? dayjs(job.start) : undefined}
                    onChange={(date) => handleHiwiStudentJobBeginChange("hiwiStudentJob", date, job)}
                  />
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
                  <Typography fontWeight="bold" fontSize={18} flex={1}>
                    Ende:
                  </Typography>
                  <DatePicker
                    sx={{ flex: 2, width: "100%" }}
                    views={["month", "year"]}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        required: true,
                        label: "Ende",
                        helperText: applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.end
                          ? "Bitte gib ein gültiges Ende an"
                          : "",
                        error: applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.end,
                      },
                      popper: {
                        modifiers: [
                          {
                            name: "flip",
                            enabled: false,
                          },
                        ],
                      },
                    }}
                    minDate={minStart}
                    maxDate={dayjs()}
                    value={job.end ? dayjs(job.end) : undefined}
                    onChange={(date) => handleHiwiStudentJobEndChange("hiwiStudentJob", date, job)}
                  />
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
      <Stack spacing={-1}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={18}>
            Ehrenamtliche Tätigkeit / Engagement in der Schulzeit
          </Typography>

          <IconButton
            onClick={applicationState.hasOccupation ? handleOccupationClose : handleOccupationOpen}
            color={applicationState.hasOccupation ? "error" : "success"}
          >
            {applicationState.hasOccupation ? <RemoveCircle /> : <AddCircle />}
          </IconButton>
        </Stack>
        <Typography variant="caption">z.B. Klassensprecher, Schulsprecher, SMV, AG, Verein, ...</Typography>
      </Stack>
      <Stack spacing={-1}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={18}>
            Ehrenamtliche Tätigkeit / Engagement im Studium
          </Typography>
          <IconButton
            onClick={applicationState.hasOccupation ? handleOccupationClose : handleOccupationOpen}
            color={applicationState.hasOccupation ? "error" : "success"}
          >
            {applicationState.hasOccupation ? <RemoveCircle /> : <AddCircle />}
          </IconButton>
        </Stack>
        <Typography variant="caption">z.B. Fachschaft, studentische Initiativen, Verein, ...</Typography>
      </Stack>
    </Stack>
  );
};

export default WorkExperienceStep;
