import { List, ListItem, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import useResponsive from "../../../hooks/useResponsive";
import { ProjectApplicationDto } from "../../../types/projectTypes";
import { ExpertiseOfMemberDto, InternshipOfMemberDto, ItSkillOfMember } from "../../../types/membersTypes";

/**
 * Props for the work experience step of the project application form
 */
interface WorkExperienceStepProps {
  applicationData: ProjectApplicationDto;
  setApplicationData: React.Dispatch<React.SetStateAction<ProjectApplicationDto>>;
  itSkillsSuggestions: ItSkillOfMember[];
  expertiseSuggestions: ExpertiseOfMemberDto[];
  internshipSuggestions: InternshipOfMemberDto[];
}

/**
 * Theoretical knowledge step of the project application form
 * @returns the respective theoretical knowledge step of the project application form
 */
const WorkExperienceStep = ({
  applicationData,
  setApplicationData,
  itSkillsSuggestions,
  expertiseSuggestions,
  internshipSuggestions,
}: WorkExperienceStepProps) => {
  const isMobile = useResponsive("down", "sm");

  // Function to handle changes in the internship field
  const onChangeInternship = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApplicationData({ ...applicationData, internship: event.target.value });
  };

  // Function to handle changes in the apprenticeship field
  const onChangeApprenticeship = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApplicationData({ ...applicationData, apprenticeship: event.target.value });
  };

  // Function to handle changes in the student job field
  const onChangeStudentJob = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApplicationData({ ...applicationData, studentJob: event.target.value });
  };

  /**
   * Returns the string representation of the niveau number of an it skill
   * @param niveau A number which represents the niveau of an it skill
   * @returns A string representation of the niveau
   */
  const getEDVNiveauLabel = (niveau: number) => {
    switch (niveau) {
      case 1: {
        return "Grundkenntnisse";
      }
      case 2: {
        return "Vertiefte Kenntnisse";
      }
      case 3: {
        return "Expertenwissen";
      }
    }
  };

  return (
    <Stack direction={isMobile ? "column" : "row"} spacing={5} flex={1}>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Praktika:</Typography>
          <TextField
            variant="outlined"
            size="small"
            multiline
            minRows={3}
            value={applicationData.internship}
            onChange={onChangeInternship}
          />
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Ausbildung:</Typography>
          <TextField
            variant="outlined"
            size="small"
            multiline
            minRows={3}
            value={applicationData.apprenticeship}
            onChange={onChangeApprenticeship}
          />
        </Stack>
        <Stack direction={"column"} justifyContent={"space-between"} alignItems={"left"} flex={1}>
          <Typography fontWeight={"bold"}>Werkstudententätigkeit:</Typography>
          <TextField
            variant="outlined"
            size="small"
            multiline
            minRows={3}
            value={applicationData.studentJob}
            onChange={onChangeStudentJob}
          />
        </Stack>
      </Stack>
      <Stack direction={"column"} spacing={3} flex={1}>
        <Typography fontWeight={"bold"}>Vorschläge (werden nicht übermittelt):</Typography>
        <Stack direction={"column"} spacing={0}>
          <Typography fontWeight={"bold"}>IT Kenntnisse</Typography>
          <List sx={{ listStyleType: "square", pl: 2 }} disablePadding dense>
            {itSkillsSuggestions.map((itSkill, index) => (
              <ListItem key={index} sx={{ display: "list-item" }} disablePadding>
                <Typography fontSize={14}>
                  <strong>{itSkill.value}</strong> - {getEDVNiveauLabel(itSkill.level)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack direction={"column"} spacing={0}>
          <Typography fontWeight={"bold"}>Praktika</Typography>
          <List sx={{ listStyleType: "square", pl: 2 }} disablePadding dense>
            {internshipSuggestions.map((internship, index) => (
              <ListItem key={index} sx={{ display: "list-item" }} disablePadding>
                <Typography fontSize={14}>
                  <strong>{internship.company}</strong> - {internship.description}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack direction={"column"} spacing={0}>
          <Typography fontWeight={"bold"}>Expertenwissen</Typography>
          <List sx={{ listStyleType: "square", pl: 2 }} disablePadding dense>
            {expertiseSuggestions.map((expertise, index) => (
              <ListItem key={index} sx={{ display: "list-item" }} disablePadding>
                <Typography fontSize={14}>
                  <strong>{expertise.designation}</strong> - {expertise.value}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WorkExperienceStep;
