import React from "react";
import { Chip, SxProps } from "@mui/material";

interface Props {
  type: "ww" | "netzwerk" | "jbtGoes" | "sonstige" | "workshop" | "pflichtworkshop";
  sx?: SxProps;
}

function EventChip(props: Props) {
  if (props.type === "pflichtworkshop") {
    return <Chip label="Pflichtworkshop" color="secondary" sx={{ margin: 0.5, ...props.sx }} size="small" />;
  } else if (props.type === "workshop") {
    return (
      <Chip label="Workshop" sx={{ bgcolor: "#318c6f", color: "#ffffff", margin: 0.5, ...props.sx }} size="small" />
    );
  }

  if (props.type === "ww") {
    return <Chip label="WW" color="default" sx={{ margin: 0.5, ...props.sx }} size="small" />;
  } else if (props.type === "netzwerk") {
    return (
      <Chip label="Netzwerk" size="small" sx={{ bgcolor: "#891ff6", color: "#ffffff", margin: 0.5, ...props.sx }} />
    );
  } else if (props.type === "jbtGoes") {
    return <Chip label="JBT goes" color="primary" size="small" sx={{ margin: 0.5, ...props.sx }} />;
  } else {
    return <Chip label="Sonstige" color="info" size="small" sx={{ margin: 0.5, ...props.sx }} />;
  }
}

export default EventChip;
