import React, { useEffect, useState, useContext } from "react";
import { Box, Stack, Divider, SelectChangeEvent } from "@mui/material";

import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";

import { InternalProjectAll } from "../../types/traineesTypes";

import PageBar from "../../components/navigation/PageBar";
import TraineeSectionTable from "../../components/members/trainees/TraineeSectionTable";
import InternalProjectCard from "../../components/members/trainees/InternalProjectCard";
import TraineeSectionSkeleton from "../../components/members/trainees/TraineeSectionSkeleton";
import AddInternalProjectButton from "../../components/members/trainees/AddInternalProjectButton";
import GenerationSelection from "../../components/members/trainees/GenerationSelection";
import useTrainees from "../../hooks/useTrainees";
import useMembers from "../../hooks/members/useMembers";

/**
 * This component displays the trainee section page
 * All internal projects of the selected generation are displayed as cards
 * If the user has the permission to add internal projects, a button is displayed to add a new internal project
 * All trainees of the selected generation are displayed in a table if the user has the permission to see the trainees
 * @returns TraineeSection
 */
const TraineeSection: React.FunctionComponent = () => {
  const { auth } = useContext(AuthContext);

  const hasPermissionInternalProject = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const { members } = useMembers();

  const { internalProjects, generations, isGenerationsFetched } = useTrainees();

  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);

  const selectedGenerationIPs = internalProjects.filter(
    (item: InternalProjectAll) =>
      item.generation === generations.find((generation) => generation.bezeichnung === selectedGeneration)?.generationID
  );

  const { traineeProgress, isTraineeProgressFetched } = useTrainees(
    generations.find((generation) => generation.bezeichnung === selectedGeneration)?.generationID
  );

  useEffect(() => {
    // Sets selectedGeneration to the first object of generations once generations is loaded
    if (generations.length > 0 && !selectedGeneration) {
      setSelectedGeneration(generations[0].bezeichnung);
    }
  }, [generations, selectedGeneration]);

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

  return !isGenerationsFetched || !isTraineeProgressFetched ? (
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
            selectedGeneration === generations[0].bezeichnung && (
              <AddInternalProjectButton
                generationName={selectedGeneration}
                addInternalProject={addInternalProject}
                trainees={traineeProgress}
                members={members.filter(
                  (member) =>
                    member.generation != generations[0].generationID &&
                    member.mitgliedstatus != "Alumnus" &&
                    member.mitgliedstatus != "Ausgetretene"
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
        {selectedGenerationIPs.map((internalProject) => (
          <InternalProjectCard
            internalProject={internalProject}
            trainees={traineeProgress.filter((trainee) => {
              return trainee.internesprojekt === internalProject.internesProjektID;
            })}
          />
        ))}
      </Box>

      {hasPermissionInternalProject ? (
        <>
          <Divider sx={{ mb: 5 }} />
          <TraineeSectionTable trainees={traineeProgress} />
        </>
      ) : null}
      <PageBar pageTitle="Traineebereich" />
    </>
  );
};

export default TraineeSection;
