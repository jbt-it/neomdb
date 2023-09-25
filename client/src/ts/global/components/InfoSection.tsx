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

/*
 * This component is used to display a section of information fields.
 * TODO: Add a type to differentiate between single InformationField and multiple InformationFields or Checkboxes
 * type: "Single" | "Multi" | "Checkbox";
 */

type InformationField = {
  label: string;
  value: string;
};

interface Props {
  width?: "half" | "full";
  fields: Array<InformationField>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldItem: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    gridItem: {
      display: "flex",
    },
    fieldLabel: {
      justifySelf: "start",
    },
    fieldValue: {
      justifySelf: "end",
    },
  })
);

const InfoSection = (props: Props) => {
  const classes = useStyles();
  const renderFields = (fields: InformationField[]) => {
    return fields.map((field: InformationField) => {
      let fieldContainer: React.JSX.Element;
      if (props.width === "half") {
        fieldContainer = (
          <Grid container item spacing={2} xs={6}>
            <Grid item xs={5}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography>{field.value}</Typography>
            </Grid>
          </Grid>
        );
      } else if (props.width === "full") {
        fieldContainer = (
          <Grid container item spacing={1}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{field.value}</Typography>
            </Grid>
          </Grid>
        );
      } else {
        fieldContainer = (
          <Grid container item spacing={1} xs={"auto"}>
            <Grid item xs={"auto"}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid item xs={"auto"}>
              <Typography>{field.value}</Typography>
            </Grid>
          </Grid>
        );
      }

      return fieldContainer;
    });
  };

  return (
    <Grid container rowSpacing={1} columnSpacing={12}>
      {renderFields(props.fields)}
    </Grid>
  );
};

export default InfoSection;
export type { InformationField };
