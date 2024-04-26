import { AppDataSource } from "../../datasource";
import { Member } from "../../typeOrm/entities/Member";

export const TraineeRepository_typeORM = AppDataSource.getRepository(Member).extend({
  /**
   * Retrieves a trainees by internal project id
   * @param internalProjectId The id of the internal project
   * @returns The member or null if no member was found
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
   * Retrieves choices of mentor, internal project and department of all trainees of given generation
   * @param generationId The id of the generation
   * @returns The trainee choices
   */
  getTraineeChoicesByGenerationID(generationId: number): Promise<Member[]> {
    return this.find({ where: { generationId: generationId } });
  },
});
