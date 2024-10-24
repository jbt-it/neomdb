import React from "react";
import { Paper, Typography, Container, Box, Card, Divider } from "@mui/material";
import InfoSection, { InformationField } from "../components/general/InfoSection";

const InfoSectionTest: React.FunctionComponent = () => {
  const fields: Array<InformationField> = [
    {
      label: "Internesprojekt",
      value: "Test Value 1",
      type: "text",
    },
    {
      label: "Test Label 2",
      value: null,
      type: "text",
    },
    {
      label: "Test Label 3",
      value: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
      neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
      quasi quidem quibusdam.`,
      type: "multi",
    },
    {
      label: "Test Label 4",
      value: true,
      type: "checkbox",
    },
    {
      label: "Test Label 5",
      value: null,
      type: "checkbox",
    },
    {
      label: "Test List",
      value: ["Item 1", "Item 2", "Item 3"],
      type: "list",
    },
    {
      label: "Test Member List",
      value: [
        {
          memberId: 8364,
          firstname: "vorname1",
          lastname: "nachname1",
          memberStatus: { memberStatusId: 1, name: "Trainee" },
        },
        {
          memberId: 8320,
          firstname: "vorname2",
          lastname: "nachname2",
          memberStatus: { memberStatusId: 1, name: "Trainee" },
        },
        {
          memberId: 8478,
          firstname: "vorname3",
          lastname: "nachname3",
          memberStatus: { memberStatusId: 1, name: "Trainee" },
        },
        {
          memberId: 8331,
          firstname: "Jorja",
          lastname: "Bautista",
          memberStatus: { memberStatusId: 1, name: "Trainee" },
        },
        {
          memberId: 8748,
          firstname: "Mason",
          lastname: "Vinson",
          memberStatus: { memberStatusId: 2, name: "aktives Mitglied" },
        },
        {
          memberId: 8338,
          firstname: "vorname4",
          lastname: "nachname4",
          memberStatus: { memberStatusId: 3, name: "Senior" },
        },
        {
          memberId: 8167,
          firstname: "vorname4",
          lastname: "nachname4",
          memberStatus: { memberStatusId: 4, name: "passives Mitglied" },
        },
      ],
      type: "memberList",
    },
  ];

  return (
    <Box>
      <Paper
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          width: "80%",
          margin: "auto",
        }}
      >
        <Typography variant="h5">Info Section Test</Typography>
        <Divider />
        <Box margin={"auto"} marginTop={2}>
          <InfoSection fields={fields} />
        </Box>
      </Paper>
    </Box>
  );
};

export default InfoSectionTest;
