/*
 * This component is used to display a section of information fields.
 */
import React from "react";
import { Typography, ListItem, List, ListItemText, ListItemButton, ListItemAvatar, Avatar, Theme } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Grid from "@mui/material/Unstable_Grid2";
import { MembersField } from "../../types/membersTypes";
import { Link } from "react-router-dom";
import { stringAvatar } from "../../utils/stringUtils";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      fontSize: "0.75rem",
      width: 30,
      height: 30,
    },
  })
);

type InformationField = {
  label: string;
} & (
  | {
      type?: "text" | "multi";
      value: string | null | undefined;
    }
  | {
      type?: "checkbox";
      value: boolean | null | undefined;
    }
  | {
      type?: "list";
      value: Array<string> | undefined;
    }
  | {
      type?: "memberList";
      value: Array<MembersField> | undefined;
    }
);

interface Props {
  fields: Array<InformationField>;
}

/**
 * We render each label:value pair in a grid container with two columns.
 * The first column contains the label and the second column contains the value.
 * The type of the field determines how the value is displayed.
 * If the type is "text" the value is displayed as text.
 * If the type is "checkbox" the value is displayed as a checkbox.
 *
 * TODO: Add support for Autocomplete fields / check how to display a list of members e.g. project members
 */
const InfoSection = (props: Props) => {
  const classes = useStyles();

  const renderFields = (fields: InformationField[]) => {
    return fields.map((field: InformationField) => {
      let fieldContainer: React.JSX.Element;
      if (field.type === "text") {
        fieldContainer = (
          <Grid container xs={12}>
            <Grid xs={12} md={4}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              {field.value ? <Typography>{field.value}</Typography> : <Typography>-</Typography>}
            </Grid>
          </Grid>
        );
      } else if (field.type === "list") {
        const items = field.value as Array<string>;
        const listItems = field.value
          ? items.map((item, index) => (
              <ListItem disablePadding sx={{ display: "list-item" }}>
                <ListItemText key={index} primary={item} />
              </ListItem>
            ))
          : null;

        fieldContainer = (
          <Grid container xs={12}>
            <Grid xs={12} md={4}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid xs={12} md={4}>
              {field.value ? (
                <List sx={{ listStyleType: "disc", pl: 2, marginTop: -1.5 }}>{listItems}</List>
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>
          </Grid>
        );
      } else if (field.type === "memberList") {
        fieldContainer = (
          <Grid container xs={12} sx={{ marginTop: 0.5, marginBottom: 1.5 }}>
            <Grid xs={12} md={4}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid xs={12} md={5}>
              {field.value ? (
                <List sx={{ pl: 2, marginTop: -1, marginLeft: -2.3 }} disablePadding>
                  {field.value.map((item, index) => (
                    <ListItem
                      component={Link}
                      to={`/gesamtuebersicht/${item.mitgliedID}`}
                      sx={{ padding: 0.5, margin: 0 }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={item.name} {...stringAvatar(item.name)} className={classes.avatar} />
                      </ListItemAvatar>
                      <ListItemText key={index} primary={item.name} sx={{ marginLeft: -2, color: "black" }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>
          </Grid>
        );
      } else if (field.type === "checkbox") {
        fieldContainer = (
          <Grid container xs={12}>
            <Grid xs={12} md={4}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid xs={12} md={4}>
              {field.value ? <CheckBoxIcon color="primary" /> : <CheckBoxOutlineBlankIcon color="primary" />}
            </Grid>
          </Grid>
        );
      } else {
        fieldContainer = (
          <Grid container xs={12}>
            <Grid xs={12} md={4}>
              <Typography sx={{ fontWeight: "bold" }}>{field.label}:</Typography>
            </Grid>
            <Grid xs={12} md={8} sx={{ maxWidth: "600px" }}>
              {field.value ? <Typography>{field.value}</Typography> : <Typography>-</Typography>}
            </Grid>
          </Grid>
        );
      }

      return fieldContainer;
    });
  };

  return (
    <Grid container rowSpacing={0.5}>
      {renderFields(props.fields)}
    </Grid>
  );
};

export default InfoSection;
export type { InformationField };
