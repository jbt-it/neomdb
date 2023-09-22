/**
 * Component that handles the not found error
 */
import React, { useState } from "react";
import { Button, Theme, CardActions, CardContent, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import FieldSection, { Field } from "./components/FieldSection";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
  })
);

const FieldSectionTest: React.FunctionComponent = () => {
  const classes = useStyles();

  const [checkbox1, setCheckbox1] = useState<string>("");
  const [radioButton1, setRadioButton1] = useState<string>("");
  const [dropdown1, setDropdown1] = useState<string>("");

  const onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox1(event.target.value);
  };

  const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioButton1(event.target.value);
  };

  const onChangeDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDropdown1(event.target.value);
  };

  const fields: Array<Field> = [
    {
      label: "Test1",
      state: checkbox1,
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "Test1",
      state: checkbox1,
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "Test1",
      state: checkbox1,
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "Test1",
      state: checkbox1,
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "Test1",
      state: checkbox1,
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "RadioButton",
      state: radioButton1,
      onChangeCallback: onChangeRadioButton,
      type: "RadioButton",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Dropdown",
      state: dropdown1,
      onChangeCallback: onChangeDropdown,
      type: "Dropdown",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
  ];

  return (
    <div className={"content-page"}>
      <FieldSection title={"Test Section"} fields={fields}></FieldSection>
    </div>
  );
};

export default FieldSectionTest;
