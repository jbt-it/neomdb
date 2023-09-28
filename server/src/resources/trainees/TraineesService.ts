import { NotFoundError } from "../../types/errors";
import TraineesRepository from "./TraineesRepository";
import {
  Generation,
  InternalProject,
  JBTMail,
  Trainee,
  TraineeChoice,
  TraineeMotivation,
  TraineeAssignment,
  InternalProjectAndTrainee,
  Workshop,
} from "../../types/traineesTypes";
import { Mentor } from "../../types/membersTypes";
import MembersRepository from "../members/MembersRepository";

class TraineesService {
  traineesRepository = new TraineesRepository();
  memberRepository = new MembersRepository();

  /**
   * Get an internal project by its id
   * @throws NotFoundError if the internal project does not exist
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
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeChoicesByGenerationID = async (generationID: number): Promise<TraineeChoice[]> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const choices = await this.traineesRepository.getTraineeChoicesByGenerationID(generationID);

    return choices;
  };

  /**
   * Update an internal project by its id
   * @throws NotFoundError if the internal project does not exist
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
   * @throws NotFoundError if the internal project does not exist
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
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeMotivationsByGenerationID = async (generationID: number): Promise<TraineeMotivation[]> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const motivation = await this.traineesRepository.getTraineeMotivationsByGenerationID(generationID);

    return motivation;
  };

  /**
   * Get all generations
   */
  getGenerations = async (): Promise<Generation[]> => {
    const generations = await this.traineesRepository.getGenerations();

    return generations;
  };

  /**
   * Get all mentors of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getMentorsByGenerationID = async (generationID: number): Promise<Mentor[]> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const mentors = await this.traineesRepository.getMentorsByGenerationID(generationID);

    return mentors;
  };

  /**
   * Updates the voting deadline of a generation
   * @throws NotFoundError if the generation does not exist
   */
  updateVotingDeadline = async (generationID: number, votingStart: string, votingEnd: string): Promise<void> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    await this.traineesRepository.updateVotingDeadline(generationID, votingStart, votingEnd);
  };

  /**
   * Updates the assignment of a trainee
   * @throws NotFoundError if the member, mentor, internal project or department does not exist
   */
  updateAssignmentByMemberID = async (memberID: number, assignment: TraineeAssignment): Promise<void> => {
    // Check if the member (trainee) exists
    const member = await this.memberRepository.getMemberByID(memberID, false);
    if (member === null) {
      throw new NotFoundError(`Member with id ${memberID} not found`);
    }

    // Check if the mentor exists
    const mentor = await this.memberRepository.getMemberByID(assignment.mentorID, false);
    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${assignment.mentorID} not found`);
    }

    // Check if the internal project exists
    const ip = await this.traineesRepository.getIPByID(assignment.ipID);
    if (ip === null) {
      throw new NotFoundError(`IP with id ${assignment.ipID} not found`);
    }

    // Check if the department exists
    const department = await this.memberRepository.getDepartmentByID(assignment.departmentID);
    if (department === null) {
      throw new NotFoundError(`Department with id ${assignment.departmentID} not found`);
    }

    await this.traineesRepository.updateAssignmentByMemberID(memberID, assignment);
  };

  /**
   * Adds a mentor to a generation
   * @throws NotFoundError if the generation or mentor does not exist
   */
  addMentorToGeneration = async (generationID: number, mentorID: number): Promise<void> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const mentor = await this.memberRepository.getMemberByID(mentorID, false);

    if (mentor === null) {
      throw new NotFoundError(`Mentor with id ${mentorID} not found`);
    }

    await this.traineesRepository.addMentorToGeneration(generationID, mentorID);
  };

  /**
   * Get all internal projects of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getInternalProjectsByGenerationID = async (generationID: number): Promise<InternalProject[]> => {
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const ips = await this.traineesRepository.getInternalProjectsByGenerationID(generationID);

    return ips;
  };

  /**
   * Get all trainees
   */
  getTrainees = async (): Promise<Trainee[]> => {
    const trainees = await this.traineesRepository.getTrainees();

    return trainees;
  };

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   */
  getInternalProjects = async (onlyCurrent: boolean): Promise<InternalProject[]> => {
    const ips = await this.traineesRepository.getInternalProjects(onlyCurrent);

    return ips;
  };

  /**
   * Get trainee internal project milestones and given feedback for obligatory workshops
   * @param generationID ID of the generation
   * @returns A promise that resolves to an array containing the combined data
   */
  getIPMilestonesAndWorkshopFeedback = async (
    generationID: number
  ): Promise<(InternalProjectAndTrainee & Workshop)[]> => {
    // Fetch generation to check if it exists
    const generation = await this.traineesRepository.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    // Fetch internal project milestones by generation ID
    const ips: InternalProjectAndTrainee[] =
      await this.traineesRepository.getTraineeMilestonesfromInternalProjectsByGenerationID(generationID);
    // Fetch workshop feedback by generation ID
    const feedback: Workshop[] = await this.traineesRepository.getTraineeWorkshopFeedbackByGenerationID(generationID);
    // Create a Map object to group data by member ID
    const mapMemberIDToTrainingData = new Map<number, Record<string, number>>();

    // Fill the map with data from the "feedback" array
    feedback.forEach((item) => {
      const { mitgliedID, schulungsname, feedbackAbgegeben } = item;
      if (!mapMemberIDToTrainingData.has(mitgliedID)) {
        mapMemberIDToTrainingData.set(mitgliedID, {});
      }
      mapMemberIDToTrainingData.get(mitgliedID)![schulungsname] = feedbackAbgegeben;
    });

    // Combine data from the "ips" array
    const resultArray = ips.map((item) => {
      const { mitgliedID, ...rest } = item;
      const trainingData = mapMemberIDToTrainingData.get(mitgliedID) || {};
      return { mitgliedID, ...rest, ...trainingData } as InternalProjectAndTrainee & Workshop;
    });

    return resultArray;
  };
}

export default TraineesService;
