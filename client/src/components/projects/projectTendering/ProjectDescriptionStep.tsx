import React from "react";
import { ProjectDescriptionData } from "../../../types/projectTypes";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import useProjects from "../../../hooks/useProjects";

interface ProjectDescriptionStepProps {
  projectDescriptionData: ProjectDescriptionData;
  setProjectDescriptionData: React.Dispatch<React.SetStateAction<ProjectDescriptionData>>;
  isCompleted: boolean;
  errors: { [key: string]: boolean };
}

/**
 * Component to display the project description step of the project tendering form
 * @param projectDescriptionData - The project description data
 * @param setProjectDescriptionData - Function to change the project description data
 * @returns - A form to enter the project description data
 */
const ProjectDescriptionStep = ({
  projectDescriptionData,
  setProjectDescriptionData,
  isCompleted,
  errors,
}: ProjectDescriptionStepProps) => {
  const { situation, peculiarities, coreCompetencies, requirementProfile, referenceProjects, notes } =
    projectDescriptionData;
  const { allCoreCompetencies } = useProjects();

  // Handle situation change
  const onChangeSituation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescriptionData({ ...projectDescriptionData, situation: event.target.value });
  };

  // Handle peculiarities change
  const onChangePeculiarities = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescriptionData({ ...projectDescriptionData, peculiarities: event.target.value });
  };

  // Handle requirement profile change
  const onChangeRequirementProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescriptionData({ ...projectDescriptionData, requirementProfile: event.target.value });
  };

  // Handle reference projects change
  const onChangeReferenceProjects = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescriptionData({ ...projectDescriptionData, referenceProjects: event.target.value });
  };

  // Handle notes change
  const onChangeNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescriptionData({ ...projectDescriptionData, notes: event.target.value });
  };

  // Handle core competencies change
  const onChangeCoreCompetencies = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const newCompetency = allCoreCompetencies.find((competency) => competency.designation === name);
    if (coreCompetencies && newCompetency) {
      if (coreCompetencies.some((competency) => competency.designation === newCompetency.designation)) {
        setProjectDescriptionData({
          ...projectDescriptionData,
          coreCompetencies: coreCompetencies.filter((competency) => competency.designation !== name),
        });
      } else {
        setProjectDescriptionData({
          ...projectDescriptionData,
          coreCompetencies: [...coreCompetencies, newCompetency],
        });
      }
    }
  };

  return (
    <Stack direction={"column"} spacing={1}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Ausgangssituation/Zielsetzung:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          value={situation}
          onChange={onChangeSituation}
          disabled={isCompleted}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Besonderheiten:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          value={peculiarities}
          onChange={onChangePeculiarities}
          disabled={isCompleted}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Kernkompetenzen:
        </Typography>
        <FormControl sx={{ flex: 3 }} disabled={isCompleted} error={errors.coreCompetencies}>
          <FormGroup row onChange={onChangeCoreCompetencies}>
            {allCoreCompetencies.map((competency) => (
              <FormControlLabel
                key={competency.coreCompetencyId}
                control={
                  <Checkbox
                    checked={coreCompetencies.some((c) => c.designation === competency.designation)}
                    name={competency.designation}
                  />
                }
                label={competency.designation}
              />
            ))}
          </FormGroup>
          <Typography variant={"caption"} color={"error"} sx={{ display: errors.coreCompetencies ? "block" : "none" }}>
            Bitte wähle mindestens eine Kernkompetenz aus.
          </Typography>
        </FormControl>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Anforderungsprofil:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          value={requirementProfile}
          onChange={onChangeRequirementProfile}
          disabled={isCompleted}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Referenzprojekte:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          value={referenceProjects}
          onChange={onChangeReferenceProjects}
          disabled={isCompleted}
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography fontWeight={"bold"} sx={{ flex: 1 }}>
          Bemerkungen:
        </Typography>
        <TextField
          sx={{ flex: 3 }}
          variant="outlined"
          size="small"
          multiline
          value={notes}
          onChange={onChangeNotes}
          disabled={isCompleted}
        />
      </Stack>
    </Stack>
  );
};

export default ProjectDescriptionStep;
