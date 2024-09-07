import React from "react";
import { Box, Checkbox, Grid, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { ProjectApplicationDto } from "../../../types/projectTypes";
import { Workshop } from "../../../types/eventTypes";

/**
 * Props for the theoretical knowledge step of the project application form
 */
interface TheoryStepProps {
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
  workshops: Workshop[];
}

/**
 * List of workshops to select from
 */
interface WorkshopListProps {
  workshops: Workshop[];
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
}

/**
 * List of workshops to select from
 * @param workshops the list of workshops
 * @returns the respective list of workshops
 */
const WorkshopList = ({ workshops, applicationData, setApplicationData }: WorkshopListProps) => {
  // Function to determine number of columns based on the number of items
  const getNumberOfColumns = (itemsLength: number) => {
    if (itemsLength <= 5) return 12; // 1 column for 5 or fewer items
    if (itemsLength <= 10) return 6; // 2 columns for 6-10 items
    if (itemsLength <= 15) return 4;
    return 3; // 3 columns for more than 10 items
  };

  // Determine number of columns based on the number of workshops
  const columns = getNumberOfColumns(workshops.length);

  // Function to handle the change of the selected workshops
  const onChangeWorkshops = (event: React.ChangeEvent<HTMLInputElement>, workshop: Workshop) => {
    const isChecked = event.target.checked;
    setApplicationData((prevState) => {
      const updatedWorkshops = isChecked
        ? [...prevState.workshops, workshop]
        : prevState.workshops.filter((w) => w.schulungId !== workshop.schulungId);
      return { ...prevState, workshops: updatedWorkshops };
    });
  };

  return (
    <Grid container>
      {workshops.map((workshop: Workshop) => (
        <Grid item xs={12} sm={columns} key={workshop.schulungId}>
          <ListItem disablePadding dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                tabIndex={-1}
                size="small"
                checked={applicationData.workshops.some((w) => w.schulungId === workshop.schulungId)}
                onChange={(event) => onChangeWorkshops(event, workshop)}
              />
            </ListItemIcon>
            <ListItemText primary={workshop.schulungsName} />
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
const TheoryStep = ({ applicationData, setApplicationData, workshops }: TheoryStepProps) => {
  // Function to handle the change of the seminar papers
  const onChangeSeminarPapers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApplicationData({ ...applicationData, seminarPapers: event.target.value });
  };

  return (
    <Stack direction={"column"} spacing={3}>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Seminararbeiten:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          minRows={3}
          value={applicationData.seminarPapers}
          onChange={onChangeSeminarPapers}
        />
      </Stack>
      <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Schulungen und Workshops:
        </Typography>
        <Box sx={{ flex: 3 }}>
          <WorkshopList
            workshops={workshops}
            applicationData={applicationData}
            setApplicationData={setApplicationData}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default TheoryStep;
