import React from "react";
import { ProjectOverview } from "../../types/projectTypes";
import AllProjectsTable from "./AllProjectsTable";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { FilterListOff, Search } from "@mui/icons-material";
import FilterList from "@mui/icons-material/FilterList";

interface AllProjectsProps {
  projects: ProjectOverview[];
}

/**
 * Component to display all projects, a search bar and a filter button
 * @param param - List of projects
 * @returns - A table with all projects, a search bar and a filter button
 */
const AllProjects = ({ projects }: AllProjectsProps) => {
  const [filteredProjects, setFilteredProjects] = React.useState<ProjectOverview[]>(projects);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter the projects based on the search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const filteredProjects = projects.filter((project) =>
      project.projectName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProjects(filteredProjects);
  };

  // Show or hide the filter options
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Box sx={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <IconButton sx={{ height: 40, width: 40 }} onClick={handleShowFilters}>
          {showFilters ? <FilterListOff /> : <FilterList />}
        </IconButton>
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
      <AllProjectsTable projects={filteredProjects} />
    </>
  );
};

export default AllProjects;
