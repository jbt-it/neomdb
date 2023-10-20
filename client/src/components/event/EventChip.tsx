import React from "react";
import { Chip, SxProps } from "@mui/material";

interface Props {
  type: "ww" | "netzwerk" | "jbtGoes" | "sonstige" | "workshop" | "pflichtworkshop";
  sx?: SxProps;
  size?: "small" | "medium";
}

function EventChip(props: Props) {
  if (props.type === "pflichtworkshop") {
    return (
      <Chip
        label="Pflichtworkshop"
        size={props.size}
        color="secondary"
        sx={{ fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  } else if (props.type === "workshop") {
    return (
      <Chip
        label="Workshop"
        size={props.size}
        sx={{ bgcolor: "#318c6f", color: "#ffffff", fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  }

  if (props.type === "ww") {
    return <Chip label="WW" color="default" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} size="small" />;
  } else if (props.type === "netzwerk") {
    return (
      <Chip
        label="Netzwerk"
        size={props.size}
        sx={{ bgcolor: "#891ff6", color: "#ffffff", fontWeight: 600, margin: 0.5, ...props.sx }}
      />
    );
  } else if (props.type === "jbtGoes") {
    return (
      <Chip label="JBT goes" size={props.size} color="primary" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} />
    );
  } else {
    return <Chip label="Sonstige" size={props.size} color="info" sx={{ fontWeight: 600, margin: 0.5, ...props.sx }} />;
  }
}

export default EventChip;
