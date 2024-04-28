import { AppDataSource } from "../../datasource";
import { InternalProject } from "../../typeOrm/entities/InternalProject";
import { GenerationRepository_typeORM } from "./GenerationRepository_typeORM";

export const InternalProjectRepository_typeORM = AppDataSource.getRepository(InternalProject).extend({
  /**
   * Get an internal project by its id
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getIPByID(internalProjectId: number): Promise<InternalProject | null> {
    return this.findOne({ where: { internalProjectId: internalProjectId }, relations: ["qualityManagers"] });
  },

  getInternalProjects(currentGeneration?: number): Promise<InternalProject[]> {
    if (currentGeneration) {
      return this.find({ where: { generation: currentGeneration }, relations: ["qualityManagers"] });
    }
    return this.find({ relations: ["qualityManagers"] });
  },

  updateIPDetailsByID(internalProject: InternalProject): Promise<InternalProject> {
    return this.save(internalProject);
  },
});

export default InternalProjectRepository_typeORM;
