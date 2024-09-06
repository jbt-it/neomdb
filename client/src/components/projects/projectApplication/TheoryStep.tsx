import { Box, Checkbox, Grid, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";

/**
 * List of workshops to select from
 * @returns the respective list of workshops
 */
const WorkshopList = () => {
  const workshops = [
    "Workshop 1",
    "Workshop 2",
    "Workshop 3",
    "Workshop 4",
    "Workshop 5",
    "Workshop 6",
    "Workshop 7",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 8",
    "Workshop 111",
  ];

  // Function to determine number of columns based on the number of items
  const getNumberOfColumns = (itemsLength: number) => {
    if (itemsLength <= 5) return 12; // 1 column for 5 or fewer items
    if (itemsLength <= 10) return 6; // 2 columns for 6-10 items
    if (itemsLength <= 15) return 4;
    return 3; // 3 columns for more than 10 items
  };

  const columns = getNumberOfColumns(workshops.length);

  return (
    <Grid container>
      {workshops.map((workshop, index) => (
        <Grid item xs={12} sm={columns} key={index}>
          <ListItem disablePadding dense>
            <ListItemIcon>
              <Checkbox edge="start" tabIndex={-1} size="small" />
            </ListItemIcon>
            <ListItemText primary={workshop} />
          </ListItem>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Theoretical knowledge step of the project application form
 * @returns the respective theoretical knowledge step of the project application form
 */
const TheoryStep = () => {
  const isMobile = useResponsive("down", "sm");
  return (
    <Stack direction={"column"} spacing={3}>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Seminararbeiten:
        </Typography>
        <TextField sx={{ flex: 3 }} variant="outlined" size="small" multiline minRows={3} />
      </Stack>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Schulungen und Workshops:
        </Typography>
        <Box sx={{ flex: 3 }}>
          <WorkshopList />
        </Box>
      </Stack>
    </Stack>
  );
};

export default TheoryStep;
