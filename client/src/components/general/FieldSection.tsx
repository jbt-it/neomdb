import React from "react";
import {
  Grid,
  Radio,
  Box,
  TextField,
  Typography,
  MenuItem,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  DateTimeValidationError,
  DateValidationError,
  PickerChangeHandlerContext,
  TimeValidationError,
} from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

type Field = {
  label: string;
  state: unknown;
  width?: "half" | "full";
} & (
  | {
      type: "RadioButton" | "Dropdown";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      values: Array<{ label: string; value: any }>;
      disabled?: boolean;
    }
  | {
      type: "TextBig";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      rows: number;
      disabled?: boolean;
    }
  | {
      type: "Date";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
    }
  | {
      type: "Text";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      inputType?: "number";
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
    }
  | {
      type: "Checkbox";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      disabled?: boolean;
    }
  | {
      type: "Time";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<TimeValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
    }
  | {
      type: "DateTime";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
    }
  | {
      type: "Autocomplete";
      onChangeCallback: (event: React.ChangeEvent<object>, value: string[] | string) => void | null;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
    }
);
interface Props {
  title?: string;
  fields: Array<Field>;
}

const FieldSection = (props: Props) => {
  const theme = useTheme();

  const styles = {
    fieldSectionBox: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      paddingBottom: theme.spacing(2),
    },
    fieldSectionTitle: {
      width: "100%",
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    fieldItem: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    radioButtonField: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
    },
    gridItem: {
      display: "flex",
    },
    radioButtonItem: {
      flexGrow: 1,
    },
    checkboxField: {
      paddingLeft: 1,
    },
  };

  const renderFields = (fields: Field[]) => {
    return fields.map((field: Field, index: number) => {
      let fieldElement: React.JSX.Element = <div></div>;
      if (field.type === "Dropdown") {
        fieldElement = (
          <TextField
            sx={{
              flexGrow: 1,
              marginTop: theme.spacing(1),
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
            }}
            key={index}
            variant="outlined"
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            disabled={field.disabled}
            select
          >
            {field.values.map((value, index) => {
              return (
                <MenuItem value={value.value} key={index}>
                  {value.label}
                </MenuItem>
              );
            })}
          </TextField>
        );
      } else if (field.type === "RadioButton") {
        fieldElement = (
          <RadioGroup sx={styles.fieldItem && styles.radioButtonField}>
            {field.values.map((value, index) => {
              return (
                <FormControlLabel
                  sx={styles.radioButtonItem}
                  value={value.value}
                  control={<Radio />}
                  label={value.label}
                  key={`${value.label + index}`}
                  disabled={field.disabled}
                />
              );
            })}
          </RadioGroup>
        );
      } else if (field.type === "Text") {
        fieldElement = (
          <TextField
            sx={styles.fieldItem}
            error={field.error}
            helperText={field.helperText}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            variant="outlined"
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            type={field.inputType === "number" ? "number" : "text"}
            inputProps={field.inputType === "number" ? { min: 0 } : {}}
            disabled={field.disabled}
          />
        );
      } else if (field.type === "TextBig") {
        fieldElement = (
          <TextField
            sx={styles.fieldItem}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            multiline
            rows={field.rows}
            variant="outlined"
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            disabled={field.disabled}
          />
        );
      } else if (field.type === "Date") {
        fieldElement = (
          <DatePicker
            key={index}
            sx={styles.fieldItem}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            disabled={field.disabled}
          />
        );
      } else if (field.type === "Time") {
        fieldElement = (
          <TimePicker
            key={index}
            sx={styles.fieldItem}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            disabled={field.disabled}
          />
        );
      } else if (field.type === "DateTime") {
        fieldElement = (
          <DateTimePicker
            key={index}
            sx={styles.fieldItem}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            disabled={field.disabled}
          />
        );
      } else if (field.type === "Autocomplete") {
        fieldElement = (
          <Autocomplete
            key={index}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            renderInput={(params) => <TextField variant="outlined" {...params} label={field.label} />}
            options={field.state as string[]}
            sx={styles.fieldItem}
            size="medium"
            multiple
            disabled={field.disabled}
          />
        );
      } else if (field.type === "Checkbox") {
        fieldElement = (
          <FormControlLabel
            sx={styles.fieldItem && styles.checkboxField}
            control={
              <Checkbox
                key={index}
                color="primary"
                checked={field.state as boolean}
                onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
                disabled={field.disabled}
              />
            }
            label={field.label}
          />
        );
      }

      let fieldContainer: React.JSX.Element;
      if (field.width === "half") {
        fieldContainer = (
          <Grid item xs={6} sx={styles.gridItem} key={index}>
            {fieldElement}
          </Grid>
        );
      } else if (field.width === "full") {
        fieldContainer = (
          <Grid item xs={12} sx={styles.gridItem} key={index}>
            {fieldElement}
          </Grid>
        );
      } else {
        fieldContainer = fieldElement;
      }

      return fieldContainer;
    });
  };

  return (
    <Box sx={styles.fieldSectionBox}>
      {props.title ? (
        <Typography variant="h5" sx={styles.fieldSectionTitle}>
          {props.title}
        </Typography>
      ) : null}
      <Grid container>{renderFields(props.fields)}</Grid>
    </Box>
  );
};

export default FieldSection;
export type { Field };
