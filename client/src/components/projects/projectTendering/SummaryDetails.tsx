import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { CustomerData, ProjectDescriptionData, ProjectKeyData } from "../../../types/projectTypes";

interface SummaryDetailsProps {
  projectKeyData: ProjectKeyData;
  customerData: CustomerData;
  projectDescriptionData: ProjectDescriptionData;
}

const SummaryDetails = ({ projectKeyData, customerData, projectDescriptionData }: SummaryDetailsProps) => {
  return (
    <Stack direction={"column"} spacing={1}>
      <Typography fontWeight={"bold"} color="primary" fontSize={18}>
        Zusammenfassung
      </Typography>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektname:
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.projectName}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Startschuss:
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectStart?.format("DD.MM.YYYY")}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Dauer:
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectDuration}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Konditionen:
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectEuroPerBT}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Beratertage (Min):
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectBTmin}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Beratertage (Max):
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectBTmax}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektmitglieder (Min):
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectMemberMin}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Projektmitglieder (Max):
        </Typography>
        <Typography sx={{ flex: 3 }}>{projectKeyData.estimatedProjectMemberMax}</Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Kernkompetenzen:
        </Typography>
        <Typography sx={{ flex: 3 }}>
          {projectDescriptionData.coreCompetencies.length === 1
            ? projectDescriptionData.coreCompetencies[0].designation
            : projectDescriptionData.coreCompetencies.map((competency) => competency.designation).join(", ")}
        </Typography>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Auftraggeber:
        </Typography>
        <Typography sx={{ flex: 3 }}>{customerData.name}</Typography>
      </Stack>
      <Divider />
    </Stack>
  );
};

export default SummaryDetails;
