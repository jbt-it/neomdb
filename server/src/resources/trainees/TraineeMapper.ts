import { Member } from "../../typeOrm/entities/Member";
import { TraineeChoiceDto } from "../../typeOrm/types/traineeTypes";

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
}
