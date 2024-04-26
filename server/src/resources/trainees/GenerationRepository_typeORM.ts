import { AppDataSource } from "../../datasource";
import { Generation } from "../../typeOrm/entities/Generation";

export const GenerationRepository_typeORM = AppDataSource.getRepository(Generation).extend({
  /**
   * Retrievs a generation by its id
   * @param generationId The id of the generation
   * @returns The generation or null if no generation was found
   */
  getGenerationByID(generationId: number): Promise<Generation | null> {
    return this.findOne({ where: { generationId: generationId } });
  },
});
