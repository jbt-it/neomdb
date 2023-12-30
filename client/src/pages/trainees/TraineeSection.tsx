import TraineeSectionAdmin from "./TraineeSectionAdmin";
import TraineeSectionMember from "./TraineeSectionMember";
import React, { useCallback, useEffect } from "react";
import * as membersTypes from "../../types/membersTypes";
import { useState, useContext } from "react";
import api from "../../utils/api";
import * as traineeTypes from "../../types/traineesTypes";
import {
  Box,
  TextField,
  Theme,
  MenuItem,
  Paper,
  Stack,
  Container,
  Divider,
  FormControl,
  Input,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import { showErrorMessage } from "../../utils/toastUtils";
import PageBar from "../../components/navigation/PageBar";

import TraineeSectionTraineesTable from "../../components/members/trainees/TraineeSectionTraineesTable";
import InternalProjectCard from "../../components/members/trainees/InternalProjectCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterBtn: {
      [theme.breakpoints.up("md")]: {
        marginTop: "12px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "50px",
      },
      [theme.breakpoints.down("md")]: {
        marginTop: "15px",
        marginBottom: "7px",
        marginRight: "5px",
        marginLeft: "25px",
      },
    },
    cancelButton: {
      margin: theme.spacing(1, 1, 1, 1),
    },
    generationFilterMain: {
      "@media screen and (orientation:landscape)": {
        display: "block",
      },
      "@media screen and (orientation:portrait)": {
        display: "none",
      },
    },
    filterElement: {
      [theme.breakpoints.up("md")]: {
        margin: "7px",
        width: "155px",
      },
      [theme.breakpoints.down("md")]: {
        margin: "7px",
        width: "120px",
      },
      [theme.breakpoints.down("sm")]: {
        margin: "7px",
        width: "120px",
      },
    },
  })
);

/**
 * TODOs: rework getTrainees(), getMembers(), getInternalProject(), getTraineegeneration(), getFilteredInternalProjects()
 * only retrieve Members from a specific
 * Zuerst: einfach alle IPs -> easy switch, dann: Route bauen, um nur die IPs einer Generation zu bekommen + Route mit allen Generationen (Nummer und Bezeichnung)
 * Zuerst: alle Members -> nach Generation filtern, dann: Route bauen, um nur die Members einer Generation zu bekommen/eines IPs
 * Informationen aus DB richtig darstellen: Date als XX.XX.XXX, 1 -> Ja, 0 -> Nein
 * @returns TraineeSection
 */
const TraineeSection: React.FunctionComponent = () => {
  const classes = useStyles();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [hasPermission, setListOfPermissions] = useState<boolean>(false);
  const [trainees, setTrainees] = useState<traineeTypes.Trainee[]>([]);
  const [traineegenerationData, setTraineeGenerationData] = useState<traineeTypes.InternalProjectAll[]>([]);
  const [internalProject, setInternalProject] = useState<traineeTypes.InternalProject[]>([]);
  const [GenerationFilter, setGenerationFilter] = useState<string>("");
  const [members, setMembers] = useState<membersTypes.Member[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [generations, setGenerations] = useState<traineeTypes.Generation[]>([]);

  /**
   * retrieves all trainees from the database and sets the state of trainees
   * TODO: find out what this does and maybe only retrieve trainees
   */
  const getTrainees: VoidFunction = () => {
    let mounted = true;
    api
      //.get(`/trainees/generations/:generationID/internal-projects-and-workshop-feedback`, {
      .get(`/users`, {
        //correct Routes need to be imported
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            //const to add generation value to trainee, because api call currently doesn't get generation
            const traineesTmp = res.data.map((trainee: traineeTypes.Trainee) => ({ ...trainee, generation: 15 }));
            setTrainees(traineesTmp);
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
   * TODO: find out what this does
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
   * Handles the change event on the traineegeneration filter input
   * @param event
   */
  const handleGenerationChange = (event: SelectChangeEvent<string | null>): void => {
    // setGenerationFilter(event.target.value);
    setSelectedGeneration(event.target.value as string);
  };

  //api call to get all information of current and former internal projects

  /**
   * retrieves all internal projects from the database and sets the state of internal projects
   * /trainees/generations/15/internal-projects
   * TODO: only retrieve internal projects from a specific generation
   */
  const getInternalProject: VoidFunction = () => {
    let mounted = true;
    api
      .get("/trainees/generations/15/internal-projects", {
        //correct Routes need to be imported when available, currently only one generation is being called, check if new code retreives all IPs
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setInternalProject(res.data);
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });
    return () => {
      mounted = false;
    };
  };

  const getPermissions: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/users/permissions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setListOfPermissions(res.data);
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

  //currently gets all IPs -> should use route to only get generationIDs and Bezeichnung
  const getGenerations: VoidFunction = () => {
    let mounted = true;
    api
      .get("/trainees/generations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setGenerations(res.data.reverse());
            setSelectedGeneration(res.data[0].bezeichnung);
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
   * retrieves all traineegenerations from the database and sets the state of traineegenerations
   */
  const getTraineegeneration: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    // .get(`/trainees/generations/:generationID/internal-projects-and-workshop-feedback`, {
    let mounted = true;
    api
      .get(`/trainees/ips/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log("res.data getTraineegeneration:");
        console.log(res.data);
        if (res.status === 200) {
          if (mounted) {
            setGenerationFilter(res.data[res.data.length - 1].bezeichnung);
            setTraineeGenerationData(
              res.data.filter(
                (item: traineeTypes.InternalProjectAll) =>
                  item.generation ===
                  generations.find((generation) => generation.bezeichnung === selectedGeneration)?.generationID
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

  useEffect(() => getTrainees(), []);
  useEffect(() => getMembers(), []);
  useEffect(() => getInternalProject(), []);
  useEffect(() => getPermissions(), []);
  useEffect(() => getTraineegeneration(), [selectedGeneration]);
  useEffect(() => getGenerations(), []);

  const dummydata: traineeTypes.Generation[] = [
    { generationID: 15, bezeichnung: "Wintersemester 19/20", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 14, bezeichnung: "Sommersemester 2019", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 13, bezeichnung: "Wintersemester 18/19", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 12, bezeichnung: "Sommersemester 2018", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 11, bezeichnung: "Wintersemester 17/18", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 10, bezeichnung: "Sommersemester 2017", bewerbung_start: "2019-10-10T14:30:00Z" },
  ];
  //TODO dummydata needs to be replaced by original data
  //Function to match the generation Bezeichnung witih the generationID
  const bezeichnungToGenerationID: Record<string, number> = {};
  dummydata.forEach((generation) => {
    bezeichnungToGenerationID[generation.bezeichnung] = generation.generationID;
  });

  /**
   * Filters and sorts the Trainee data and returns it
   * TODO: find out what this does
   */
  const getFilteredMembers = (): traineeTypes.Trainee[] => {
    let filteredMembers = trainees;
    // Filters by Traineegeneration
    if (GenerationFilter !== "") {
      const generationID = bezeichnungToGenerationID[GenerationFilter];
      filteredMembers = filteredMembers.filter((trainee) => {
        return trainee.generation === generationID;
      });
    }
    return filteredMembers;
  };

  /**
   * Filters and sorts the Internal Project data and returns it
   */
  const getFilteredInternalProjects = (): traineeTypes.InternalProject[] => {
    let filteredInternalProjects = internalProject;
    //Filters IPs by Traineegeneration
    if (GenerationFilter !== "") {
      const generationID = bezeichnungToGenerationID[GenerationFilter];
      filteredInternalProjects = filteredInternalProjects.filter((InternalProject) => {
        return InternalProject.generation === generationID;
      });
    }
    return filteredInternalProjects;
  };

  // Functions to change the type of the Generationfilter from string to number
  const stringvalue = GenerationFilter;
  const numbervalue = parseInt(stringvalue, 10);

  const hasPermissionInternalProject = doesPermissionsHaveSomeOf(auth.permissions, [15]);

  const generationSelection = () => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
    return (
      <FormControl sx={{ width: 220 }} size="small">
        <Select value={selectedGeneration} onChange={handleGenerationChange} MenuProps={MenuProps}>
          {generations.length > 0 ? (
            generations.map((generation) => (
              <MenuItem key={generation.generationID} value={generation.bezeichnung}>
                {generation.bezeichnung}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Keine Traineegeneration gefunden</MenuItem>
          )}
        </Select>
      </FormControl>
    );
  };

  // Code to generate the Traineesection based on the Permissions the User has
  return (
    <>
      {/* {hasPermissionInternalProject ? (
        <>
          <Box className={classes.generationFilterMain}>
            <TextField
              label="Traineegeneration"
              className={classes.filterElement}
              color="primary"
              onChange={handleGenerationChange}
              value={selectedGeneration?.Bezeichnung || ""}
              select
            >
              {dummydata.map((generation) => (
                <MenuItem key={generation.generationID} value={generation.bezeichnung} defaultValue={GenerationFilter}>
                  {generation.Bezeichnung}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TraineeSectionAdmin
            listOfPermissions={auth.permissions}
            isOwner={true}
            trainees={getFilteredMembers()}
            internalProjects={getFilteredInternalProjects()}
            generation={Traineegeneration}
            generationFilter={numbervalue}
            members={members}
            currentGeneration={stringvalue}
          />
        </>
      ) : (
        <TraineeSectionMember
          listOfPermissions={auth.permissions}
          isOwner={false}
          trainees={getFilteredMembers()}
          internalProjects={getFilteredInternalProjects()}
          generation={dummydata}
          generationFilter={numbervalue}
        />
      )} */}
      <Box sx={{ mt: 1, mb: 3 }}>
        <Typography fontSize={12}>Traineegeneration:</Typography>
        {generationSelection()}
      </Box>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "left",
          overflowX: { sm: "auto" },
          flexWrap: "wrap",
        })}
      >
        {traineegenerationData.map((internalProject) => (
          <InternalProjectCard internalProject={internalProject} />
        ))}
      </Box>

      {hasPermissionInternalProject ? (
        <>
          <Divider sx={{ mb: 5 }} />
          <TraineeSectionTraineesTable />
        </>
      ) : null}
      <PageBar pageTitle="Traineebereich" />
    </>
  );
};

export default TraineeSection;
