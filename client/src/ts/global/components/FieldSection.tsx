import React from "react";
import { makeStyles, createStyles } from "@mui/styles";
import {
  Box,
  Grid,
  Radio,
  Paper,
  TextField,
  Theme,
  Typography,
  MenuItem,
  RadioGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";

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
      onChangeCallback: ((value: unknown, context: PickerChangeHandlerContext<DateValidationError>) => void) | null;
    }
  | {
      type: "Text" | "Checkbox";
      onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
    }
);
interface Props {
  title: string;
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
            {field.values.map((value) => {
              return <MenuItem value={value.value}>{value.label}</MenuItem>;
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
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
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
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Date") {
        fieldElement = (
          <DatePicker
            className={`${classes.fieldItem} ${classes.dateField}`}
            label={field.label}
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
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
                checked={field.state as boolean}
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
          <Grid item xs={6} className={classes.gridItem}>
            {fieldElement}
          </Grid>
        );
      } else if (field.width === "full") {
        fieldContainer = (
          <Grid item xs={12} className={classes.gridItem}>
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
    <Paper className={classes.fieldSectionBox}>
      <Typography variant="h5" className={classes.fieldSectionTitle}>
        {props.title}
      </Typography>
      <Grid container>{renderFields(props.fields)}</Grid>
    </Paper>
  );
};

export default FieldSection;
export type { Field };
