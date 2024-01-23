import React from "react";
import { Dayjs } from "dayjs";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface DateRangePickerProps {
  startDate: Dayjs | null;
  setStartDate?: (value: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate?: (value: Dayjs | null) => void;
}

export const DateRangePicker = (props: DateRangePickerProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <DatePicker
        label="Beginn"
        value={props.startDate}
        onChange={props.setStartDate ? props.setStartDate : undefined}
      />
      <Box sx={{ mx: 2 }}> - </Box>
      <DatePicker label="Ende" value={props.endDate} onChange={props.setEndDate ? props.setEndDate : undefined} />
    </Box>
  );
};
