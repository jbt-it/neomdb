import { Generation } from "entities/Generation";
import { TraineeApplicant } from "entities/TraineeApplicant";
import { TraineeApplicantEvaluation } from "entities/TraineeApplicantEvaluation";
import { TraineeEvaluationDto, GenerationDto, EvaluationDto } from "types/applicationTypes";

export class ApplicationMapper {
  // --- To DTO mapper functions
  static traineeApplicantEvaluationToEvaluationDto(
    traineeApplicantEvaluation: TraineeApplicantEvaluation
  ): EvaluationDto {
    return {
      traineeApplicantId: traineeApplicantEvaluation.traineeApplicantId,
      memberId: traineeApplicantEvaluation.memberId,
      evaluation: traineeApplicantEvaluation.evaluation,
    };
  }

  static traineeApplicantToEvaluationDto(traineeApplicant: TraineeApplicant): TraineeEvaluationDto {
    return {
      traineeApplicantId: traineeApplicant.traineeApplicantId,
      firstName: traineeApplicant.firstName,
      lastName: traineeApplicant.lastName,
      availabilitySelectionWeekend: traineeApplicant.availabilitySelectionWeekend,
      workingWeekend: traineeApplicant.workingWeekend,
      evaluations:
        traineeApplicant.traineeApplicantEvaluations.length > 0
          ? traineeApplicant.traineeApplicantEvaluations.map((evaluation) =>
              ApplicationMapper.traineeApplicantEvaluationToEvaluationDto(evaluation)
            )
          : [],
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
