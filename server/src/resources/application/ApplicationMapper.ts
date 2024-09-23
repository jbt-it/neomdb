import { TraineeApplicant } from "entities/TraineeApplicant";
import { EvaluationDto } from "types/applicationTypes";

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
}
