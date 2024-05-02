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

  getGenerations(): Promise<Generation[]> {
    return this.find();
  },

  async getCurrentGenerationId(): Promise<number> {
    const result = await AppDataSource.getRepository(Generation)
      .createQueryBuilder("generation")
      .select("MAX(generation.generationID)", "maxGenerationId")
      .getRawOne();
    return result.maxGenerationId;
  },

  updateVotingDeadline(generationId: number, electionStart: Date, electionEnd: Date): Promise<Generation> {
    return this.update(generationId, { electionStart: electionStart, electionEnd: electionEnd });
  },

  addMentorToGeneration(generationId: number, mentorId: number): Promise<Generation> {
    return this.createQueryBuilder().relation(Generation, "mentors").of(generationId).add(mentorId);
  },
});
