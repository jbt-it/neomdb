import { Member } from "../../entities/Member";
import {
  TraineeChoiceDto,
  TraineeMotivationDto,
  TraineeProgressDto,
  MandatoryWorkshopFeedback,
} from "../../types/traineeTypes";
import { MentorDto } from "../../types/memberTypes";
import { InternalProject } from "../../entities/InternalProject";

export class TraineeMapper {
  // --- To DTO mapper functions

  static traineeToTraineeChoiceDto(member: Member): TraineeChoiceDto {
    return {
      memberId: member.memberId,
      firstname: member.firstname,
      lastname: member.lastname,
      mentorChoice: member.mentor?.memberId ?? null,
      mentorChoiceName: member.mentor?.name ?? null,
      mentorChoice1: member.mentorChoice1?.memberId ?? null,
      mentorChoice1Name: member.mentorChoice1?.name ?? null,
      mentorChoice2: member.mentorChoice2?.memberId ?? null,
      mentorChoice2Name: member.mentorChoice2?.name ?? null,
      mentorChoice3: member.mentorChoice3?.memberId ?? null,
      mentorChoice3Name: member.mentorChoice3?.name ?? null,
      internalProjectChoice: member.internalProject?.internalProjectId ?? null,
      internalProjectChoiceShortName: member.internalProject?.projectName ?? null,
      internalProjectChoice1: member.internalProjectChoice1?.internalProjectId ?? null,
      internalProjectChoice1ShortName: member.internalProjectChoice1?.projectName ?? null,
      internalProjectChoice1Motivation: member.choiceInternalProject1Motivation ?? null,
      internalProjectChoice2: member.internalProjectChoice2?.internalProjectId ?? null,
      internalProjectChoice2ShortName: member.internalProjectChoice2?.projectName ?? null,
      internalProjectChoice2Motivation: member.choiceInternalProject2Motivation ?? null,
      internalProjectChoice3: member.internalProjectChoice3?.internalProjectId ?? null,
      internalProjectChoice3ShortName: member.internalProjectChoice3?.projectName ?? null,
      internalProjectChoice3Motivation: member.choiceInternalProject3Motivation ?? null,
      departmentChoice: member.department?.departmentId ?? null,
      departmentChoiceShortName: member.department?.shortName ?? null,
      departmentChoice1: member.departmentChoice1?.departmentId ?? null,
      departmentChoice1ShortName: member.departmentChoice1?.shortName ?? null,
      departmentChoice2: member.departmentChoice2?.departmentId ?? null,
      departmentChoice2ShortName: member.departmentChoice2?.shortName ?? null,
      departmentChoice3: member.departmentChoice3?.departmentId ?? null,
      departmentChoice3ShortName: member.departmentChoice3?.shortName ?? null,
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
      firstname: member.firstname,
      lastname: member.lastname,
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
      firstname: member.firstname,
      lastname: member.lastname,
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
