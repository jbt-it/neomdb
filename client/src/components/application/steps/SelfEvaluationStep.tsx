import React from "react";
import { Box, FormControl, FormHelperText, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { useApplicationContext } from "../../../context/ApplicationContext";
import { Application, ApplicationError } from "../../../types/applicationTypes";
import useResponsive from "../../../hooks/useResponsive";

// the type for the self-assessment question
type SelfAssessmentQuestion = {
  label1: string;
  label2: string;
};

// the questions for the self-assessment
const selfAssessmentQuestions: { [key: string]: SelfAssessmentQuestion } = {
  question1: {
    label1: "Ich mache gerne mit voller Aufmerksamkeit eine Aufgabe nach der anderen.",
    label2: "Ich arbeite gerne an mehreren Aufgaben gleichzeitig.",
  },
  question2: {
    label1: "Ich bin ein direkter Typ.",
    label2: "Ich bin ein diplomatischer Typ.",
  },
  question3: {
    label1: "In einem Arbeitsteam ist mir der Zusammenhalt besonders wichtig.",
    label2: "In einem Arbeitsteam sind mir Ergebnisse besonders wichtig.",
  },
  question4: {
    label1: "Mir ist wichtig, dass Entscheidungen schnell und zielgerichtet gefällt werden.",
    label2: "Mir ist wichtig, dass alle Beteiligten bei einer Entscheidungsfindung ihre Meinung äußern.",
  },
  question5: {
    label1: "Ich überzeuge bei einer Präsentation mit Charisma.",
    label2: "Ich überzeuge bei einer Präsentation mit Fachwissen.",
  },
  question6: {
    label1: "Ich wende gerne bewährte Lösungswege an, um möglichst schnell gute Ergebnisse zu erzielen.",
    label2: "Ich entwickle und probiere gerne neue Lösungswege.",
  },
  question7: {
    label1: "Ich interessiere mich für Wissen aus einem Spezialgebiet.",
    label2: "Ich interessiere mich für Wissen aus verschiedenen Fächern.",
  },
  question8: {
    label1: "Im JBT möchte ich in Projekten Praxiserfahrungen sammeln.",
    label2: "Im JBT möchte ich mich mit anderen Studenten im Verein engagieren.",
  },
};

/**
 * The self-evaluation step of the application form
 * @returns the self-evaluation step of the application form
 */
const SelfEvaluationStep = () => {
  const isMobile = useResponsive("down", "sm");
  const { applicationState, applicationErrorState, updateApplicationState } = useApplicationContext();

  const handleRadioChange = (questionKey: string, value: string) => {
    const questionNumber = questionKey.replace("question", "");
    const key = `selfAssessment${questionNumber}` as keyof Application;
    updateApplicationState(key, Number(value));
  };

  return (
    <Box width={"100%"}>
      <Typography fontWeight="bold" fontSize={20} sx={{ mb: 2 }}>
        Wie siehst du dich?
      </Typography>
      <Grid container rowGap={isMobile ? 6 : 4}>
        {Object.keys(selfAssessmentQuestions).map((key) => {
          const errorKey = `selfAssessment${key.replace("question", "")}` as keyof ApplicationError;
          const errorValue = applicationErrorState[errorKey];
          const isError = Array.isArray(errorValue) ? errorValue.length > 0 : !!errorValue;
          return (
            <Grid container key={key} alignItems={"center"}>
              <Grid item xs={12} sm={4} display="flex" justifyContent="flex-start">
                <Typography
                  width={isMobile ? "50%" : "100%"}
                  textAlign={isMobile ? "left" : "right"}
                  fontSize={isMobile ? 14 : 16}
                >
                  {selfAssessmentQuestions[key].label1}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} justifyContent={"space-evenly"}>
                <FormControl error={isError}>
                  <RadioGroup
                    row
                    sx={{ justifyContent: "space-between", padding: 2 }}
                    value={applicationState[`selfAssessment${key.replace("question", "")}` as keyof Application] || ""}
                    onChange={(e) => handleRadioChange(key, (e.target as HTMLInputElement).value)}
                  >
                    {[...Array(7)].map((_, i) => (
                      <Box key={i} flexGrow={1}>
                        <Radio value={i + 1} sx={{ p: 0 }} />
                      </Box>
                    ))}
                  </RadioGroup>
                  <FormHelperText>{isError && "Bitte wähle eine Option aus."}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
                <Typography
                  width={isMobile ? "50%" : "100%"}
                  textAlign={isMobile ? "right" : "left"}
                  fontSize={isMobile ? 14 : 16}
                >
                  {selfAssessmentQuestions[key].label2}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SelfEvaluationStep;
