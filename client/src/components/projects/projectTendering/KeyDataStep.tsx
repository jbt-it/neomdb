import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { ProjectKeyData } from "../../../types/projectTypes";
import { Stack, TextField, Typography } from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";

interface KeyDataStepProps {
  projectKeyData: ProjectKeyData;
  setProjectKeyData: React.Dispatch<React.SetStateAction<ProjectKeyData>>;
  isCompleted: boolean;
  errors: { [key: string]: boolean };
}

/**
 * Component to display the input fieds for the key data step
 * @param projectKeyData - The key data of the project
 * @param setProjectKeyData - Function to set the key data of the project
 * @returns - The input fields for the key data step
 */
const KeyDataStep = ({ projectKeyData, setProjectKeyData, isCompleted, errors }: KeyDataStepProps) => {
  const {
    projectName,
    jobSite,
    tenderDate,
    estimatedProjectStart,
    estimatedProjectDuration,
    estimatedProjectEuroPerBT,
    estimatedProjectEuroPerBTrange,
    estimatedProjectBTmin,
    estimatedProjectBTmax,
    estimatedProjectMemberMin,
    estimatedProjectMemberMax,
    applicationEnd1,
  } = projectKeyData;

  // Function to handle the change of the project name
  const onChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, projectName: event.target.value });
  };

  // Function to handle the change of the location
  const onChangeJobSite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, jobSite: event.target.value });
  };

  // Function to handle the change of the start date
  const onChangeEstimatedProjectStart = (date: Dayjs | null) => {
    date
      ? setProjectKeyData({ ...projectKeyData, estimatedProjectStart: date })
      : setProjectKeyData({ ...projectKeyData, estimatedProjectStart: undefined });
  };

  // Function to handle the change of the duration
  const onChangeEstimatedProjectDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectDuration: event.target.value });
  };

  // Function to handle the change of the conditions
  const onChangeEstimatedProjectEuroPerBT = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectEuroPerBT: Number(event.target.value) });
  };

  // Function to handle the change of the conditions range
  const onChangeEstimatedProjectEuroPerBTrange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectEuroPerBTrange: Number(event.target.value) });
  };

  // Function to handle the change of the bt min
  const onChangeBtMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectBTmin: Number(event.target.value) });
  };

  // Function to handle the change of the bt max
  const onChangeBtMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectBTmax: Number(event.target.value) });
  };

  // Function to handle the change of the amount of project members min
  const onChangeEstimatedProjectMemberMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectMemberMin: Number(event.target.value) });
  };

  // Function to handle the change of the amount of project members max
  const onChangeEstimatedProjectMemberMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, estimatedProjectMemberMax: Number(event.target.value) });
  };

  // Function to handle the change of the application deadline
  const onChangeApplicationEnd1 = (date: Dayjs | null) => {
    date
      ? setProjectKeyData({ ...projectKeyData, applicationEnd1: date })
      : setProjectKeyData({ ...projectKeyData, applicationEnd1: undefined });
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektname:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={projectName}
          onChange={onChangeProjectName}
          disabled={isCompleted}
          error={errors.projectName}
          helperText={errors.projectName ? "Projektname darf nicht leer sein" : ""}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Einsatzort:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={jobSite}
          onChange={onChangeJobSite}
          disabled={isCompleted}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Ausschreibungsdatum:
        </Typography>
        <DateTimePicker
          sx={{ flex: 3 }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
            },
          }}
          value={tenderDate}
          disabled={true}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Startschuss:
        </Typography>
        <DatePicker
          sx={{ flex: 3 }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: errors.estimatedProjectStart ? "Startschuss darf nicht leer sein oder vor heute liegen" : "",
              error: errors.estimatedProjectStart,
            },
          }}
          value={estimatedProjectStart}
          onChange={onChangeEstimatedProjectStart}
          disabled={isCompleted}
          minDate={dayjs()}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Dauer:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          value={estimatedProjectDuration}
          onChange={onChangeEstimatedProjectDuration}
          disabled={isCompleted}
          helperText={errors.estimatedProjectDuration ? "Dauer darf nicht leer sein" : ""}
          error={errors.estimatedProjectDuration}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Konditionen:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectEuroPerBT}
          onChange={onChangeEstimatedProjectEuroPerBT}
          disabled={isCompleted}
          inputProps={{ min: 0 }}
          helperText={errors.estimatedProjectEuroPerBT ? "Konditionen dürfen nicht leer sein" : ""}
          error={errors.estimatedProjectEuroPerBT}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Konditionen (Bereich):
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectEuroPerBTrange}
          onChange={onChangeEstimatedProjectEuroPerBTrange}
          disabled={isCompleted}
          inputProps={{ min: 0 }}
          helperText={
            errors.estimatedProjectEuroPerBTrange
              ? "Konditionen (Bereich) darf nicht niedriger als Konditionen sein"
              : ""
          }
          error={errors.estimatedProjectEuroPerBTrange}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Beratertage (Min):
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectBTmin}
          onChange={onChangeBtMin}
          disabled={isCompleted}
          inputProps={{ min: 1 }}
          helperText={errors.estimatedProjectBTmin ? "Beratertage (Min) dürfen nicht leer sein" : ""}
          error={errors.estimatedProjectBTmin}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Beratertage (Max):
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectBTmax}
          onChange={onChangeBtMax}
          disabled={isCompleted}
          inputProps={{ min: 0 }}
          helperText={
            errors.estimatedProjectBTmax
              ? estimatedProjectBTmax && estimatedProjectBTmin && estimatedProjectBTmax < estimatedProjectBTmin
                ? "Beratertage (Max) dürfen nicht weniger als Beratertage (Min) sein"
                : "Beratertage (Max) dürfen nicht leer sein"
              : ""
          }
          error={errors.estimatedProjectBTmax}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektmitglieder (Min):
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectMemberMin}
          onChange={onChangeEstimatedProjectMemberMin}
          disabled={isCompleted}
          inputProps={{ min: 1 }}
          helperText={errors.estimatedProjectMemberMin ? "Projektmitglieder (Min) dürfen nicht leer sein" : ""}
          error={errors.estimatedProjectMemberMin}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektmitglieder (Max):
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          type="number"
          value={estimatedProjectMemberMax}
          onChange={onChangeEstimatedProjectMemberMax}
          disabled={isCompleted}
          inputProps={{ min: 0 }}
          helperText={
            errors.estimatedProjectMemberMax
              ? estimatedProjectMemberMin &&
                estimatedProjectMemberMax &&
                estimatedProjectMemberMax < estimatedProjectMemberMin
                ? "Projektmitglieder (Max) dürfen nicht weniger als Projektmitglieder (Min) sein"
                : "Projektmitglieder (Max) dürfen nicht leer sein"
              : ""
          }
          error={errors.estimatedProjectMemberMax}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Bewerbungsfrist:
        </Typography>
        <DateTimePicker
          sx={{ flex: 3 }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: errors.applicationEnd1 ? "Bewerbungsfrist muss in der Zukunft liegen" : "",
              error: errors.applicationEnd1,
            },
          }}
          value={applicationEnd1}
          onChange={onChangeApplicationEnd1}
          disabled={isCompleted}
          minDate={dayjs()}
        />
      </Stack>
    </Stack>
  );
};

export default KeyDataStep;
