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

  getAllInternalProjects(): Promise<InternalProject[]> {
    return this.find({ relations: ["qualityManagers", "members", "generation"] });
  },

  getInternalProjectsByGenerationId(generationId: number): Promise<InternalProject[]> {
    return this.find({
      where: { generationId: generationId },
      relations: ["qualityManagers", "members", "generation"],
    });
  },

  updateIPDetailsByID(
    internalProject: InternalProject,
    transactionalEntityManager: EntityManager
  ): Promise<InternalProject> {
    return transactionalEntityManager.save(internalProject);
  },
});

export default InternalProjectRepository_typeORM;
