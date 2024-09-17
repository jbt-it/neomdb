import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { useApplicationContext } from "../../../context/ApplicationContext";
import { ApplicationPracticalExperience } from "../../../types/applicationTypes";
import Job from "../inputs/Job";

/**
 * The work experience step of the application form
 * @returns The work experience step
 */
const WorkExperienceStep = () => {
  const isMobile = useResponsive("down", "sm");
  const {
    applicationState,
    updateApplicationState,
    applicationErrorState,
    updateApplicationErrorState,
    resetOccupation,
    addPracticalExperienceJob,
    removePracticalExperienceJob,
    updatePracticalExperience,
    updatePracticalExperienceError,
  } = useApplicationContext();

  // Closes the apprenticeship section
  const handleOccupationClose = () => {
    resetOccupation();
  };

  // Opens the apprenticeship section
  const handleOccupationOpen = () => {
    updateApplicationState("hasOccupation", true);
  };

  /**
   * Handles the update of the state for the application or a practical experience job
   * @param arg1 - The attribute name or type of the practical experience job
   * @param arg2 - The attribute value or job object of the practical experience job
   */
  const handleUpdateState = (arg1: string, arg2: string | Date | ApplicationPracticalExperience | undefined) => {
    if (typeof arg2 === "object" && arg2 !== null && "id" in arg2) {
      // Call updatePracticalExperience with (type: string, updatedJob: ApplicationPracticalExperience)
      updatePracticalExperience(arg1, arg2 as ApplicationPracticalExperience);
    } else {
      // Call updateApplicationState with (attributeName: string, attributeValue: any)
      updateApplicationState(arg1, arg2);
    }
  };

  /**
   * Handles the update of the error state for the application or a practical experience job
   * @param arg1 - The attribute name or type of the practical experience job
   * @param arg2 - The attribute value or job id of the practical experience job
   * @param errorName - The name of the error attribute
   * @param errorValue - The value of the error attribute
   */
  const handleUpdateErrorState = (arg1: string, arg2: boolean | number, errorName?: string, errorValue?: boolean) => {
    if (typeof arg2 === "boolean") {
      // Call updateApplicationErrorState with (attributeName: string, attributeValue: boolean)
      updateApplicationErrorState(arg1, arg2);
    } else {
      // Call updatePracticalExperienceError with (type: string, jobId: number, errorName: string, errorValue: boolean)
      updatePracticalExperienceError(arg1, arg2 as number, errorName as string, errorValue as boolean);
    }
  };

  /**
   * Handles the addition of a voluntary activity
   * @param type - The type of voluntary activity
   */
  const handleAddVoluntaryActivity = (type: "voluntaryStudy" | "voluntarySchool") => {
    updateApplicationState(type, [...applicationState[type], ""]);
  };

  /**
   * Handles the removal of a voluntary activity
   * @param type - The type of voluntary activity
   * @param index - The index of the voluntary activity to remove
   */
  const handleRemoveVoluntaryActivity = (type: "voluntaryStudy" | "voluntarySchool", index: number) => {
    const newVoluntaryActivities = [...applicationState[type]];
    newVoluntaryActivities.splice(index, 1);
    updateApplicationState(type, newVoluntaryActivities);
  };

  /**
   * Handles the change of a voluntary activity
   * @param type - The type of voluntary activity
   * @param index - The index of the voluntary activity to change
   * @param value - The new value of the voluntary activity
   */
  const onChangeVoluntaryActivity = (type: "voluntaryStudy" | "voluntarySchool", index: number, value: string) => {
    const newVoluntaryActivities = [...applicationState[type]];
    newVoluntaryActivities[index] = value;
    updateApplicationState(type, newVoluntaryActivities);
  };

  return (
    <Stack spacing={6} width={"100%"}>
      <Stack>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={20}>
            Berufliche Tätigkeit
          </Typography>
          <IconButton
            onClick={applicationState.hasOccupation ? handleOccupationClose : handleOccupationOpen}
            color={applicationState.hasOccupation ? "error" : "success"}
          >
            {applicationState.hasOccupation ? <RemoveCircle /> : <AddCircle />}
          </IconButton>
        </Stack>
        {applicationState.hasOccupation ? (
          <Job
            type={"occupation"}
            activity={applicationState.occupation || ""}
            company={applicationState.occupationCompany || ""}
            location={applicationState.occupationLocation || ""}
            start={applicationState.occupationStart || undefined}
            end={applicationState.occupationEnd || undefined}
            updateState={updateApplicationState}
            updateErrorState={handleUpdateErrorState}
            startError={applicationErrorState.occupationStart}
            endError={applicationErrorState.occupationEnd}
          />
        ) : null}
      </Stack>
      <Stack>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={20}>
            Praktika
          </Typography>
          <IconButton
            onClick={() => {
              addPracticalExperienceJob("internship");
            }}
            color={"success"}
          >
            {<AddCircle />}
          </IconButton>
        </Stack>
        <Stack spacing={4}>
          {applicationState.internship.map((job) => {
            return (
              <Job
                type={"internship"}
                activity={job.activity || ""}
                company={job.company || ""}
                location={job.location || ""}
                start={job.start || undefined}
                end={job.end || undefined}
                updateState={handleUpdateState}
                updateErrorState={handleUpdateErrorState}
                startError={applicationErrorState.internship.find((e) => e.id === job.id)?.start || false}
                endError={applicationErrorState.internship.find((e) => e.id === job.id)?.end || false}
                removePracticalExperienceJob={removePracticalExperienceJob}
                job={job}
              />
            );
          })}
        </Stack>
      </Stack>
      <Stack>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontWeight="bold" fontSize={20}>
            Hiwi- / Werkstudententätigkeit / Nebenjob
          </Typography>
          <IconButton
            onClick={() => {
              addPracticalExperienceJob("hiwiStudentJob");
            }}
            color={"success"}
          >
            {<AddCircle />}
          </IconButton>
        </Stack>
        <Stack spacing={2}>
          {applicationState.hiwiStudentJob.map((job) => {
            return (
              <Job
                type={"hiwiStudentJob"}
                activity={job.activity || ""}
                company={job.company || ""}
                location={job.location || ""}
                start={job.start || undefined}
                end={job.end || undefined}
                updateState={handleUpdateState}
                updateErrorState={handleUpdateErrorState}
                startError={applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.start || false}
                endError={applicationErrorState.hiwiStudentJob.find((e) => e.id === job.id)?.end || false}
                removePracticalExperienceJob={removePracticalExperienceJob}
                job={job}
              />
            );
          })}
        </Stack>
      </Stack>
      <Stack spacing={1} marginBottom={applicationState.voluntarySchool.length > 0 ? 6 : 0}>
        <Stack spacing={isMobile ? 0 : -1}>
          <Stack direction={"row"} spacing={3} alignItems={"center"}>
            <Typography fontWeight="bold" fontSize={20}>
              Ehrenamtliche Tätigkeit / Engagement in der Schulzeit
            </Typography>
            <IconButton
              onClick={() => {
                handleAddVoluntaryActivity("voluntarySchool");
              }}
              color={"success"}
            >
              <AddCircle />
            </IconButton>
          </Stack>
          <Typography variant="caption">z.B. Klassensprecher, Schulsprecher, SMV, AG, Verein, ...</Typography>
        </Stack>
        <Stack spacing={1}>
          {applicationState.voluntarySchool.length > 0
            ? applicationState.voluntarySchool.map((extracurricular, index) => {
                return (
                  <Stack direction={"row"} spacing={1}>
                    <TextField
                      value={extracurricular}
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChangeVoluntaryActivity("voluntarySchool", index, e.target.value);
                      }}
                      label="Tätigkeit"
                    />
                    <IconButton
                      onClick={() => {
                        handleRemoveVoluntaryActivity("voluntarySchool", index);
                      }}
                      color={"error"}
                    >
                      {<RemoveCircle />}
                    </IconButton>
                  </Stack>
                );
              })
            : null}
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Stack spacing={isMobile ? 0 : -1}>
          <Stack direction={"row"} spacing={3} alignItems={"center"}>
            <Typography fontWeight="bold" fontSize={20}>
              Ehrenamtliche Tätigkeit / Engagement im Studium
            </Typography>
            <IconButton
              onClick={() => {
                handleAddVoluntaryActivity("voluntaryStudy");
              }}
              color={"success"}
            >
              <AddCircle />
            </IconButton>
          </Stack>
          <Typography variant="caption">z.B. Fachschaft, studentische Initiativen, Verein, ...</Typography>
        </Stack>
        <Stack spacing={1}>
          {applicationState.voluntaryStudy.length > 0
            ? applicationState.voluntaryStudy.map((extracurricular, index) => {
                return (
                  <Stack direction={"row"} spacing={1}>
                    <TextField
                      value={extracurricular}
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChangeVoluntaryActivity("voluntaryStudy", index, e.target.value);
                      }}
                      label="Tätigkeit"
                    />
                    <IconButton
                      onClick={() => {
                        handleRemoveVoluntaryActivity("voluntaryStudy", index);
                      }}
                      color={"error"}
                    >
                      {<RemoveCircle />}
                    </IconButton>
                  </Stack>
                );
              })
            : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WorkExperienceStep;
