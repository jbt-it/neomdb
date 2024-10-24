import { Chip } from "@mui/material";
import React from "react";

interface ProjectChipProps {
  status: string;
  size?: "small" | "medium";
}

/**
 * ProjectChip component
 * @param status - Status of the project can be "application", "offer", "active", "invoiced" or "completed
 * @returns - A chip component with the status of the project in different colors
 */
const ProjectChip: React.FC<ProjectChipProps> = ({ status, size }) => {
  switch (status) {
    case "Bewerbung":
      return (
        <Chip
          label="Bewerbung"
          color="success"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
    case "Angebot":
      return (
        <Chip label="Angebot" color="info" size={size ? size : "small"} sx={{ minWidth: 75, fontWeight: "bold" }} />
      );
    case "Druchführung":
      return (
        <Chip
          label="Durchführung"
          color="primary"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
    case "Abrechnung":
      return (
        <Chip
          label="Abrechnung"
          size={size ? size : "small"}
          sx={{ bgcolor: "#ad3d9b", color: "#fff", minWidth: 75, fontWeight: "bold" }}
        />
      );
    case "Abgeschlossen":
      return (
        <Chip
          label="Abgeschlossen"
          color="secondary"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
    case "Abgelehnt":
      return (
        <Chip label="Abgelehnt" color="error" size={size ? size : "small"} sx={{ minWidth: 75, fontWeight: "bold" }} />
      );
    case "Pitch verloren":
      return (
        <Chip
          label="Pitch verloren"
          color="error"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
    case "Nicht besetzt":
      return (
        <Chip
          label="Nicht besetzt"
          color="error"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
    default:
      return (
        <Chip
          label="Durchführung"
          color="primary"
          size={size ? size : "small"}
          sx={{ minWidth: 75, fontWeight: "bold" }}
        />
      );
  }
};

export default ProjectChip;
