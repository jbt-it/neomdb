import React from "react";
import {
  Card,
  CardActionArea,
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
import { InternalProjectAll } from "../../../types/traineesTypes";
import dayjs from "dayjs";
import { stringAvatar } from "../../../utils/stringUtils";
import { Trainee } from "../../../types/traineesTypes";

interface Props {
  internalProject: InternalProjectAll;
  trainees: Trainee[];
}

/**
 * The InternalProjectCard component displays the internal project information with all trainees and milestones
 * @param props - internalProject: InternalProjectAll, trainees: Trainee[]
 * @returns - Card with internal project information
 */
const InternalProjectCard = (props: Props) => {
  const { internesProjektID, projektname } = props.internalProject;
  const kickoff = props.internalProject.kickoff ? dayjs(props.internalProject.kickoff).format("DD.MM.YYYY") : "Nein";
  const ZPGehalten = props.internalProject.ZPGehalten
    ? dayjs(props.internalProject.ZPGehalten).format("DD.MM.YYYY")
    : "Nein";
  const APGehalten = props.internalProject.APGehalten
    ? dayjs(props.internalProject.APGehalten).format("DD.MM.YYYY")
    : "Nein";

  const AngebotBeiEV = props.internalProject.AngebotBeiEV === 1 ? "Ja" : "Nein";
  const DLBeiEV = props.internalProject.DLBeiEV === 1 ? "Ja" : "Nein";
  const ZPBeiEV = props.internalProject.ZPBeiEV === 1 ? "Ja" : "Nein";
  const trainees = props.trainees;

  // rows for the table
  const rows = [
    { label: "Kick-Off:", value: kickoff },
    { label: "Angebot:", value: AngebotBeiEV },
    { label: "AP:", value: APGehalten },
    { label: "ZP:", value: ZPGehalten },
    { label: "DL:", value: DLBeiEV },
  ];

  return (
    <Card sx={(theme) => ({ width: { xs: "100%", sm: 200, xl: 250 }, mr: 1, mb: 5 })} key={internesProjektID}>
      <CardActionArea>
        <CardContent>
          <Stack direction={"column"} sx={{ mb: 2, mt: -2, minHeight: 150 }}>
            <Typography fontSize={16} fontWeight={"bold"} sx={{ mb: 1, mt: 1 }}>
              {projektname}
            </Typography>
            <Stack direction={"column"} alignItems={"start"} spacing={0.5}>
              {trainees.map((trainee: Trainee, index) => (
                <Stack direction={"row"} alignItems={"center"} spacing={1} key={index}>
                  <Avatar
                    alt={`${trainee.vorname} ${trainee.nachname}`}
                    {...stringAvatar(`${trainee.vorname} ${trainee.nachname}`)}
                    sx={{ fontSize: "0.5rem", width: 15, height: 15 }}
                  />
                  <Typography variant="body1" color="text.secondary" fontSize={14}>
                    {`${trainee.vorname} ${trainee.nachname}`}
                  </Typography>
                </Stack>
              ))}
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
      </CardActionArea>
    </Card>
  );
};

export default InternalProjectCard;
