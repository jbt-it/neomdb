import { Button, Stack } from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { RestartAlt } from "@mui/icons-material";
import { DateRangePicker } from "../general/DateRangePicker";
import dayjs, { Dayjs } from "dayjs";

interface AllProjectsDateFiltersProps {
  resetProjectFilters: () => void;
  startDate: Dayjs | null;
  onChangeStartDate: (date: Dayjs | null) => void;
  endDate: Dayjs | null;
  onChangeEndDate: (date: Dayjs | null) => void;
}

/**
 * Component to filter all projects by date
 * @param resetCoreCompetenciesFilter - Function to reset the core competencies filter
 * @param startDate - The start date
 * @param onChangeStartDate - Function to change the start date
 * @param endDate - The end date
 * @param onChangeEndDate - Function to change the end date
 * @returns - A date range picker and a button to reset the filters
 */
const AllProjectsDateFilters = ({
  resetProjectFilters,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
}: AllProjectsDateFiltersProps) => {
  const styles = {
    containerDesktop: {
      flex: 1,
      ml: 2,
      mr: 2,
      height: 40,
    },
    containerMobile: {
      flex: 1,
      mb: 2,
      height: 90,
    },
  };
  const isMobile = useResponsive("down", "sm");

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
      sx={isMobile ? styles.containerMobile : styles.containerDesktop}
    >
      <DateRangePicker
        startDate={startDate}
        onChangeStartDate={onChangeStartDate}
        endDate={endDate}
        onChangeEndDate={onChangeEndDate}
        startLabel="Von"
        endLabel="Bis"
        minDate={dayjs("1999-10-01")} // first project in the database
        maxDate={dayjs().add(1, "month")} // one month in the future for project tenders
      />
      <Button
        variant="outlined"
        sx={{ fontWeight: 600 }}
        startIcon={<RestartAlt />}
        color="info"
        onClick={() => {
          resetProjectFilters();
          onChangeStartDate(null);
          onChangeEndDate(null);
        }}
      >
        Filter zurücksetzen
      </Button>
    </Stack>
  );
};

export default AllProjectsDateFilters;
