import React, { useEffect, useState } from "react";
import { ProjectOverviewDto } from "../../../types/projectTypes";
import AllProjectsTable from "./AllProjectsTable";
import { Box, IconButton, InputAdornment, SelectChangeEvent, TextField } from "@mui/material";
import { FilterListOff, Search } from "@mui/icons-material";
import FilterList from "@mui/icons-material/FilterList";
import useResponsive from "../../../hooks/useResponsive";
import AllProjectsDateFilters from "./AllProjectsDateFilters";
import AllProjectsCoreCompetenciesFilter from "./AllProjectsCoreCompetenciesFilter";
import { Dayjs } from "dayjs";

interface AllProjectsProps {
  projects: ProjectOverviewDto[];
}

/**
 * Component to display all projects, a search bar and a filter button
 * @param projects - List of projects
 * @returns - A table with all projects, a search bar and a filter button
 */
const AllProjects = ({ projects }: AllProjectsProps) => {
  const [filteredProjects, setFilteredProjects] = React.useState<ProjectOverviewDto[]>(projects);
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
        return project.kickoff
          ? project.kickoff >= startDate
          : project.tenderDate
          ? project.tenderDate >= startDate
          : false;
      });
    }
    if (endDate) {
      filteredProjects = filteredProjects.filter((project) => {
        return project.projectEnd ? project.projectEnd <= endDate : false;
      });
    }
    // checks wether the project has at least one core competency that is in the coreCompetenciesFilter
    filteredProjects = filteredProjects.filter((project) =>
      Array.isArray(project.coreCompetencies)
        ? project.coreCompetencies.some((competence) => coreCompetenciesFilter.includes(competence.designation))
        : coreCompetenciesFilter.includes(project.coreCompetencies.designation)
    );
    setFilteredProjects(filteredProjects);
  }, [searchTerm, startDate, endDate, coreCompetenciesFilter, projects]);

  // Sort the projects
  const handleSortBy = (sortBy: string) => {
    const sortedProjects = [...filteredProjects];
    sortedProjects.sort((a, b) => {
      if (sortBy === "BT descending") {
        // calculate average of estimated BT
        const aBT = (a.estimatedProjectBTmin + a.estimatedProjectBTmax) / 2;
        const bBT = (b.estimatedProjectBTmin + b.estimatedProjectBTmax) / 2;
        // sort descending compare soldBT with soldBT or estimated BT with soldBT if soldBT is null or estimated BT with estimated BT if both soldBT is null
        if (a.soldBT === null && b.soldBT === null) {
          return aBT - bBT;
        }
        if (a.soldBT != null && b.soldBT != null) {
          return a.soldBT - b.soldBT;
        }
        if (a.soldBT === null && b.soldBT != null) {
          return aBT - b.soldBT;
        }
        if (b.soldBT === null && a.soldBT != null) {
          return a.soldBT - bBT;
        }
      }
      if (sortBy === "BT ascending") {
        // calculate average of estimated BT
        const aBT = (a.estimatedProjectBTmin + a.estimatedProjectBTmax) / 2;
        const bBT = (b.estimatedProjectBTmin + b.estimatedProjectBTmax) / 2;
        // sort ascending compare soldBT with soldBT or estimated BT with soldBT if soldBT is null or estimated BT with estimated BT if both soldBT is null
        if (a.soldBT === null && b.soldBT === null) {
          return bBT - aBT;
        }
        if (a.soldBT != null && b.soldBT != null) {
          return b.soldBT - a.soldBT;
        }
        if (a.soldBT === null && b.soldBT != null) {
          return b.soldBT - aBT;
        }
        if (b.soldBT === null && a.soldBT != null) {
          return bBT - a.soldBT;
        }
      }
      if (sortBy === "Beginn descending") {
        // sort descending compare kickoff with kickoff or tenderDate with kickoff if kickoff is null or tenderDate with tenderDate if both kickoff is null
        if (a.kickoff === null && b.kickoff === null) {
          return a.tenderDate.diff(b.tenderDate);
        }
        if (a.kickoff != null && b.kickoff != null) {
          return a.kickoff.diff(b.kickoff);
        }
        if (a.kickoff === null && b.kickoff != null) {
          return a.tenderDate.diff(b.kickoff);
        }
        if (b.kickoff === null && a.kickoff != null) {
          return a.kickoff.diff(b.tenderDate);
        }
      }
      if (sortBy === "Beginn ascending") {
        // sort ascending compare kickoff with kickoff or tenderDate with kickoff if kickoff is null or tenderDate with tenderDate if both kickoff is null
        if (a.kickoff === null && b.kickoff === null) {
          return b.tenderDate.diff(a.tenderDate);
        }
        if (a.kickoff != null && b.kickoff != null) {
          return b.kickoff.diff(a.kickoff);
        }
        if (a.kickoff === null && b.kickoff != null) {
          return b.kickoff.diff(a.tenderDate);
        }
        if (b.kickoff === null && a.kickoff != null) {
          return b.tenderDate.diff(a.kickoff);
        }
      }
      if (sortBy === "Ende descending") {
        return a.projectEnd === null ? 1 : b.projectEnd === null ? -1 : b.projectEnd.diff(a.projectEnd);
      }
      if (sortBy === "Ende ascending")
        return a.projectEnd === null ? -1 : b.projectEnd === null ? 1 : a.projectEnd.diff(b.projectEnd);
      if (sortBy === "Projektname descending") {
        return a.projectName.localeCompare(b.projectName);
      }
      if (sortBy === "Projektname ascending") return b.projectName.localeCompare(a.projectName);
      if (sortBy === "Branche descending") {
        return a.industry === null
          ? 1
          : b.industry === null
          ? -1
          : a.industry.description.localeCompare(b.industry.description);
      }
      if (sortBy === "Branche ascending")
        return a.industry === null
          ? -1
          : b.industry === null
          ? 1
          : b.industry.description.localeCompare(a.industry.description);
      if (sortBy === "Unternehmen descending") {
        return b.client === null ? 1 : a.client === null ? -1 : a.client.name.localeCompare(b.client.name);
      }
      if (sortBy === "Unternehmen ascending")
        return b.client === null ? -1 : a.client === null ? 1 : b.client.name.localeCompare(a.client.name);
      if (sortBy === "Kernkompetenz descending") {
        return b.coreCompetencies === null
          ? 1
          : a.coreCompetencies === null
          ? -1
          : Array.isArray(a.coreCompetencies) && Array.isArray(b.coreCompetencies)
          ? a.coreCompetencies[0].designation.localeCompare(b.coreCompetencies[0].designation)
          : Array.isArray(a.coreCompetencies) && !Array.isArray(b.coreCompetencies)
          ? a.coreCompetencies[0].designation.localeCompare(b.coreCompetencies.designation)
          : !Array.isArray(a.coreCompetencies) && Array.isArray(b.coreCompetencies)
          ? a.coreCompetencies.designation.localeCompare(b.coreCompetencies[0].designation)
          : !Array.isArray(a.coreCompetencies) && !Array.isArray(b.coreCompetencies)
          ? a.coreCompetencies.designation.localeCompare(b.coreCompetencies.designation)
          : -1;
      }
      if (sortBy === "Kernkompetenz ascending")
        return b.coreCompetencies === null
          ? -1
          : a.coreCompetencies === null
          ? 1
          : Array.isArray(a.coreCompetencies) && Array.isArray(b.coreCompetencies)
          ? b.coreCompetencies[0].designation.localeCompare(a.coreCompetencies[0].designation)
          : Array.isArray(a.coreCompetencies) && !Array.isArray(b.coreCompetencies)
          ? b.coreCompetencies.designation.localeCompare(a.coreCompetencies[0].designation)
          : !Array.isArray(a.coreCompetencies) && Array.isArray(b.coreCompetencies)
          ? b.coreCompetencies[0].designation.localeCompare(a.coreCompetencies.designation)
          : !Array.isArray(a.coreCompetencies) && !Array.isArray(b.coreCompetencies)
          ? b.coreCompetencies.designation.localeCompare(a.coreCompetencies.designation)
          : -1;
      if (sortBy === "Status descending") {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === "Status ascending") return b.status.localeCompare(a.status);
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
