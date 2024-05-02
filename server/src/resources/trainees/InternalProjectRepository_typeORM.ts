import { EntityManager } from "typeorm";
import { AppDataSource } from "../../datasource";
import { InternalProject } from "../../typeOrm/entities/InternalProject";

export const InternalProjectRepository_typeORM = AppDataSource.getRepository(InternalProject).extend({
  /**
   * Get an internal project by its id
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getIPByID(internalProjectId: number): Promise<InternalProject | null> {
    return this.findOne({
      where: { internalProjectId: internalProjectId },
      relations: ["qualityManagers", "members", "generation"],
    });
  },

  /**
   * Get all internal projects
   * @returns all internal projects
   */
  getAllInternalProjects(): Promise<InternalProject[]> {
    return this.find({ relations: ["qualityManagers", "members", "generation"] });
  },

  /**
   * Get all internal projects of a generation
   * @param generationId id of the generation
   * @returns all internal projects of the generation
   */
  getInternalProjectsByGenerationId(generationId: number): Promise<InternalProject[]> {
    return this.find({
      where: { generationId: generationId },
      relations: ["qualityManagers", "members", "generation"],
    });
  },

  /**
   * Update the details of an internal project
   * @param internalProject The internal project to be updated
   * @param transactionalEntityManager The transactional entity manager
   * @returns The updated internal project
   */
  updateIPDetailsByID(
    internalProject: InternalProject,
    transactionalEntityManager: EntityManager
  ): Promise<InternalProject> {
    return transactionalEntityManager.save(internalProject);
  },
});

export default InternalProjectRepository_typeORM;
