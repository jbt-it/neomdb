import React, { useCallback, useEffect, useState, useContext } from "react";
import { Box, Stack, Divider, SelectChangeEvent } from "@mui/material";

import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth-context/AuthContext";

import { MemberPartialDto } from "../../types/membersTypes";
import { Trainee, InternalProjectDto, Generation } from "../../types/traineesTypes";
import { authReducerActionType } from "../../types/globalTypes";

import PageBar from "../../components/navigation/PageBar";
import TraineeSectionTable from "../../components/members/trainees/TraineeSectionTable";
import InternalProjectCard from "../../components/members/trainees/InternalProjectCard";
import TraineeSectionSkeleton from "../../components/members/trainees/TraineeSectionSkeleton";
import AddInternalProjectButton from "../../components/members/trainees/AddInternalProjectButton";
import GenerationSelection from "../../components/members/trainees/GenerationSelection";

/**
 * This component displays the trainee section page
 * All internal projects of the selected generation are displayed as cards
 * If the user has the permission to add internal projects, a button is displayed to add a new internal project
 * All trainees of the selected generation are displayed in a table if the user has the permission to see the trainees
 * @returns TraineeSection
 */
const TraineeSection: React.FunctionComponent = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [members, setMembers] = useState<MemberPartialDto[]>([]);
  const [internalProjects, setInternalProjects] = useState<InternalProjectDto[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const hasPermissionInternalProject = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const [isLoadingGenerations, setIsLoadingGenerations] = useState<boolean>(true); // state for loading generations
  const [isLoadingTrainees, setIsLoadingTrainees] = useState<boolean>(true); // state for loading trainees

  /**
   * retrieves all generations from the database and sets the state of generations
   * @returns a list of all generations with their generationID and bezeichnung
   */
  const getGenerations: VoidFunction = () => {
    setIsLoadingGenerations(true);
    let mounted = true;
    api
      .get("/trainees/generations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setGenerations(res.data.reverse());
            setSelectedGeneration(res.data[0].description);
            setIsLoadingGenerations(false);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  /**
   * retrieves all trainees of the selected generation from the database and sets the state of trainees
   * TODO: remove traineesTmp as soon as the backend route is fixed
   */
  const getTrainees: VoidFunction = () => {
    let mounted = true;
    api
      //.get(`/trainees/generations/:generationID/internal-projects-and-workshop-feedback`, {
      .get(`/members`, {
        //correct Routes need to be imported
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            //const to add generation value to trainee, because api call currently doesn't get generation
            const generationID = generations.find(
              (generation) => generation.description === selectedGeneration
            )?.generationId;
            //manually add values for testing until route in backend is fixed
            const traineesTmp = res.data
              .filter((trainee: Trainee) => trainee.generationId === generationID)
              .map((trainee: Trainee) => {
                return {
                  ...trainee,
                  AngebotBeiEV: true,
                  APgehalten: false,
                  DLbeiEV: true,
                  Projektmanagement: true,
                  RhetorikPräsenationstechnik: true,
                  AkquiseVerhandlungstechnik: false,
                  FinanzenRecht: false,
                  Netzwerke: true,
                  Qualitätsmanagement: true,
                  MSPowerpoint: false,
                  StrategieOrganisation: false,
                  Datenschutzschulung: false,
                  Sicherheitsschulung: false,
                  ExcelGrundlagen: false,
                };
              });
            setTrainees(traineesTmp);
            setIsLoadingTrainees(false);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    return () => {
      mounted = false;
    };
  };

  /**
   * Retrieves all members
   * TODO: split into two functions, one for all members who should be selected as qms and one for members of a specific generation
   */
  const getMembers: VoidFunction = useCallback(() => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembers(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  }, [dispatchAuth]);

  /**
   * retrieves all traineegenerations from the database and sets the state of traineegenerations
   * TODO: change to only get a specific generation as soon as the backend route is fixed
   */
  const getInternalProjects: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get(`/trainees/ips/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setInternalProjects(
              res.data.filter(
                (item: InternalProjectDto) =>
                  item.generation ===
                  generations.find((generation) => generation.description === selectedGeneration)?.generationId
              )
            );
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(() => getGenerations(), []);
  useEffect(() => getMembers(), []);
  useEffect(() => getTrainees(), [selectedGeneration]);
  useEffect(() => getInternalProjects(), [selectedGeneration]);

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

  return isLoadingGenerations && isLoadingTrainees ? (
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
                trainees={trainees}
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
        {internalProjects.map((internalProject) => (
          <InternalProjectCard internalProject={internalProject} />
        ))}
      </Box>

      {hasPermissionInternalProject ? (
        <>
          <Divider sx={{ mb: 5 }} />
          <TraineeSectionTable trainees={trainees} />
        </>
      ) : null}
      <PageBar pageTitle="Traineebereich" />
    </>
  );
};

export default TraineeSection;
