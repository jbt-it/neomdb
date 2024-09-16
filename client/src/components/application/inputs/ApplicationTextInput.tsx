import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";

/**
 * The interface for the application text input
 */
interface ApplicationTextInputProps {
  value: string;
  label: string;
  attributeName: string;
  inputType?: string;
  inputProps?: any;
  required?: boolean;
  onChange: {
    (e: any): void;
    (event: React.ChangeEvent<HTMLInputElement>): void;
  };
  error?: boolean;
  helperText?: string;
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
  required,
  onChange,
  error,
  helperText,
}: ApplicationTextInputProps) => {
  const isMobile = useResponsive("down", "md");
  return (
    <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "normal" : "center"} spacing={1}>
      <Typography fontWeight="bold" fontSize={18} flex={1}>
        {label}:
      </Typography>
      <TextField
        variant="outlined"
        sx={{ flex: 2 }}
        size="small"
        required={required}
        label={label}
        value={value}
        type={inputType ? inputType : "text"}
        inputProps={inputProps ? inputProps : {}}
        onChange={onChange}
        error={error}
        helperText={error ? helperText : ""}
      />
    </Stack>
  );
};

export default ApplicationTextInput;
