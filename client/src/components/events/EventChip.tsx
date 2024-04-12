import React from "react";
import { Chip, SxProps } from "@mui/material";

interface Props {
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop" | "Externer Workshop";
  sx?: SxProps;
  size?: "small" | "medium";
}

function EventChip(props: Props) {
  if (props.type === "Pflichtworkshop") {
    return (
      <Chip
        label="Pflichtworkshop"
        size={props.size}
        color="secondary"
        sx={{ fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  } else if (props.type === "Workshop") {
    return (
      <Chip
        label="Workshop"
        size={props.size}
        sx={{ bgcolor: "#318c6f", color: "#ffffff", fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  } else if (props.type === "Externer Workshop") {
    return (
      <Chip
        label="Externer Workshop"
        size={props.size}
        sx={{ bgcolor: "#ad3d9b", color: "#ffffff", fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  }

  if (props.type === "WW") {
    return <Chip label="WW" color="default" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} size="small" />;
  } else if (props.type === "Netzwerk") {
    return (
      <Chip
        label="Netzwerk"
        size={props.size}
        sx={{ bgcolor: "#891ff6", color: "#ffffff", fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  } else if (props.type === "JBT goes") {
    return (
      <Chip label="JBT goes" size={props.size} color="primary" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} />
    );
  } else {
    return <Chip label="Sonstige" size={props.size} color="info" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} />;
  }
}

export default EventChip;
