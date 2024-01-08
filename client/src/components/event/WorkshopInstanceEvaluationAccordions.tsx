import React from "react";
import { Frage, ReferentenBewertung } from "../../types/eventTypes";
import dayjs from "dayjs";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import useResponsive from "../../hooks/useResponsive";

interface WorkshopInstanceEvaluationAccordionsProps {
  workshopInstanceFeedbackFragen: Frage[];
  workshopInstanceFeedbackReferenten: ReferentenBewertung[];
}

/**
 * This component is responsible for rendering the accordions for the workshop instance evaluation page.
 * All questions and referents are displayed with the respective grades
 * @param workshopInstanceFeedbackFragen the questions of the workshop instance feedback
 * @param workshopInstanceFeedbackReferenten the referents of the workshop instance feedback
 * @returns the accordions for the workshop instance evaluation page
 */
const WorkshopInstanceEvaluationAccordions: React.FunctionComponent<WorkshopInstanceEvaluationAccordionsProps> = ({
  workshopInstanceFeedbackFragen,
  workshopInstanceFeedbackReferenten,
}: WorkshopInstanceEvaluationAccordionsProps) => {
  const isMobile = useResponsive("down", "sm");

  return workshopInstanceFeedbackFragen ? (
    <>
      <Box>
        <Typography fontWeight={"bold"} fontSize={18} sx={{ mb: 1 }}>
          Fragen:
        </Typography>
        {workshopInstanceFeedbackFragen.map((question, index) => {
          return (
            <Accordion disableGutters key={`Frage-${index}`}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack spacing={isMobile ? 8 : 3} direction={"row"}>
                  <Box sx={{ display: "flex" }}>
                    <Typography fontWeight={"bold"}>Frage {index + 1}: &nbsp;</Typography>
                    {isMobile ? null : <Typography>{question.frageText}</Typography>}
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Typography color={"primary.main"} fontWeight={"bold"}>
                      Ø
                    </Typography>
                    <Typography color={"primary.main"} fontWeight={"bold"}>
                      &nbsp;{question.durchschnitt}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Divider />
                {isMobile ? <Typography>{question.frageText}</Typography> : null}
                <TableContainer sx={{ maxWidth: 350, margin: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Datum</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Bewertung
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {question.bewertungen.map((bewertung) => (
                        <TableRow>
                          <TableCell>{dayjs(bewertung.schulungsfeedback_datum).format("DD.MM.YYYY")}</TableCell>
                          <TableCell align="right">{bewertung.note === 0 ? "-" : bewertung.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      {workshopInstanceFeedbackReferenten.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography fontWeight={"bold"} fontSize={18} sx={{ mb: 1 }}>
            Referenten:
          </Typography>
          {workshopInstanceFeedbackReferenten.map((referent, index) => {
            return (
              <Accordion disableGutters key={`Referent-${index}`}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack spacing={isMobile ? 8 : 3} direction={"row"}>
                    <Typography fontWeight={"bold"}>
                      {referent.vorname} {referent.nachname}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography color={"primary.main"} fontWeight={"bold"}>
                        Ø
                      </Typography>
                      <Typography color={"primary.main"} fontWeight={"bold"}>
                        &nbsp;{referent.durchschnitt}
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider />
                  <TableContainer sx={{ maxWidth: 350, margin: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Datum</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Bewertung
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {referent.bewertungen.map((bewertung) => (
                          <TableRow>
                            <TableCell>{dayjs(bewertung.schulungsfeedback_datum).format("DD.MM.YYYY")}</TableCell>
                            <TableCell align="right">{bewertung.note === 0 ? "-" : bewertung.note}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ) : null}
    </>
  ) : null;
};

export default WorkshopInstanceEvaluationAccordions;
