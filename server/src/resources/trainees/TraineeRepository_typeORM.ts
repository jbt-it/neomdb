import { UpdateResult } from "typeorm";
import { AppDataSource } from "../../datasource";
import { Department } from "../../typeOrm/entities/Department";
import { Member } from "../../typeOrm/entities/Member";
import { MemberHasWorkshopInstance } from "../../typeOrm/entities/MemberHasWorkshopInstance";
import { MandatoryWorkshopFeedback } from "../../typeOrm/types/traineeTypes";

export const TraineeRepository_typeORM = AppDataSource.getRepository(Member).extend({
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
