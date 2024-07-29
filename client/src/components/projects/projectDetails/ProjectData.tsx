import { Box, Button, Card, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ProjectMembersDto } from "../../../types/projectTypes";
import InfoSection, { InformationField } from "../../general/InfoSection";
import { MembersFieldDto } from "../../../types/membersTypes";

interface ProjectDataProps {
  projectMembers: ProjectMembersDto[] | null;
  qms: MembersFieldDto[] | null;
  signatureDate: Date | null;
  euroPerBT: number | null;
  soldBT: number | null;
  soldExpenses: number | null;
}

const ProjectData = ({ projectMembers, qms, signatureDate, euroPerBT, soldBT, soldExpenses }: ProjectDataProps) => {
  return (
    <Card sx={{ mt: 4, paddingX: 4, paddingY: 2 }}>
      <Typography variant="h6" component="h1" gutterBottom fontWeight={"bold"}>
        Daten zur Durchführung und Abrechnung
      </Typography>
      <Divider sx={{ borderColor: "#f6891f", mb: 3 }} />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektmitglieder:
        </Typography>
        <List sx={{ flex: 3, m: 0 }} disablePadding>
          {projectMembers?.map((member) => (
            <ListItem
              key={member.memberId}
              sx={{ p: 0, marginTop: -0.5 }}
              component={Link}
              to={`/gesamtuebersicht/${member.memberId}`}
            >
              <Stack direction={"row"} gap={2}>
                <ListItemText
                  primary={`${member.firstname} ${member.lastname}${member.type === "PL" ? " (PL)" : ""}`}
                  sx={{ color: "black" }}
                />
                <Button>Bewerbung</Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          QMs:
        </Typography>
        <List sx={{ flex: 3, m: 0 }} disablePadding>
          {qms?.map((qm) => (
            <ListItem
              key={qm.memberId}
              sx={{ p: 0, marginTop: -0.5 }}
              component={Link}
              to={`/gesamtuebersicht/${qm.memberId}`}
            >
              <ListItemText primary={`${qm.firstname} ${qm.lastname}`} sx={{ color: "black" }} />
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack direction={"row"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Unterschriftsdatum:
        </Typography>
        <Typography sx={{ flex: 3 }}>{signatureDate ? signatureDate.toLocaleDateString() : "-"}</Typography>
      </Stack>
      <Stack direction={"row"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Konditionen:
        </Typography>
        <Typography sx={{ flex: 3 }}>{euroPerBT}</Typography>
      </Stack>
      <Stack direction={"row"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Verkaufte BT:
        </Typography>
        <Typography sx={{ flex: 3 }}>{soldBT}</Typography>
      </Stack>
      <Stack direction={"row"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Verkaufte Spesen:
        </Typography>
        <Typography sx={{ flex: 3 }}>{soldExpenses}</Typography>
      </Stack>
    </Card>
  );
};

export default ProjectData;
