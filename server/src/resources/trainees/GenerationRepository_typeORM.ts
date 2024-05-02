import { AppDataSource } from "../../datasource";
import { Generation } from "../../typeOrm/entities/Generation";

export const GenerationRepository_typeORM = AppDataSource.getRepository(Generation).extend({
  /**
   * Retrievs a generation by its id
   * @param generationId The id of the generation
   * @returns The generation or null if no generation was found
   */
  getGenerationByID(generationId: number): Promise<Generation | null> {
    return this.findOne({ where: { generationId: generationId }, relations: ["members", "mentors"] });
  },

  /**
   * Retrieves all generations
   * @returns The generations
   */
  getGenerations(): Promise<Generation[]> {
    return this.find();
  },

  /**
   * Retrieves the ID of the current generation
   * @returns The ID of the current generation
   */
  async getCurrentGenerationId(): Promise<number> {
    const result = await AppDataSource.getRepository(Generation)
      .createQueryBuilder("generation")
      .select("MAX(generation.generationID)", "maxGenerationId")
      .getRawOne();
    return result.maxGenerationId;
  },

  /**
   * Updates the election deadlines of a generation
   * @param generationId - The id of the generation
   * @param electionStart - The new election start date
   * @param electionEnd - The new election end date
   * @returns The updated generation
   */
  updateElectionDeadline(generationId: number, electionStart: Date, electionEnd: Date): Promise<Generation> {
    return this.update(generationId, { electionStart: electionStart, electionEnd: electionEnd });
  },

  /**
   * Adds a mentor to a generation
   * @param generationId - The id of the generation
   * @param mentorId - The id of the mentor
   * @returns The updated generation
   */
  addMentorToGeneration(generationId: number, mentorId: number): Promise<Generation> {
    return this.createQueryBuilder().relation(Generation, "mentors").of(generationId).add(mentorId);
  },
});
