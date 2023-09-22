import React from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { Box, Radio, Paper, TextField, Theme, Typography, MenuItem, RadioGroup, FormControlLabel } from "@mui/material";

type Field = {
  label: string;
  state: unknown;
  onChangeCallback: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null;
} & (
  | {
      type: "RadioButton" | "Dropdown";
      values: Array<{ label: string; value: any }>;
    }
  | {
      type: "Text" | "TextBig" | "Date" | "Checkbox";
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
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    textField: { minWidth: "500px" },
    textBigField: { minWidth: "500px" },
    dateField: { minWidth: "500px" },
    dropdownField: { minWidth: "500px" },
    radioButtonField: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
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
      if (field.type === "Dropdown") {
        return (
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
        return (
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
        return (
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
        return (
          <TextField
            className={`${classes.fieldItem} ${classes.textBigField}`}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Date") {
        return (
          <TextField
            className={`${classes.fieldItem} ${classes.dateField}`}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      } else if (field.type === "Checkbox") {
        return (
          <TextField
            className={`${classes.fieldItem} ${classes.checkboxField}`}
            key={index}
            label={field.label}
            color="primary"
            value={field.state}
            onChange={field.onChangeCallback ? field.onChangeCallback : undefined}
          />
        );
      }
    });
  };

  return (
    <Paper className={classes.fieldSectionBox}>
      <Typography variant="h5" className={classes.fieldSectionTitle}>
        {props.title}
      </Typography>
      {renderFields(props.fields)}
    </Paper>
  );
};

export default FieldSection;
export type { Field };
