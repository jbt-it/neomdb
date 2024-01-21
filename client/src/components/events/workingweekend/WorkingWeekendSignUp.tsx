import React from "react";
import { Chip } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import useResponsive from "../../../hooks/useResponsive";
import { Dayjs } from "dayjs";
import WorkingWeekendSignUpDialog from "./WorkingWeekendSignUpDialog";

type commonEventType = {
  ID: number;
  name: string;
  date: Dayjs;
  endDate: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  location: string | null;
  registrationStart: Dayjs | null;
  registrationDeadline: Dayjs | null;
  participantsCount?: number | null;
  maximumParticipants?: number | null;
  organizers?: string[];
  description?: string;
  type: "WW" | "Netzwerk" | "JBT goes" | "Sonstige" | "Workshop" | "Pflichtworkshop";
};

interface WorkingWeekendSignUpProps {
  ww: commonEventType;
}

/**
 *
 * @returns
 */
const WorkingWeekendSignUp: React.FunctionComponent<WorkingWeekendSignUpProps> = ({
  ww,
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
        ww.ID +
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
        remarks
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
        size={mobile ? "medium" : "small"}
        icon={<AddCircle />}
        onClick={handleOpen}
      />
      <WorkingWeekendSignUpDialog open={open} handleClose={handleClose} ww={ww} onSubmit={signUpForWW} />
    </>
  );
};

export default WorkingWeekendSignUp;
