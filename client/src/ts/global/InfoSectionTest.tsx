import React from "react";
import { Paper, Typography, Theme } from "@mui/material";
import InfoSection, { InformationField } from "./components/InfoSection";

const InfoSectionTest: React.FunctionComponent = () => {
  const fields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: "Test Value",
    },
    {
      label: "Test Label 2",
      value: "Test Value 2",
    },
    {
      label: "Test Label 3",
      value: "Test Value 3",
    },
    {
      label: "Test Label 4",
      value: "Test Value 4",
    },
  ];

  return (
    <div className={"content-page"}>
      <Paper
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5">Info Section Test</Typography>
        <InfoSection fields={fields} width="full" />
      </Paper>
    </div>
  );
};

export default InfoSectionTest;
