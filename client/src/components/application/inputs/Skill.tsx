import { RemoveCircle } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { Skill as SkillType } from "../../../types/applicationTypes";

// The different levels of language skills
const languageSkillLevels = [
  {
    level: 4,
    label: "Muttersprache",
  },
  { level: 3, label: "Verhandlungssicher" },
  { level: 2, label: "Fließend" },
  { level: 2, label: "Gute Kenntnisse" },
  { level: 1, label: "Grundkenntnisse" },
];

// The different levels of IT skills
const itSkillLevels = [
  { level: 1, label: "Grundkenntnisse" },
  { level: 2, label: "Fortgeschrittene Kenntnisse" },
  { level: 3, label: "Vertiefte Fachkenntnisse" },
];

/**
 * The interface for the skill component
 */
interface SkillProps {
  type: "language" | "it";
  skill: SkillType;
  onNameChange: (type: string, skillid: number, name: string) => void;
  onLevelChange: (type: string, skillid: number, level: number) => void;
  removeSkill: (skillType: string, skillId: number) => void;
}

/**
 * The skill component
 * @param type The type of the skill
 * @param skill The skill
 * @param onNameChange The function to change the name of the skill
 * @param onLevelChange The function to change the level of the skill
 * @param removeSkill The function to remove the skill
 * @returns The skill component with the input fields for the name and the level of the skill and a remove button
 */
const Skill = ({ type, skill, onNameChange, onLevelChange, removeSkill }: SkillProps) => {
  const isMobile = useResponsive("down", "sm");

  // Change the name of the skill
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(type, skill.id, event.target.value);
  };

  // Change the level of the skill
  const changeLevel = (event: SelectChangeEvent<number>) => {
    onLevelChange(type, skill.id, event.target.value as number);
  };

  return (
    <Stack>
      <Typography fontWeight={"bold"} flex={1} width={"100%"} color={"#7d7d7d"}>
        <label>{type === "language" ? "Sprache" : "IT Kenntnis"}</label>
      </Typography>
      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 1 : 3}>
        <Stack direction={"row"} sx={{ flex: 3 }} spacing={isMobile ? 2 : 0}>
          <TextField variant="outlined" size="small" value={skill.name} onChange={changeName} fullWidth />
          {isMobile ? (
            <IconButton
              onClick={() => {
                removeSkill(type, skill.id);
              }}
            >
              <RemoveCircle fontSize="medium" color="error" />
            </IconButton>
          ) : null}
        </Stack>
        <FormControl sx={{ flex: 2 }}>
          <InputLabel id="level">{type === "language" ? "Sprachniveau" : "Kenntnisstand"}</InputLabel>
          <Select
            size="small"
            value={skill.level}
            onChange={changeLevel}
            label={type === "language" ? "Sprachniveau" : "Kenntnisstand"}
            renderValue={(selected) => {
              const selectedSkill = (type === "language" ? languageSkillLevels : itSkillLevels).find(
                (skill) => skill.level === selected
              );
              return selectedSkill ? selectedSkill.label : "";
            }}
          >
            {type === "language"
              ? languageSkillLevels.map((skill) => (
                  <MenuItem key={skill.label} value={skill.level}>
                    {skill.label}
                  </MenuItem>
                ))
              : itSkillLevels.map((skill) => (
                  <MenuItem key={skill.label} value={skill.level}>
                    {skill.label}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        {isMobile ? null : (
          <IconButton
            onClick={() => {
              removeSkill(type, skill.id);
            }}
          >
            <RemoveCircle fontSize="small" color="error" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default Skill;
