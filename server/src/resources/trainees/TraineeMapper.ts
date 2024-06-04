import { Member } from "../../typeOrm/entities/Member";
import {
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
  MandatoryWorkshopFeedback,
} from "../../typeOrm/types/traineeTypes";
import { MentorDto } from "../../typeOrm/types/memberTypes";
import { InternalProject } from "../../typeOrm/entities/InternalProject";

export class TraineeMapper {
  // --- To DTO mapper functions

  static memberToTraineeChoiceDto(member: Member): TraineeChoiceDto {
    return {
      memberID: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
      choice_mentor: member.choiceMentor,
      choice_mentor1: member.choiceMentor1,
      choice_mentor2: member.choiceMentor2,
      choice_mentor3: member.choiceMentor3,
      choice_internalProject: member.choiceInternalProject,
      choice_internalProject1: member.choiceInternalProject1,
      choice_internalProject2: member.choiceInternalProject2,
      choice_internalProject3: member.choiceInternalProject3,
      choice_department: member.choiceDepartment,
      choice_department1: member.choiceDepartment1,
      choice_department2: member.choiceDepartment2,
      choice_department3: member.choiceDepartment3,
    };
  }

  static traineeToMotivationDto(member: Member): TraineeMotivationDto {
    return {
      memberID: member.memberId,
      internalProject1Motivation: member.choiceInternalProject1Motivation,
      internalProject2Motivation: member.choiceInternalProject2Motivation,
      internalProject3Motivation: member.choiceInternalProject3Motivation,
    };
  }

  static memberToMentorDto(member: Member): MentorDto {
    return {
      memberId: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
    };
  }

  static traineeToTraineeProgressDto(
    member: Member,
    generationId: number,
    ip?: InternalProject,
    feedback?: MandatoryWorkshopFeedback[]
  ): TraineeProgressDto {
    return {
      memberID: member.memberId,
      firstname: member.firstName,
      lastname: member.lastName,
      memberStatus: {
        memberStatusId: member.memberStatusId,
        name: member.memberStatus.name,
      },
      generationID: generationId,
      internalProjectID: ip?.internalProjectId ?? null,
      projectName: ip?.projectName ?? "",
      abbreviation: ip?.abbreviation ?? "",
      offerAtEv: ip?.offerAtEv ?? false,
      zpAtEv: ip?.zpAtEv ?? false,
      zpHeld: ip?.zpHeld ?? null,
      apAtEv: ip?.apAtEv ?? false,
      apHeld: ip?.apHeld ?? null,
      dlAtEv: ip?.dlAtEv ?? false,
      // For every mandatory workshop, check if feedback was given
      projectManagement: feedback.find((f) => f.workshopId === 8300)?.feedbackGiven ?? false,
      rhetoricPresentationTechnique: feedback.find((f) => f.workshopId === 8301)?.feedbackGiven ?? false,
      acquisitionNegotiationTechnique: feedback.find((f) => f.workshopId === 8302)?.feedbackGiven ?? false,
      excelBasics: feedback.find((f) => f.workshopId === 8303)?.feedbackGiven ?? false,
      departmentNetwork: feedback.find((f) => f.workshopId === 8305)?.feedbackGiven ?? false,
      departmentFinanceAndLaw: feedback.find((f) => f.workshopId === 8308)?.feedbackGiven ?? false,
      departmentQualityManagement: feedback.find((f) => f.workshopId === 8309)?.feedbackGiven ?? false,
      msPowerpoint: feedback.find((f) => f.workshopId === 8310)?.feedbackGiven ?? false,
      strategyAndOrganisation: feedback.find((f) => f.workshopId === 8311)?.feedbackGiven ?? false,
      dataPrivacyTraining: feedback.find((f) => f.workshopId === 8312)?.feedbackGiven ?? false,
      safetyTraining: feedback.find((f) => f.workshopId === 8313)?.feedbackGiven ?? false,
    };
  }
}
