import { UpdateResult } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Department } from "../../entities/Department";
import { Member } from "../../entities/Member";
import { MemberHasWorkshopInstance } from "../../entities/MemberHasWorkshopInstance";
import { MandatoryWorkshopFeedback } from "../../types/traineeTypes";
import { TraineeChoiceDto } from "types/traineeTypes";

export const TraineeRepository = AppDataSource.getRepository(Member).extend({
  /**
   * Retrieves trainees by internal project id
   * @param internalProjectId The id of the internal project
   * @returns The trainees of the internal project
   */
  getInternalProjectMembersByID(internalProjectId: number): Promise<Member[] | null> {
    return this.find({ where: { internalProjectId: internalProjectId } });
  },

  /**
   * Retrieves all current trainees
   * @returns The trainees
   */
  getTrainees(): Promise<Member[]> {
    return this.find({ where: { memberStatusId: 1 } });
  },

  /**
   * Assigns a mentor, internal project and department to a trainee
   * @param memberId The id of the member
   * @param ipId The id of the internal project
   * @param mentor The mentor
   * @param department The department
   * @returns A promise that resolves when the update is done
   */
  updateAssignmentByMemberID(
    memberId: number,
    ipId: number,
    mentor: Member,
    department: Department
  ): Promise<UpdateResult> {
    return this.update(memberId, {
      internalProjectId: ipId,
      mentor: mentor,
      departmentId: department,
    });
  },

  /**
   * Get all choices of trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */
  getTraineePreferencesByMemberID(memberID: number): Promise<Member> {
    return this.findOne({
      where: { memberId: memberID },
      relations: [
        "departmentChoice",
        "departmentChoice1",
        "departmentChoice2",
        "departmentChoice3",
        "internalProjectChoice",
        "internalProjectChoice1",
        "internalProjectChoice2",
        "internalProjectChoice3",
        "mentorChoice",
        "mentorChoice1",
        "mentorChoice2",
        "mentorChoice3",
      ],
    });
  },

  setTraineePreferencesByMemberID(memberId: number, preferences: TraineeChoiceDto): Promise<void> {
    return this.update(memberId, {
      departmentChoice: preferences.departmentChoice,
      departmentChoice1: preferences.departmentChoice1,
      departmentChoice2: preferences.departmentChoice2,
      departmentChoice3: preferences.departmentChoice3,
      mentorChoice: preferences.mentorChoice,
      mentorChoice1: preferences.mentorChoice1,
      mentorChoice2: preferences.mentorChoice2,
      mentorChoice3: preferences.mentorChoice3,
      internalProjectChoice: preferences.internalProjectChoice,
      internalProjectChoice1: preferences.internalProjectChoice1,
      choiceInternalProject1Motivation: preferences.internalProjectChoice1Motivation,
      internalProjectChoice2: preferences.internalProjectChoice2,
      choiceInternalProject2Motivation: preferences.internalProjectChoice2Motivation,
      internalProjectChoice3: preferences.internalProjectChoice3,
      choiceInternalProject3Motivation: preferences.internalProjectChoice3Motivation,
    });
  },
  /*
  setTraineePreferencesByMemberID(memberId: number, preferences: TraineeChoiceDto): Promise<void> {
    return this.update(memberId, {
      departmentChoice: preferences.departmentChoice,
      departmentChoice1: preferences.departmentChoice1,
      departmentChoice2: preferences.departmentChoice2,
      departmentChoice3: preferences.departmentChoice3,
      mentorChoice: preferences.mentorChoice,
      mentorChoice1: preferences.mentorChoice1,
      mentorChoice2: preferences.mentorChoice2,
      mentorChoice3: preferences.mentorChoice3,
      internalProjectChoice: preferences.internalProjectChoice,
      internalProjectChoice1: preferences.internalProjectChoice1,
      internalProjectChoice1Motivation: preferences.internalProjectChoice1Motivation,
      internalProjectChoice2: preferences.internalProjectChoice2,
      internalProjectChoice3: preferences.internalProjectChoice3,
    });
  },
  */
});
export const MemberHasWorkshopInstanceRepository = AppDataSource.getRepository(MemberHasWorkshopInstance).extend({
  /**
   * Retrieves for all mandatory workshops the feedback of a member
   * @param memberId The id of the member
   * @returns An array of mandatory workshop feedbacks with the workshop id and if feedback was given
   */
  async getFeedbackForMandatoryWorkshopsByMemberId(memberId: number): Promise<MandatoryWorkshopFeedback[]> {
    const instances: MemberHasWorkshopInstance[] = await this.find({
      relations: ["workshopInstance", "workshopInstance.workshop"],
      where: {
        memberId: memberId,
        type: "Teilnehmer",
        workshopInstance: {
          workshop: { type: "Pflichtworkshop" },
        },
      },
    });
    return instances.map((instance) => {
      return {
        workshopId: instance.workshopInstance.workshop.workshopId,
        feedbackGiven: instance.feedbackGiven,
      };
    });
  },
});
