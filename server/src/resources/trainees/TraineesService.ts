import { NotFoundError } from "../../types/errors";
import TraineesRepository from "./TraineesRepository";
import { InternalProject, JBTMail, TraineeMotivation } from "../../types/traineesTypes";

class TraineesService {
  traineesRepository = new TraineesRepository();

  /**
   * Get an internal project by its id
   */
  getIPByID = async (id: number): Promise<InternalProject> => {
    const ip = await this.traineesRepository.getIPByID(id);

    if (ip === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    return ip;
  };

  /**
   * Get the choices of all trainees of a generation
   */
  getTraineeChoicesByGenerationID = async (generationID: number): Promise<any> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const choices = await this.traineesRepository.getTraineeChoicesByGenerationID(generationID);

    return choices;
  };

  /**
   * Update an internal project by its id
   */
  updateIPByID = async (id: number, updatedIp: InternalProject): Promise<void> => {
    const ip = await this.traineesRepository.getIPByID(id);

    if (ip === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    await this.traineesRepository.updateIPByID(id, updatedIp);
  };

  /**
   * Get the mails of all trainees of an internal project
   */
  getTraineeMailsByIpID = async (id: number): Promise<JBTMail[]> => {
    const ip = await this.traineesRepository.getIPByID(id);

    if (ip === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    const mails = await this.traineesRepository.getTraineeMailsByIpID(id);

    return mails;
  };

  /**
   * Get the motivation of all trainees of a generation
   */
  getTraineeMotivationsByGenerationID = async (generationID: number): Promise<TraineeMotivation[]> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const motivation = await this.traineesRepository.getTraineeMotivationsByGenerationID(generationID);

    return motivation;
  };
}

export default TraineesService;
