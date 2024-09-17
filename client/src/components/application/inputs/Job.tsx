import { IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { ApplicationPracticalExperience } from "../../../types/applicationTypes";
import { RemoveCircle } from "@mui/icons-material";

/**
 * The interface for the job component
 */
interface JobProps {
  type: string;
  activity: string;
  company: string;
  location: string;
  start: Date | undefined;
  end: Date | undefined;
  activityError: boolean;
  companyError: boolean;
  locationError: boolean;
  startError: boolean;
  endError: boolean;
  updateState: {
    (type: string, job: ApplicationPracticalExperience): void;
    (attributeName: string, attributeValue: string | Date | undefined | null): void;
  };
  updateErrorState: {
    (attributeName: string, attributeValue: boolean): void;
    (type: string, jobId: number, errorName: string, errorValue: boolean): void;
  };
}

/**
 * The interface for the hiwi / student job component
 */
interface StudentJobProps extends JobProps {
  job: ApplicationPracticalExperience;
  removePracticalExperienceJob: (type: string, id: number) => void;
}

// Type guard to check if props are StudentJobProps
const isStudentJobProps = (props: JobProps | StudentJobProps): props is StudentJobProps => {
  return (props as StudentJobProps).removePracticalExperienceJob !== undefined;
};

/**
 * The job component to display the job information activity, company, location, start and end date
 * @param type - The type of the job (apprenticeship, occupation, hiwiStudentJob, internship)
 * @param activity - The activity state of the job
 * @param company - The company state of the job
 * @param location - The location state of the job
 * @param start - The start date state of the job
 * @param end - The end date state of the job
 * @param startError - The error state of the start date
 * @param endError - The error state of the end date
 * @param updateState - The function to update the state
 * @param updateErrorState - The function to update the error state
 * @param job - The job object
 * @param removePracticalExperienceJob - The function to remove a job
 * @returns The job component
 */
const Job: React.FC<JobProps | StudentJobProps> = (props) => {
  const {
    type,
    activity,
    company,
    location,
    start,
    end,
    activityError,
    companyError,
    locationError,
    startError,
    endError,
    updateState,
    updateErrorState,
  } = props;
  const isMobile = useResponsive("down", "sm");

  // Label for the different job types
  const labelActivity = type === "apprenticeship" ? "Ausbildungsberuf" : "Tätigkeit";

  // Attributes for the different job types
  const attributes: {
    [key: string]: {
      activity: string;
      company: string;
      location: string;
      start: string;
      end: string;
    };
  } = {
    apprenticeship: {
      activity: "apprenticeshipJob",
      company: "apprenticeshipCompany",
      location: "apprenticeshipLocation",
      start: "apprenticeshipStart",
      end: "apprenticeshipEnd",
    },
    occupation: {
      activity: "occupation",
      company: "occupationCompany",
      location: "occupationLocation",
      start: "occupationStart",
      end: "occupationEnd",
    },
  };

  // Helper function to update error state
  const updateError = (field: string, error: boolean) => {
    if (isStudentJobProps(props) && (type === "hiwiStudentJob" || type === "internship")) {
      updateErrorState(type, props.job.id, field, error);
    } else {
      updateErrorState(field, error);
    }
  };

  // Helper function to update state
  const updateField = (field: string, value: Date | undefined | string | null) => {
    const isDate = field === "start" || field === "end";
    if (isStudentJobProps(props) && (type === "hiwiStudentJob" || type === "internship")) {
      updateState(type, { ...props.job, [field]: value });
    } else {
      if (type === "apprenticeship" && isDate) {
        updateState(field === "start" ? "apprenticeshipStart" : "apprenticeshipEnd", value);
      } else if (type === "occupation" && isDate) {
        updateState(field === "start" ? "occupationStart" : "occupationEnd", value);
      } else {
        updateState(field, value);
      }
    }
  };

  // Handles the start date change
  const handleStartChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateField("start", null); // Set to null when invalid
      updateError("start", true);
    } else if (date && end && date.isAfter(dayjs(end))) {
      updateField("start", null); // Set to null when invalid
      updateError("start", true);
    } else {
      console.log(date);
      updateField("start", date?.toDate());
      updateError("start", false);
    }
  };

  // Handles the end date change
  const handleEndChange = (date: Dayjs | null) => {
    if (date && (date.isBefore(dayjs().subtract(10, "year")) || date.isAfter(dayjs()))) {
      updateField("end", null); // Set to null when invalid
      updateError("end", true);
    } else if (date && start && date.isBefore(dayjs(start))) {
      updateField("end", null); // Set to null when invalid
      updateError("end", true);
    } else {
      updateField("end", date?.toDate());
      updateError("end", false);
    }
  };

  // Helper function to handle activity change
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = type === "hiwiStudentJob" || type === "internship" ? "activity" : attributes[type].activity;
    updateField(field, e.target.value);
  };

  // Helper function to handle company change
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = type === "hiwiStudentJob" || type === "internship" ? "company" : attributes[type].company;
    updateField(field, e.target.value);
  };

  // Helper function to handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = type === "hiwiStudentJob" || type === "internship" ? "location" : attributes[type].location;
    updateField(field, e.target.value);
  };

  return (
    <Stack
      spacing={1}
      border={1}
      borderRadius={isMobile ? 5 : 10}
      component={Paper}
      elevation={0}
      borderColor={"#c4c4c4"}
      padding={3}
    >
      <Stack direction={"column"}>
        <Typography fontWeight="bold" color={activityError ? "error" : "#7d7d7d"} flex={1}>
          <label htmlFor={labelActivity}>
            {labelActivity} <span style={{ color: "red" }}>*</span>
          </label>
        </Typography>
        <Stack direction={"row"} spacing={1} flex={2}>
          <TextField
            variant="outlined"
            sx={{ flex: 2 }}
            size="small"
            value={activity}
            onChange={handleActivityChange}
            error={activityError}
            helperText={
              activityError
                ? type === "apprenticeship"
                  ? "Bitte gib einen gültigen Ausbildungsberuf an."
                  : "Bitte gib eine gültige Tätigkeit an."
                : ""
            }
          />
          {isStudentJobProps(props) && (
            <IconButton onClick={() => props.removePracticalExperienceJob(type, props.job.id)} color={"error"}>
              {<RemoveCircle />}
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Stack>
        <Typography fontWeight="bold" color={companyError ? "error" : "#7d7d7d"} flex={1}>
          <label htmlFor={labelActivity}>
            Unternehmen <span style={{ color: "red" }}>*</span>
          </label>
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          value={company}
          onChange={handleCompanyChange}
          error={companyError}
          helperText={companyError ? "Bitte gib ein gültiges Unternehmen an." : ""}
        />
      </Stack>
      <Stack>
        <Typography fontWeight="bold" color={locationError ? "error" : "#7d7d7d"} flex={1}>
          <label htmlFor={labelActivity}>
            Ort <span style={{ color: "red" }}>*</span>
          </label>
        </Typography>
        <TextField
          variant="outlined"
          sx={{ flex: 2 }}
          size="small"
          value={location}
          onChange={handleLocationChange}
          error={locationError}
          helperText={locationError ? "Bitte gib einen gültigen Ort an." : ""}
        />
      </Stack>
      <Stack>
        <Typography fontWeight="bold" color={startError ? "error" : "#7d7d7d"} flex={1}>
          <label htmlFor={labelActivity}>
            Beginn <span style={{ color: "red" }}>*</span>
          </label>
        </Typography>
        <DatePicker
          sx={{ flex: 2, width: "100%" }}
          views={["month", "year"]}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: startError ? "Bitte gib einen gültigen Beginn an." : "",
              error: startError,
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
          minDate={dayjs().subtract(10, "year")}
          maxDate={dayjs()}
          value={start ? dayjs(start) : undefined}
          onChange={handleStartChange}
        />
      </Stack>
      <Stack>
        <Typography fontWeight="bold" color={endError ? "error" : "#7d7d7d"} flex={1}>
          <label htmlFor={labelActivity}>
            Ende <span style={{ color: "red" }}>*</span>
          </label>
        </Typography>
        <DatePicker
          views={["month", "year"]}
          sx={{ flex: 2, width: "100%" }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: endError ? "Bitte gib ein gültiges Ende an." : "",
              error: endError,
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
          minDate={dayjs().subtract(10, "year")}
          maxDate={dayjs()}
          value={end ? dayjs(end) : undefined}
          onChange={handleEndChange}
        />
      </Stack>
    </Stack>
  );
};

export default Job;
