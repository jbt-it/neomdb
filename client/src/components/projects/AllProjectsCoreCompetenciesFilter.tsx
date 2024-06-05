import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { RestartAlt } from "@mui/icons-material";

interface AllProjectsCoreCompetenciesFilterProps {
  coreCompetenciesFilter: string[];
  onChangeCoreCompetenciesFilter: (event: SelectChangeEvent<any>) => void;
  setCoreCompetenciesFilter: (coreCompetencies: string[]) => void;
}

/**
 * Component to show and filter all projects by core competencies
 * @param coreCompetenciesFilter - The selected core competencies
 * @param onChangeCoreCompetenciesFilter - Function to change the core competencies filter
 * @param setCoreCompetenciesFilter - Function to set the core competencies filter
 * @returns AllProjectsCoreCompetenciesFilter component
 */
const AllProjectsCoreCompetenciesFilter = ({
  coreCompetenciesFilter,
  onChangeCoreCompetenciesFilter,
  setCoreCompetenciesFilter,
}: AllProjectsCoreCompetenciesFilterProps) => {
  const isMobile = useResponsive("down", "sm");
  const coreCompetencies = [
    "Finance & Controlling",
    "Human Resources",
    "Marketing & Sales",
    "Process & Organization",
    "Research & Implications",
    "Sustainability",
    "Sonstiges",
  ];

  return (
    <FormControl component={Paper} sx={{ padding: 2, marginBottom: 2, minWidth: 280 }}>
      <Stack direction="row" justifyContent="space-between" alignItems={"center"}>
        <FormLabel>Kernkompetenzen</FormLabel>
        {isMobile ? (
          <IconButton
            onClick={() =>
              coreCompetenciesFilter.length === 0
                ? setCoreCompetenciesFilter(coreCompetencies)
                : setCoreCompetenciesFilter([])
            }
            color="info"
          >
            <RestartAlt />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            color="info"
            sx={{ fontWeight: 600 }}
            startIcon={<RestartAlt />}
            onClick={() => {
              coreCompetenciesFilter.length === 0
                ? setCoreCompetenciesFilter(coreCompetencies)
                : setCoreCompetenciesFilter([]);
            }}
          >
            {coreCompetenciesFilter.length === 0 ? "Alle auswählen" : "Alle abwählen"}
          </Button>
        )}
      </Stack>
      <FormGroup row={!isMobile}>
        {coreCompetencies.map((competence) => {
          return (
            <FormControlLabel
              key={competence}
              control={
                <Checkbox
                  checked={coreCompetenciesFilter.includes(competence)}
                  onChange={onChangeCoreCompetenciesFilter}
                  value={competence}
                />
              }
              label={competence}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default AllProjectsCoreCompetenciesFilter;
