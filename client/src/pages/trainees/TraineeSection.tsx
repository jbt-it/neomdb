import React, { useEffect, useState, useContext } from "react";
import { Box, Stack, Divider, SelectChangeEvent } from "@mui/material";

import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";

import TraineeSectionTable from "../../components/members/trainees/TraineeSectionTable";
import InternalProjectCard from "../../components/members/trainees/InternalProjectCard";
import TraineeSectionSkeleton from "../../components/members/trainees/TraineeSectionSkeleton";
import AddInternalProjectButton from "../../components/members/trainees/AddInternalProjectButton";
import GenerationSelection from "../../components/members/trainees/GenerationSelection";
import useMembers from "../../hooks/members/useMembers";
import useTrainees from "../../hooks/trainees/useTrainees";
import useTraineeGeneration from "../../hooks/trainees/useTraineeGeneration";

/**
 * This component displays the trainee section page
 * All internal projects of the selected generation are displayed as cards
 * If the user has the permission to add internal projects, a button is displayed to add a new internal project
 * All trainees of the selected generation are displayed in a table if the user has the permission to see the trainees
 * @returns TraineeSection
 */
const TraineeSection: React.FunctionComponent = () => {
  const { auth } = useContext(AuthContext);
  const { generations, isGenerationsFetched } = useTrainees();
  const { members } = useMembers();

  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const hasPermissionInternalProject = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const selectedGenerationId =
    generations.find((generation) => generation.description === selectedGeneration)?.generationId ?? 0;

  const {
    traineeProgress,
    isTraineeProgressFetched,
    internalProjectsOfGeneration,
    isInternalProjectsOfGenerationFetched,
  } = useTraineeGeneration(selectedGenerationId);

  useEffect(() => {
    if (isGenerationsFetched && generations.length > 0) {
      setSelectedGeneration(generations[0].description);
    }
  }, [isGenerationsFetched]);

  const addInternalProject = (traineeIDs: number[], qmIDs: number[], projectName: string, projectShort: string) => {
    alert(
      "Gespeichert wurde: \n" +
        "trainees: " +
        traineeIDs +
        "\n QMs: " +
        qmIDs +
        "\n Projektname: " +
        projectName +
        "\n Projektkürzel: " +
        projectShort +
        "\n Generation: " +
        selectedGeneration
    );
  };

  // handles the change of the selected generation
  const handleGenerationChange = (event: SelectChangeEvent<string | null>): void => {
    setSelectedGeneration(event.target.value as string);
  };

  return !isGenerationsFetched && !isTraineeProgressFetched && isInternalProjectsOfGenerationFetched ? (
    <TraineeSectionSkeleton />
  ) : (
    <>
      <Stack sx={{ mt: 1, mb: 3 }} direction={"row"} spacing={5} alignItems={"end"}>
        <GenerationSelection
          selectedGeneration={selectedGeneration}
          handleGenerationChange={handleGenerationChange}
          generations={generations}
        />
        {generations[0]
          ? hasPermissionInternalProject &&
            selectedGeneration === generations[0].description && (
              <AddInternalProjectButton
                generationName={selectedGeneration}
                addInternalProject={addInternalProject}
                members={members.filter(
                  (member) =>
                    member.generationId != generations[0].generationId &&
                    member.memberStatus?.name != "Alumnus" &&
                    member.memberStatus?.name != "Ausgetretene"
                )}
              />
            )
          : null}
      </Stack>
      <Box
        sx={() => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "left",
          overflowX: { sm: "auto" },
          flexWrap: "wrap",
        })}
      >
        {internalProjectsOfGeneration.map((internalProject) => (
          <InternalProjectCard internalProject={internalProject} />
        ))}
      </Box>

      {hasPermissionInternalProject ? (
        <>
          <Divider sx={{ mb: 5 }} />
          <TraineeSectionTable trainees={traineeProgress} />
        </>
      ) : null}
    </>
  );
};

export default TraineeSection;
