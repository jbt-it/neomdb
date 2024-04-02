import React from "react";
import { Chip } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import useResponsive from "../../../hooks/useResponsive";
import WorkingWeekendSignUpDialog from "./WorkingWeekendSignUpDialog";
import { CommonEventType } from "../../../types/eventTypes";

interface WorkingWeekendSignUpProps {
  ww: CommonEventType;
  size?: "small" | "medium";
}

/**
 *
 * @returns
 */
const WorkingWeekendSignUp: React.FunctionComponent<WorkingWeekendSignUpProps> = ({
  ww,
  size,
}: WorkingWeekendSignUpProps) => {
  const [open, setOpen] = React.useState(false);
  const mobile = useResponsive("down", "sm");
  const signUpForWW = (
    arrival: string,
    departure: string,
    car: boolean,
    vegetarian: boolean,
    remarks: string,
    debitNotice: boolean,
    seats?: number
  ) => {
    alert(
      "Anmeldung für " +
        ww.name +
        ww.eventID +
        " erfolgreich!" +
        "\n" +
        "Ankunft: " +
        arrival +
        "\n" +
        "Abfahrt: " +
        departure +
        "\n" +
        "Auto: " +
        car +
        "\n" +
        "Sitzplätze: " +
        seats +
        "\n" +
        "Vegetarisch: " +
        vegetarian +
        "\n" +
        "Bemerkungen: " +
        remarks +
        "\n" +
        "Lastschrift: " +
        debitNotice
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Chip
        label="Anmelden"
        color="success"
        size={size ? size : mobile ? "medium" : "small"}
        icon={<AddCircle />}
        onClick={handleOpen}
      />
      <WorkingWeekendSignUpDialog open={open} handleClose={handleClose} ww={ww} onSubmit={signUpForWW} />
    </>
  );
};

export default WorkingWeekendSignUp;
