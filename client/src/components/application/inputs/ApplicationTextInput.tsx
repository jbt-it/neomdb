import { Stack, TextField, Typography } from "@mui/material";
import React from "react";

/**
 * The interface for the application text input
 */
interface ApplicationTextInputProps {
  value: string;
  label: string;
  attributeName: string;
  inputType?: string;
  inputProps?: any;
  onChange: {
    (e: any): void;
    (event: React.ChangeEvent<HTMLInputElement>): void;
  };
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

/**
 * The text input for the application form
 * @param value - The value of the input
 * @param label - The label of the input
 * @param inputType - The type of the input
 * @param inputProps - The properties of the input
 * @param onChange - The function to update the application state
 * @param error - The error state of the input
 * @param helperText - The helper text of the input
 * @returns The text input for the application form
 */
const ApplicationTextInput = ({
  value,
  label,
  inputType,
  inputProps,
  onChange,
  error,
  helperText,
  required,
}: ApplicationTextInputProps) => {
  return (
    <Stack direction={"column"} width={"100%"}>
      <Typography fontWeight={"bold"} flex={1} width={"100%"} color={"#7d7d7d"}>
        <label htmlFor={label}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      </Typography>
      <TextField
        variant="outlined"
        sx={{ flex: 2 }}
        size="small"
        value={value}
        type={inputType ? inputType : "text"}
        inputProps={inputProps ? inputProps : {}}
        onChange={onChange}
        error={error}
        helperText={error ? helperText : ""}
        fullWidth
      />
    </Stack>
  );
};

export default ApplicationTextInput;
