import { Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";

/**
 * The interface for the application date input
 */
interface ApplicationDateInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Dayjs | null) => void;
  views?: ("year" | "month" | "day")[];
  minDate: Dayjs;
  maxDate: Dayjs;
  error: boolean;
  helperText?: string;
}

/**
 * The date input for the application form
 * @param label - The label of the input
 * @param value - The value of the input
 * @param onChange - The function to update the application state
 * @param views - The views of the date picker
 * @param minDate - The minimum date of the date picker
 * @param maxDate - The maximum date of the date picker
 * @param error - The error state of the input
 * @param helperText - The helper text of the input
 * @returns The date input for the application form
 */
const ApplicationDateInput = ({
  label,
  value,
  onChange,
  views,
  minDate,
  maxDate,
  error,
  helperText,
}: ApplicationDateInputProps) => {
  const isMobile = useResponsive("down", "md");
  return (
    <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
      <Typography fontWeight="bold" fontSize={18} flex={1}>
        {label}:
      </Typography>
      <DatePicker
        sx={{ flex: 2, width: "100%" }}
        views={views}
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            required: true,
            label: label,
            helperText: error ? helperText : "",
            error: error,
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
        minDate={minDate}
        maxDate={maxDate}
        value={value ? dayjs(value) : undefined}
        onChange={onChange}
      />
    </Stack>
  );
};

export default ApplicationDateInput;
