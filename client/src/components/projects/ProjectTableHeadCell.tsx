import React from "react";
import { ExpandLess, ExpandMore, UnfoldMore } from "@mui/icons-material";
import { Stack, TableCell, Typography } from "@mui/material";

interface ProjectTableHeadCellProps {
  column: string;
  sortedBy: string;
  onChangeSortBy: (column: string) => void;
}

/**
 * ProjectTableHeadCell component to display a table head cell based on the column name
 * @param column - Column name
 * @returns - A table head cell with the column name and sorting icons
 */
const ProjectTableHeadCell: React.FC<ProjectTableHeadCellProps> = ({
  column,
  sortedBy,
  onChangeSortBy,
}: ProjectTableHeadCellProps) => {
  const styles = {
    tableHeaderCell: {
      color: "white",
      padding: 0.75,
      ":hover": { cursor: "pointer" },
    },
  };

  return (
    <TableCell
      sx={styles.tableHeaderCell}
      onClick={() => {
        sortedBy === column + " descending"
          ? onChangeSortBy(column + " ascending")
          : onChangeSortBy(column + " descending");
      }}
    >
      <Stack direction={"row"} alignItems={"center"} sx={{ marginLeft: -1 }}>
        {sortedBy === column + " ascending" ? (
          <ExpandLess />
        ) : sortedBy === column + " descending" ? (
          <ExpandMore />
        ) : (
          <UnfoldMore />
        )}
        <Typography fontWeight="bold" fontSize={14}>
          {column}
        </Typography>
      </Stack>
    </TableCell>
  );
};

export default ProjectTableHeadCell;
