import React, { useEffect, useState } from "react";
import { ProjectOverview } from "../../../types/projectTypes";
import AllProjectsTable from "./AllProjectsTable";
import { Box, IconButton, InputAdornment, SelectChangeEvent, TextField } from "@mui/material";
import { FilterListOff, Search } from "@mui/icons-material";
import FilterList from "@mui/icons-material/FilterList";
import useResponsive from "../../../hooks/useResponsive";
import AllProjectsDateFilters from "./AllProjectsDateFilters";
import AllProjectsCoreCompetenciesFilter from "./AllProjectsCoreCompetenciesFilter";
import { Dayjs } from "dayjs";

interface AllProjectsProps {
  projects: ProjectOverview[];
}

/**
 * Component to display all projects, a search bar and a filter button
 * @param projects - List of projects
 * @returns - A table with all projects, a search bar and a filter button
 */
const AllProjects = ({ projects }: AllProjectsProps) => {
  const [filteredProjects, setFilteredProjects] = React.useState<ProjectOverview[]>(projects);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
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
  const [coreCompetenciesFilter, setCoreCompetenciesFilter] = useState<string[]>(coreCompetencies.sort());
  const [sortedBy, setSortedBy] = useState("");

  // Show or hide the filter options
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  // Change the search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Change the start date
  const onChangeStartDate = (date: Dayjs | null) => {
    setStartDate(date);
  };

  // Change the end date
  const onChangeEndDate = (date: Dayjs | null) => {
    setEndDate(date);
  };

  // Change the core competencies filter
  const onChangeCoreCompetenciesFilter = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    if (coreCompetenciesFilter.includes(value)) {
      setCoreCompetenciesFilter(coreCompetenciesFilter.filter((competence) => competence !== value));
    } else {
      setCoreCompetenciesFilter([value, ...coreCompetenciesFilter]);
    }
  };

  // Reset the core competencies filter
  const resetProjectFilters = () => {
    setCoreCompetenciesFilter(coreCompetencies);
    setSearchTerm("");
    setFilteredProjects(projects);
  };

  // Filter the projects based on the search term, start date, end date and core competencies
  useEffect(() => {
    let filteredProjects = projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (startDate) {
      filteredProjects = filteredProjects.filter((project) => {
        return project.projectStartDate >= startDate;
      });
    }
    if (endDate) {
      filteredProjects = filteredProjects.filter((project) => {
        return project.projectEndDate ? project.projectEndDate <= endDate : true;
      });
    }
    filteredProjects = filteredProjects.filter((project) =>
      coreCompetenciesFilter.includes(project.projectCoreCompetence ? project.projectCoreCompetence : "")
    );
    setFilteredProjects(filteredProjects);
  }, [searchTerm, startDate, endDate, coreCompetenciesFilter, projects]);

  // Sort the projects
  const handleSortBy = (sortBy: string) => {
    const sortedProjects = [...filteredProjects];
    sortedProjects.sort((a, b) => {
      if (sortBy === "BT descending") {
        return b.projectNumberOfBT - a.projectNumberOfBT;
      }
      if (sortBy === "BT ascending") return a.projectNumberOfBT - b.projectNumberOfBT;
      if (sortBy === "Beginn descending") {
        return b.projectStartDate.diff(a.projectStartDate);
      }
      if (sortBy === "Beginn ascending") return a.projectStartDate.diff(b.projectStartDate);
      if (sortBy === "Ende descending") {
        return a.projectEndDate === null ? 1 : b.projectEndDate === null ? -1 : b.projectEndDate.diff(a.projectEndDate);
      }
      if (sortBy === "Ende ascending")
        return a.projectEndDate === null ? -1 : b.projectEndDate === null ? 1 : a.projectEndDate.diff(b.projectEndDate);
      if (sortBy === "Projektname descending") {
        return a.projectName.localeCompare(b.projectName);
      }
      if (sortBy === "Projektname ascending") return b.projectName.localeCompare(a.projectName);
      if (sortBy === "Branche descending") {
        return a.projectSector === null
          ? 1
          : b.projectSector === null
          ? -1
          : a.projectSector.localeCompare(b.projectSector);
      }
      if (sortBy === "Branche ascending")
        return a.projectSector === null
          ? -1
          : b.projectSector === null
          ? 1
          : b.projectSector.localeCompare(a.projectSector);
      if (sortBy === "Unternehmen descending") {
        return b.projectCompany === null
          ? 1
          : a.projectCompany === null
          ? -1
          : a.projectCompany.localeCompare(b.projectCompany);
      }
      if (sortBy === "Unternehmen ascending")
        return b.projectCompany === null
          ? -1
          : a.projectCompany === null
          ? 1
          : b.projectCompany.localeCompare(a.projectCompany);
      if (sortBy === "Kernkompetenz descending") {
        return b.projectCoreCompetence === null
          ? 1
          : a.projectCoreCompetence === null
          ? -1
          : a.projectCoreCompetence.localeCompare(b.projectCoreCompetence);
      }
      if (sortBy === "Kernkompetenz ascending")
        return b.projectCoreCompetence === null
          ? -1
          : a.projectCoreCompetence === null
          ? 1
          : b.projectCoreCompetence.localeCompare(a.projectCoreCompetence);
      if (sortBy === "Status descending") {
        return a.projectStatus.localeCompare(b.projectStatus);
      }
      if (sortBy === "Status ascending") return b.projectStatus.localeCompare(a.projectStatus);
      return 0;
    });
    setFilteredProjects(sortedProjects);
  };

  // Sort the projects when the sorting option changes
  const onChangeSortBy = (sortBy: string) => {
    setSortedBy(sortBy);
    handleSortBy(sortBy);
  };

  return (
    <>
      <Box sx={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <IconButton sx={{ height: 40, width: 40 }} onClick={handleShowFilters}>
          {showFilters ? <FilterListOff /> : <FilterList />}
        </IconButton>
        {showFilters && !isMobile ? (
          <AllProjectsDateFilters
            resetProjectFilters={resetProjectFilters}
            startDate={startDate}
            onChangeStartDate={onChangeStartDate}
            endDate={endDate}
            onChangeEndDate={onChangeEndDate}
          />
        ) : null}
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          placeholder="Projekt suchen..."
          sx={{ marginLeft: "auto", mb: 2 }}
        />
      </Box>
      {showFilters && isMobile ? (
        <AllProjectsDateFilters
          resetProjectFilters={resetProjectFilters}
          startDate={startDate}
          onChangeStartDate={onChangeStartDate}
          endDate={endDate}
          onChangeEndDate={onChangeEndDate}
        />
      ) : null}
      {showFilters ? (
        <AllProjectsCoreCompetenciesFilter
          coreCompetenciesFilter={coreCompetenciesFilter}
          onChangeCoreCompetenciesFilter={onChangeCoreCompetenciesFilter}
          setCoreCompetenciesFilter={setCoreCompetenciesFilter}
        />
      ) : null}
      <AllProjectsTable projects={filteredProjects} sortedBy={sortedBy} onChangeSortBy={onChangeSortBy} />
    </>
  );
};

export default AllProjects;
