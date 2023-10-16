import React, { useState } from "react";
import { Box, TextField, TextFieldProps } from "@mui/material";
import { DatePicker, DateRange } from "@mui/lab";

export const DateRangePicker = () => {
  const [value, setValue] = useState<DateRange<Date>>([null, null]);
  console.log(value);
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <DatePicker
        startText="Beginn"
        endText="Ende"
        label="From"
        value={value[0]}
        onChange={(newValue: Date | null) => {
          setValue([newValue, value[1]]);
        }}
        renderInput={(startProps: TextFieldProps, endProps: TextFieldProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> bis </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </Box>
  );
};
