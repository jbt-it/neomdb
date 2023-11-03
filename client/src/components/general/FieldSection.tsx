import React from "react";
import { makeStyles, createStyles } from "@mui/styles";
import {
  Grid,
  Radio,
  Box,
  TextField,
  Theme,
  Typography,
  MenuItem,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  Autocomplete,
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
    }
  | {
      type: "TextBig";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      rows: number;
    }
  | {
      type: "Date";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
    }
  | {
      type: "Text";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
      inputType?: "number";
      error?: boolean;
      helperText?: string;
    }
  | {
      type: "Checkbox";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
    }
  | {
      type: "Time";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<TimeValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
    }
  | {
      type: "DateTime";
      onChangeCallback:
        | ((value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void)
        | null;
      error?: boolean;
      helperText?: string;
    }
  | {
      type: "Autocomplete";
      onChangeCallback: (event: React.ChangeEvent<object>, value: string[] | string) => void | null;
      error?: boolean;
      helperText?: string;
    }
);
interface Props {
  title?: string;
  fields: Array<Field>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    textField: {},
    textBigField: {},
    dateField: {},
    dropdownField: {},
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
    checkboxField: {},
  })
);

const FieldSection = (props: Props) => {
  const classes = useStyles();

  const renderFields = (fields: Field[]) => {
    return fields.map((field: Field, index: number) => {
      let fieldElement: React.JSX.Element = <div></div>;
      if (field.type === "Dropdown") {
        fieldElement = (
          <TextField
            className={`${classes.fieldItem} ${classes.dropdownField}`}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
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
          <RadioGroup className={`${classes.fieldItem} ${classes.radioButtonField}`}>
            {field.values.map((value) => {
              return (
                <FormControlLabel
                  className={classes.radioButtonItem}
                  value={value.value}
                  control={<Radio />}
                  label={value.label}
                />
              );
            })}
          </RadioGroup>
        );
      } else if (field.type === "Text") {
        fieldElement = (
          <TextField
            className={`${classes.fieldItem} ${classes.textField}`}
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
          />
        );
      } else if (field.type === "TextBig") {
        fieldElement = (
          <TextField
            className={`${classes.fieldItem} ${classes.textBigField}`}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            multiline
            rows={field.rows}
            variant="outlined"
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Date") {
        fieldElement = (
          <DatePicker
            key={index}
            className={`${classes.fieldItem} ${classes.dateField}`}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Time") {
        fieldElement = (
          <TimePicker
            key={index}
            className={`${classes.fieldItem} ${classes.dateField}`}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "DateTime") {
        fieldElement = (
          <DateTimePicker
            key={index}
            className={`${classes.fieldItem} ${classes.dateField}`}
            label={field.label}
            value={field.state as Dayjs}
            slotProps={{ textField: { variant: "outlined", helperText: field.helperText, error: field.error } }}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Autocomplete") {
        fieldElement = (
          <Autocomplete
            key={index}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
            renderInput={(params) => <TextField variant="outlined" {...params} label="Organisatoren" />}
            options={field.state as string[]}
            className={`${classes.fieldItem} ${classes.dropdownField}`}
            size="medium"
            multiple
          />
        );
      } else if (field.type === "Checkbox") {
        fieldElement = (
          <FormControlLabel
            className={`${classes.fieldItem} ${classes.checkboxField}`}
            control={
              <Checkbox
                key={index}
                color="primary"
                value={field.state}
                onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
              />
            }
            label={field.label}
          />
        );
      }

      let fieldContainer: React.JSX.Element;
      if (field.width === "half") {
        fieldContainer = (
          <Grid item xs={6} className={classes.gridItem} key={index}>
            {fieldElement}
          </Grid>
        );
      } else if (field.width === "full") {
        fieldContainer = (
          <Grid item xs={12} className={classes.gridItem} key={index}>
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
    <Box className={classes.fieldSectionBox}>
      {props.title ? (
        <Typography variant="h5" className={classes.fieldSectionTitle}>
          {props.title}
        </Typography>
      ) : null}
      <Grid container>{renderFields(props.fields)}</Grid>
    </Box>
  );
};

export default FieldSection;
export type { Field };
