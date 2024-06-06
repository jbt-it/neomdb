import { Dayjs } from "dayjs";
import React from "react";
import { ProjectKeyData } from "../../../types/projectTypes";
import { Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

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
    location,
    tenderingDate,
    start,
    duration,
    conditions,
    conditionsRange,
    btMin,
    btMax,
    amountProjectMembersMin,
    amountProjectMembersMax,
    applicationDeadline,
  } = projectKeyData;

  // Function to handle the change of the project name
  const onChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, projectName: event.target.value });
  };

  // Function to handle the change of the location
  const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, location: event.target.value });
  };

  // Function to handle the change of the tendering date
  const onChangeTenderingDate = (date: Dayjs | null) => {
    date
      ? setProjectKeyData({ ...projectKeyData, tenderingDate: date })
      : setProjectKeyData({ ...projectKeyData, tenderingDate: undefined });
  };

  // Function to handle the change of the start date
  const onChangeStart = (date: Dayjs | null) => {
    date
      ? setProjectKeyData({ ...projectKeyData, start: date })
      : setProjectKeyData({ ...projectKeyData, start: undefined });
  };

  // Function to handle the change of the duration
  const onChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, duration: event.target.value });
  };

  // Function to handle the change of the conditions
  const onChangeConditions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, conditions: Number(event.target.value) });
  };

  // Function to handle the change of the conditions range
  const onChangeConditionsRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, conditionsRange: Number(event.target.value) });
  };

  // Function to handle the change of the bt min
  const onChangeBtMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, btMin: Number(event.target.value) });
  };

  // Function to handle the change of the bt max
  const onChangeBtMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, btMax: Number(event.target.value) });
  };

  // Function to handle the change of the amount of project members min
  const onChangeAmountProjectMembersMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, amountProjectMembersMin: Number(event.target.value) });
  };

  // Function to handle the change of the amount of project members max
  const onChangeAmountProjectMembersMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectKeyData({ ...projectKeyData, amountProjectMembersMax: Number(event.target.value) });
  };

  // Function to handle the change of the application deadline
  const onChangeApplicationDeadline = (date: Dayjs | null) => {
    date
      ? setProjectKeyData({ ...projectKeyData, applicationDeadline: date })
      : setProjectKeyData({ ...projectKeyData, applicationDeadline: undefined });
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
          value={location}
          onChange={onChangeLocation}
          disabled={isCompleted}
          error={errors.location}
          helperText={errors.location ? "Einsatzort darf nicht leer sein" : ""}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Ausschreibungsdatum:
        </Typography>
        <DatePicker
          sx={{ flex: 3 }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: errors.tenderingDate ? "Ausschreibungsdatum darf nicht leer sein" : "",
              error: errors.tenderingDate,
            },
          }}
          value={tenderingDate}
          onChange={onChangeTenderingDate}
          disabled={isCompleted}
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
              helperText: errors.start ? "Startschuss darf nicht leer sein" : "",
              error: errors.start,
            },
          }}
          value={start}
          onChange={onChangeStart}
          disabled={isCompleted}
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
          value={duration}
          onChange={onChangeDuration}
          disabled={isCompleted}
          helperText={errors.duration ? "Dauer darf nicht leer sein" : ""}
          error={errors.duration}
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
          value={conditions}
          onChange={onChangeConditions}
          disabled={isCompleted}
          helperText={errors.conditions ? "Konditionen dürfen nicht leer sein" : ""}
          error={errors.conditions}
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
          label="€/BT"
          value={conditionsRange}
          onChange={onChangeConditionsRange}
          disabled={isCompleted}
          helperText={errors.conditionsRange ? "Konditionen (Bereich) dürfen nicht leer sein" : ""}
          error={errors.conditionsRange}
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
          value={btMin}
          onChange={onChangeBtMin}
          disabled={isCompleted}
          helperText={errors.btMin ? "Beratertage (Min) dürfen nicht leer sein" : ""}
          error={errors.btMin}
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
          value={btMax}
          onChange={onChangeBtMax}
          disabled={isCompleted}
          helperText={errors.btMax ? "Beratertage (Max) dürfen nicht leer sein" : ""}
          error={errors.btMax}
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
          value={amountProjectMembersMin}
          onChange={onChangeAmountProjectMembersMin}
          disabled={isCompleted}
          helperText={errors.amountProjectMembersMin ? "Projektmitglieder (Min) dürfen nicht leer sein" : ""}
          error={errors.amountProjectMembersMin}
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
          value={amountProjectMembersMax}
          onChange={onChangeAmountProjectMembersMax}
          disabled={isCompleted}
          helperText={errors.amountProjectMembersMax ? "Projektmitglieder (Max) dürfen nicht leer sein" : ""}
          error={errors.amountProjectMembersMax}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Bewerbungsfrist:
        </Typography>
        <DatePicker
          sx={{ flex: 3 }}
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              helperText: errors.applicationDeadline ? "Bewerbungsfrist darf nicht leer sein" : "",
              error: errors.applicationDeadline,
            },
          }}
          value={applicationDeadline}
          onChange={onChangeApplicationDeadline}
          disabled={isCompleted}
        />
      </Stack>
    </Stack>
  );
};

export default KeyDataStep;
