import TraineeSectionAdmin from "./TraineeSectionAdmin";
import TraineeSectionMember from "./TraineeSectionMember";
import React, { useEffect } from "react";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";
import * as membersTypes from "../members/membersTypes";
import { useState, useContext } from "react";
import { AuthContext } from "../global/AuthContext";
import api from "../utils/api";
import * as traineeTypes from "./traineesTypes";
import { authReducerActionType } from "../global/globalTypes";
import { showErrorMessage } from "../utils/toastUtils";
import { Grid, TextField, Theme, MenuItem } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import PageBar from "../global/components/navigation/PageBar";

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
const TraineeSection: VoidFunction = () => {
  const classes = useStyles();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [trainees, setTrainees] = useState<traineeTypes.Trainee[]>([]);
  const [IP, setInternalProject] = useState<traineeTypes.InternalProject[]>([]);
  const [hasPermission, setListOfPermissions] = useState<boolean>(false);
  const [Traineegeneration, setTraineeGeneration] = useState<membersTypes.Member[]>([]);
  const [GenerationFilter, setGenerationFilter] = useState<string>("");

  //api call to get all information of current and former trainees

  const getTrainee: VoidFunction = () => {
    let mounted = true;
    api
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
      .catch((error) => {
        if (error.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    return () => {
      mounted = false;
    };
  };

  /**
   * Handles the change event on the traineegeneration filter input
   * @param event
   */
  const handleGenerationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setGenerationFilter(event.target.value);
  };

  //api call to get all information of current and former internal projects

  const getInternalProject: VoidFunction = () => {
    let mounted = true;
    api
      .get(`/trainees/generations/{$:id}/internal-projects`, {
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
      .catch(() => {
        showErrorMessage("Berechtigungen konnten nicht geladen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  const getTraineegeneration: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .get("/trainees/generations/:generationID/internal-projects-and-workshop-feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setGenerationFilter(res.data[res.data.length - 1].bezeichnung);
            setTraineeGeneration(res.data);
          }
        }
      })
      .catch(() => {
        showErrorMessage("Berechtigungen konnten nicht geladen werden");
      });
    // Clean-up function
    return () => {
      mounted = false;
    };
  };
  useEffect(() => getTrainee(), []);
  useEffect(() => getInternalProject(), []);
  useEffect(() => getPermissions(), []);
  useEffect(() => getTraineegeneration(), []);

  const dummydata: traineeTypes.Generation[] = [
    { generationID: 15, Bezeichnung: "Wintersemester 19/20", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 14, Bezeichnung: "Sommersemester 2019", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 13, Bezeichnung: "Wintersemester 18/19", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 12, Bezeichnung: "Sommersemester 2018", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 11, Bezeichnung: "Wintersemester 17/18", bewerbung_start: "2019-10-10T14:30:00Z" },
    { generationID: 10, Bezeichnung: "Sommersemester 2017", bewerbung_start: "2019-10-10T14:30:00Z" },
  ];

  //Function to match the generation Bezeichnung witih the generationID
  const bezeichnungToGenerationID: Record<string, number> = {};
  dummydata.forEach((generation) => {
    bezeichnungToGenerationID[generation.Bezeichnung] = generation.generationID;
  });

  /**
   * Filters and sorts the Trainee data and returns it
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
    let filteredInternalProjects = IP;
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

  // Code to generate the Traineesection based on the Permissions the User has
  return (
    <>
      {" "}
      {hasPermissionInternalProject ? (
        <div>
          <div className="content-page">
            <Grid item xs={6} sm={3} className={classes.generationFilterMain}>
              <TextField
                label="Traineegeneration"
                className={classes.filterElement}
                color="primary"
                onChange={handleGenerationChange}
                value={GenerationFilter}
                select
              >
                {dummydata.map((generation) => (
                  <MenuItem key={generation.generationID} value={generation.Bezeichnung}>
                    {generation.Bezeichnung}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <TraineeSectionAdmin
              listOfPermissions={auth.permissions}
              isOwner={true}
              trainees={getFilteredMembers()}
              internalProjects={getFilteredInternalProjects()}
              generation={Traineegeneration}
              generationFilter={numbervalue}
            />
          </div>
        </div>
      ) : (
        <div>
          <TraineeSectionMember
            listOfPermissions={auth.permissions}
            isOwner={false}
            trainees={getFilteredMembers()}
            internalProjects={getFilteredInternalProjects()}
            generation={dummydata}
          />
        </div>
      )}
      <PageBar pageTitle="Traineebereich" />
    </>
  );
};

export default TraineeSection;
