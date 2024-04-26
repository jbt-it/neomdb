import { AppDataSource } from "../../datasource";
import { InternalProject } from "../../typeOrm/entities/InternalProject";

export const InternalProjectRepository_typeORM = AppDataSource.getRepository(InternalProject).extend({
  /**
   * Get an internal project by its id
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getIPByID(internalProjectId: number): Promise<InternalProject | null> {
    return this.findOne({ where: { internalProjectId: internalProjectId }, relations: ["qualityManagers"] });
  },

  /**
   * Get a generation by its id
   * @param id id of the generation
   * @throws QueryError if the query fails
   */

  /**
   * Get all choices of trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */

  /**
   * Update the details of an internal project by its id
   * @param id id of the internal project
   * @param updatedIp updated internal project
   * @throws QueryError if the query fails
   */

  /**
   * Update the assigned IP of each trainee
   * @param id id of the internal project or null if the trainee should be removed from the ip
   * @param projectMembers array of memberIDs of the trainees
   */

  /**
   * Update the assigned QMs of the IP
   * @param id id of the internal project
   * @param qms array of memberIDs of the qms
   */

  /**
   * Get the mails of all trainees of an internal project
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */

  /**
   * Get the motivations of all trainees of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */

  /**
   * Get all generations
   * @throws QueryError if the query fails
   */

  /**
   * Get all mentors of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */

  /**
   * Updates the voting deadline of a generation
   * @param generationID id of the generation
   * @param votingStart start of the voting period
   * @param votingEnd end of the voting period
   * @throws QueryError if the query fails
   */

  /**
   * Update the assignment of a trainee
   * @param traineeID id of the trainee
   * @param ipID id of the internal project
   * @param mentorID id of the mentor
   * @param departmentID id of the department
   * @throws QueryError if the query fails
   */

  /**
   * Adds a mentor to a generation
   * @param generationID id of the generation
   * @param mentorID id of the mentor
   * @throws QueryError if the query fails or the mentor is already assigned to the generation
   */

  /**
   * Get all internal projects of a generation
   * @param generationID id of the generation
   * @throws QueryError if the query fails
   */

  /**
   * Get all trainees
   * @throws QueryError if the query fails
   */

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   * @throws QueryError if the query fails
   */

  /**
   * For all trainees of a given generation get internal project milestones
   * @param generationID ID of the generation
   * @throws QueryError if the query fails
   */

  /**
   * For all trainees of a given generation get boolen if feedback was given for obligatory workshop
   * @param generationID ID of the generation
   * @throws QueryError if the query fails
   */
});

export default InternalProjectRepository_typeORM;
