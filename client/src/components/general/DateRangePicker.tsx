import React from "react";
import { Dayjs } from "dayjs";
import { Box, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface DateRangePickerProps {
  startDate: Dayjs | null;
  onChangeStartDate?: (value: Dayjs | null) => void;
  endDate: Dayjs | null;
  onChangeEndDate?: (value: Dayjs | null) => void;
  startLabel?: string;
  endLabel?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

/**
 * Component to select a date range
 * @param startDate - The start date
 * @param onChangeStartDate - Function to change the start date
 * @param endDate - The end date
 * @param onChangeEndDate - Function to change the end date
 * @param startLabel - Label for the start date
 * @param endLabel - Label for the end date
 * @param minDate - The minimum date
 * @param maxDate - The maximum date
 * @returns - A date range picker
 */
export const DateRangePicker = ({
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  startLabel,
  endLabel,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  return (
    <Stack alignItems="center" direction={"row"}>
      <DatePicker
        label={startLabel ? startLabel : "Beginn"}
        value={startDate}
        onChange={onChangeStartDate ? onChangeStartDate : undefined}
        slotProps={{ textField: { variant: "outlined", size: "small" } }}
        minDate={minDate ? minDate : undefined}
        sx={{ width: 180 }}
      />
      <Box sx={{ mx: 2 }}> - </Box>
      <DatePicker
        label={endLabel ? endLabel : "Ende"}
        value={endDate}
        onChange={onChangeEndDate ? onChangeEndDate : undefined}
        slotProps={{ textField: { variant: "outlined", size: "small" } }}
        maxDate={maxDate ? maxDate : undefined}
        sx={{ width: 180 }}
      />
    </Stack>
  );
};
