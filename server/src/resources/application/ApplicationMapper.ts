import { Generation } from "entities/Generation";
import { TraineeApplicant } from "entities/TraineeApplicant";
import { EvaluationDto, GenerationDto } from "types/applicationTypes";

export class ApplicationMapper {
  // --- To DTO mapper functions
  static traineeApplicantToEvaluationDto(traineeApplicant: TraineeApplicant): EvaluationDto {
    return {
      traineeApplicantId: traineeApplicant.traineeApplicantId,
      firstName: traineeApplicant.firstName,
      lastName: traineeApplicant.lastName,
      availabilitySelectionWeekend: traineeApplicant.availabilitySelectionWeekend,
      workingWeekend: traineeApplicant.workingWeekend,
      evaluation: traineeApplicant.traineeApplicantEvaluations[0].evaluation,
    };
  }

  static generationToGenerationDto(generation: Generation): GenerationDto {
    return {
      generationId: generation.generationId,
      description: generation.description,
      applicationStart: generation.applicationStart,
      applicationEnd: generation.applicationEnd,
      selectionWeDateStart: generation.selectionWeDateStart,
      selectionWeDateEnd: generation.selectionWeDateEnd,
      wwDateStart: generation.wwDateStart,
      wwDateEnd: generation.wwDateEnd,
      infoEveningVisitors: generation.infoEveningVisitors,
      doorCode: generation.doorCode,
      electionStart: generation.electionStart,
      electionEnd: generation.electionEnd,
    };
  }
}
