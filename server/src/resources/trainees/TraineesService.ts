import { NotFoundError } from "../../types/Errors";
import TraineesRepository from "./TraineesRepository";
import {
  InternalProject,
  JBTMail,
  TraineeMotivation,
  TraineeAssignment,
  InternalProjectAndTrainee,
  Workshop,
} from "../../types/traineesTypes";
import { Mentor } from "../../types/membersTypes";
import MembersRepository from "../members/MembersRepository";
import InternalProjectRepository_typeORM from "./InternalProjectRepository_typeORM";
import { TraineeRepository_typeORM } from "./TraineeRepository_typeORM";
import { GenerationRepository_typeORM } from "./GenerationRepository_typeORM";
import { InteralProjectMapper } from "./InteralProjectMapper";
import { TraineeChoiceDto, InternalProjectDto } from "../../typeOrm/types/traineeTypes";
import { MemberMapper } from "../../resources/members/MemberMapper";
import { TraineeMapper } from "./TraineeMapper";
import { MembersRepository_typeORM } from "../../resources/members/MembersRepository_typeORM";
import { MembersFieldDto } from "typeOrm/types/memberTypes";
import { Generation } from "../../typeOrm/entities/Generation";

class TraineesService {
  traineesRepository = new TraineesRepository();
  memberRepository = new MembersRepository();

  /**
   * Get an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  getIPByID = async (id: number) => {
    const internalProject = await InternalProjectRepository_typeORM.getIPByID(id);

    if (internalProject === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    const internalProjectMembers = await TraineeRepository_typeORM.getInternalProjectMembersByID(id);
    const generation = await GenerationRepository_typeORM.getGenerationByID(internalProject.generation);

    return InteralProjectMapper.internalProjectToInternalProjectDto(
      internalProject,
      generation,
      internalProjectMembers
    );
  };

  /**
   * Get the choices of all trainees of a generation
   * @throws NotFoundError if the generation does not exist
   */
  getTraineeChoicesByGenerationID = async (generationID: number): Promise<TraineeChoiceDto[]> => {
    const generation = GenerationRepository_typeORM.getGenerationByID(generationID);

    if (generation === null) {
      throw new NotFoundError(`Generation with id ${generationID} not found`);
    }

    const choices = await TraineeRepository_typeORM.getTraineeChoicesByGenerationID(generationID);

    return choices.map((choice) => TraineeMapper.memberToTraineeChoiceDto(choice));
  };

  /**
   * Update an internal project by its id
   * @throws NotFoundError if the internal project does not exist
   */
  updateIPByID = async (id: number, updatedIp: InternalProjectDto): Promise<void> => {
    const ip = await InternalProjectRepository_typeORM.getIPByID(id);
    const ipMembers = await TraineeRepository_typeORM.getInternalProjectMembersByID(id);

    if (ip === null) {
      throw new NotFoundError(`IP with id ${id} not found`);
    }

    const ipMemberIDs = updatedIp.members.map((member) => member.memberId);
    const oldIPMemberIDs = ipMembers
      .filter((member) => ipMemberIDs.includes(member.memberId) === false)
      .map((member) => member.memberId);

    const newQms = updatedIp.qualityManagers.map((qm) => MembersRepository_typeORM.getMemberByID(qm.memberId));

    ip.projectName = updatedIp.projectName;
    ip.abbreviation = updatedIp.abbreviation;
    ip.kickoff = updatedIp.kickoff;
    ip.offerAtEv = updatedIp.offerAtEv;
    ip.zpAtEv = updatedIp.zpAtEv;
    ip.zpHeld = updatedIp.zpHeld;
    ip.apAtEv = updatedIp.apAtEv;
    ip.apHeld = updatedIp.apHeld;
    ip.dlAtEv = updatedIp.dlAtEv;
    ip.generation = updatedIp.generation;
    ip.qualityManagers = await Promise.all(newQms);

    InternalProjectRepository_typeORM.updateIPDetailsByID(ip);
    oldIPMemberIDs.map((memberID) => TraineeRepository_typeORM.updateIPMembers(null, memberID));
    ipMemberIDs.map((memberID) => TraineeRepository_typeORM.updateIPMembers(id, memberID));
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
    const generations = await GenerationRepository_typeORM.getGenerations();

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
  getTrainees = async (): Promise<MembersFieldDto[]> => {
    const trainees = await TraineeRepository_typeORM.getTrainees();

    return trainees.map((trainee) => MemberMapper.memberToMemberFieldDto(trainee));
  };

  /**
   * Get all internal projects
   * @param onlyCurrent if true, only the current internal projects are returned
   */
  getInternalProjects = async (onlyCurrent: boolean): Promise<InternalProjectDto[]> => {
    const currentGeneration = await GenerationRepository_typeORM.getCurrentGenerationId();
    const ips = onlyCurrent
      ? await InternalProjectRepository_typeORM.getInternalProjects(currentGeneration)
      : await InternalProjectRepository_typeORM.getInternalProjects();

    const internalProjects = await Promise.all(
      ips.map(async (internalProject) => {
        const internalProjectMembers = await TraineeRepository_typeORM.getInternalProjectMembersByID(
          internalProject.internalProjectId
        );
        const generation = await GenerationRepository_typeORM.getGenerationByID(internalProject.generation);

        const ip = InteralProjectMapper.internalProjectToInternalProjectDto(
          internalProject,
          generation,
          internalProjectMembers
        );
        return ip;
      })
    );

    return internalProjects;
  };

  /**
   * Get trainee internal project milestones and given feedback for obligatory workshops
   * @param generationID ID of the generation
   * @returns A promise that resolves to an array containing the combined data
   */
  getTraineeProgress = async (generationID: number): Promise<(InternalProjectAndTrainee & Workshop)[]> => {
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
