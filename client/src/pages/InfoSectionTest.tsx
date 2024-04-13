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
          mitgliedID: 8364,
          name: "Jimmie O'Brien",
          vorname: "vorname1",
          nachname: "nachname1",
          mitgliedstatus: "Trainee",
        },
        {
          mitgliedID: 8320,
          name: "Radhika Norton",
          vorname: "vorname2",
          nachname: "nachname2",
          mitgliedstatus: "Trainee",
        },
        {
          mitgliedID: 8478,
          name: "Kellan Mclaughlin",
          vorname: "vorname3",
          nachname: "nachname3",
          mitgliedstatus: "Trainee",
        },
        {
          mitgliedID: 8331,
          name: "Jorja Bautista",
          vorname: "Jorja",
          nachname: "Bautista",
          mitgliedstatus: "Trainee",
        },
        {
          mitgliedID: 8748,
          name: "Mason Vinson",
          vorname: "Mason",
          nachname: "Vinson",
          mitgliedstatus: "aktives Mitglied",
        },
        {
          mitgliedID: 8338,
          name: "Mariana Macdonald",
          vorname: "vorname4",
          nachname: "nachname4",
          mitgliedstatus: "Senior",
        },
        {
          mitgliedID: 8167,
          name: "Wolfgang U Luft",
          vorname: "vorname4",
          nachname: "nachname4",
          mitgliedstatus: "passives Mitglied",
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
