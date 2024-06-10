import { AppDataSource } from "../../datasource";
import { InternalProject } from "../../entities/InternalProject";

export const InternalProjectRepository = AppDataSource.getRepository(InternalProject).extend({
  /**
   * Get an internal project by its id
   * @param id id of the internal project
   * @throws QueryError if the query fails
   */
  getInternalProjectByID(internalProjectId: number): Promise<InternalProject | null> {
    return this.findOne({
      where: { internalProjectId: internalProjectId },
      relations: ["qualityManagers", "members", "generation", "members.memberStatus", "qualityManagers.memberStatus"],
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
   * Saves the internal project
   * @param internalProject The internal project to be saved
   * @returns The saved internal project
   */
  saveInternalProject(internalProject: InternalProject): Promise<InternalProject> {
    return this.save(internalProject);
  },
});

export default InternalProjectRepository;
