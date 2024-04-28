import React from "react";
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Avatar,
  Typography,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { InternalProjectDto } from "../../../types/traineesTypes";
import dayjs from "dayjs";
import { stringAvatar } from "../../../utils/stringUtils";
import { MembersFieldDto } from "../../../types/membersTypes";

interface Props {
  internalProject: InternalProjectDto;
}

/**
 * The InternalProjectCard component displays the internal project information with all trainees and milestones
 * @param props - internalProject: InternalProjectAll, trainees: Trainee[]
 * @returns - Card with internal project information
 */
const InternalProjectCard = (props: Props) => {
  const { internalProjectID, projectName, members } = props.internalProject;
  const kickoff = props.internalProject.kickoff ? dayjs(props.internalProject.kickoff).format("DD.MM.YYYY") : "Nein";
  const zpHeld = props.internalProject.zpHeld ? dayjs(props.internalProject.zpHeld).format("DD.MM.YYYY") : "Nein";
  const apHeld = props.internalProject.apHeld ? dayjs(props.internalProject.apHeld).format("DD.MM.YYYY") : "Nein";

  const offerAtEv = props.internalProject.offerAtEv ? "Ja" : "Nein";
  const dlAtEv = props.internalProject.dlAtEv ? "Ja" : "Nein";
  const zpAtEv = props.internalProject.zpAtEv ? "Ja" : "Nein";

  // rows for the table
  const rows = [
    { label: "Kick-Off:", value: kickoff },
    { label: "Angebot:", value: offerAtEv },
    { label: "AP:", value: apHeld },
    { label: "ZP:", value: zpHeld },
    { label: "DL:", value: dlAtEv },
  ];

  return (
    <Card sx={(theme) => ({ width: { xs: "100%", sm: 200, xl: 250 }, mr: 1, mb: 5 })} key={internalProjectID}>
      <CardContent>
        <Stack direction={"column"} sx={{ mb: 2, mt: -2, minHeight: 150 }}>
          <Link to={`/internes-projekt/${internalProjectID}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography fontSize={16} fontWeight={"bold"} sx={{ mb: 1, mt: 1 }}>
              {projectName}
            </Typography>
          </Link>
          <Stack direction={"column"} alignItems={"start"} spacing={0.5}>
            {members
              ? members.map((trainee: MembersFieldDto, index) => (
                  <Link
                    to={`/gesamtuebersicht/${trainee.memberId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1} key={index}>
                      <Avatar
                        alt={`${trainee.firstname} ${trainee.lastname}`}
                        {...stringAvatar(`${trainee.firstname} ${trainee.lastname}`)}
                        sx={{ fontSize: "0.5rem", width: 15, height: 15 }}
                      />
                      <Typography variant="body1" color="text.secondary" fontSize={14}>
                        {`${trainee.firstname} ${trainee.lastname}`}
                      </Typography>
                    </Stack>
                  </Link>
                ))
              : null}
          </Stack>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ fontWeight: "medium", borderBottom: 1, color: "primary.main", fontSize: 16 }}>
              Meilensteine
            </TableHead>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "bold", borderBottom: 0, padding: 0, color: "text.secondary" }}>
                  {row.label}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 0, padding: 0, color: "text.secondary" }}>
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default InternalProjectCard;
