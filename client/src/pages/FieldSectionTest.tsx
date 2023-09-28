/**
 * Component that handles the not found error
 */
import React, { useState } from "react";
import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import FieldSection, { Field } from "../components/general/FieldSection";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
  })
);

const FieldSectionTest: React.FunctionComponent = () => {
  const [text, setText] = useState<string>("");
  const [textBig, setTextBig] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [radioButton, setRadioButton] = useState<string>("");
  const [dropdown, setDropdown] = useState<string>("");

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const onChangeTextBig = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextBig(event.target.value);
  };

  const onChangeDate = (value: unknown) => {
    setDate(value as Date);
  };

  const onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioButton(event.target.value);
  };

  const onChangeDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDropdown(event.target.value);
  };

  const fields: Array<Field> = [
    {
      label: "Text",
      state: text,
      width: "half",
      onChangeCallback: onChangeText,
      type: "Text",
    },
    {
      label: "TextBig",
      state: textBig,
      onChangeCallback: onChangeTextBig,
      type: "TextBig",
      rows: 4,
    },
    {
      label: "Date",
      state: date,
      onChangeCallback: onChangeDate,
      type: "Date",
    },
    {
      label: "Checkbox",
      state: checkbox,
      width: "half",
      onChangeCallback: onChangeCheckbox,
      type: "Checkbox",
    },
    {
      label: "RadioButton",
      state: radioButton,
      onChangeCallback: onChangeRadioButton,
      type: "RadioButton",
      width: "half",
      values: [
        { label: "op 1", value: 1 },
        { label: "op 2", value: 2 },
        { label: "op 3", value: 3 },
        { label: "op 4", value: 4 },
      ],
    },
    {
      label: "Dropdown",
      state: dropdown,
      onChangeCallback: onChangeDropdown,
      type: "Dropdown",
      width: "full",
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
