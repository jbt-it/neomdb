import React from "react";
import { AddCircle } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useApplicationContext } from "../../../context/ApplicationContext";
import Skill from "../inputs/Skill";

/**
 * The languages step of the application form to enter the language and IT skills
 * @returns The languages step of the application form
 */
const LanguagesStep = () => {
  const { applicationState, applicationErrorState, addSkill, updateSkill, removeSkill } = useApplicationContext();

  /**
   * Change the name of the skill with the given id and type
   * @param type - The type of the skill
   * @param skillId - The id of the skill
   * @param name - The new name of the skill
   */
  const changeSkillName = (type: string, skillId: number, name: string) => {
    updateSkill(type, skillId, "name", name);
  };

  /**
   * Change the level of the skill with the given id and type
   * @param type - The type of the skill
   * @param skillId - The id of the skill
   * @param level - The new level of the skill
   */
  const changeSkillLevel = (type: string, skillId: number, level: number) => {
    updateSkill(type, skillId, "level", level);
  };

  return (
    <Stack width={"100%"} spacing={6}>
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography variant="h6" fontWeight={"bold"} fontSize={20}>
            Sprachkenntnisse
          </Typography>
          <IconButton
            onClick={() => {
              addSkill("language");
            }}
          >
            <AddCircle color="success" />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {applicationState.languages.map((skill) => (
            <Skill
              key={skill.id}
              type={"language"}
              skill={skill}
              errorName={applicationErrorState.languages.find((error) => error.id === skill.id)?.name || false}
              errorLevel={applicationErrorState.languages.find((error) => error.id === skill.id)?.level || false}
              onNameChange={changeSkillName}
              onLevelChange={changeSkillLevel}
              removeSkill={removeSkill}
            />
          ))}
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography variant="h6" fontWeight={"bold"} fontSize={20}>
            IT Kenntnisse
          </Typography>
          <IconButton
            onClick={() => {
              addSkill("it");
            }}
          >
            <AddCircle color="success" />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {applicationState.itSkills.map((skill) => (
            <Skill
              key={skill.id}
              type={"it"}
              skill={skill}
              errorName={applicationErrorState.itSkills.find((error) => error.id === skill.id)?.name || false}
              errorLevel={applicationErrorState.itSkills.find((error) => error.id === skill.id)?.level || false}
              onNameChange={changeSkillName}
              onLevelChange={changeSkillLevel}
              removeSkill={removeSkill}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LanguagesStep;
